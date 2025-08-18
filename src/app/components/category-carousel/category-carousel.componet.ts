import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService, WcCategory } from '../../services/category.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() baseSpeed = 90;     // px/sec desktop
  @Input() baseSpeedMobile = 60;
  @Input() licensed: string[] = ['Genoa','Atalanta','Como','Hellas Verona','AS Roma','Bologna'];

  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('track',    { static: true }) track!: ElementRef<HTMLDivElement>;

  loading = true;
  categories: WcCategory[] = [];
  stream: WcCategory[] = [];

  // animazione
  transform = 'translateX(0)';
  private pos = 0;             // posizione corrente in px (negativa verso sinistra)
  private segW = 1;            // larghezza di un “segmento” (una lista)
  private raf: number | null = null;
  private lastTs = 0;
  private speed = 80;          // px/sec corrente
  private reduced = false;

  // drag + inerzia
  private dragging = false;
  private dragStartX = 0;
  private dragPosStart = 0;
  private vx = 0;              // velocità per inerzia
  private lastMoveTs = 0;
  private ro?: ResizeObserver;

  constructor(private cats: CategoryService, private router: Router) {}

  ngAfterViewInit(): void {
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.cats.getAllCategories().subscribe({
      next: (all) => {
        const byName = new Map(all.map(c => [c.name.toLowerCase(), c]));
        const selected = this.licensed
          .map(n => byName.get(n.toLowerCase()))
          .filter((x): x is WcCategory => !!x)
          .map(c => ({ ...c, image: c.image ?? { src: '/assets/placeholder.png' } }));

        this.categories = selected;
        // triplichiamo per buffer infinito
        this.stream = [...selected, ...selected, ...selected];
        this.loading = false;

        queueMicrotask(() => {
          this.measure();
          this.setSpeedByDevice();
          this.start();
        });
      },
      error: () => { this.loading = false; }
    });

    document.addEventListener('visibilitychange', this.onVis);
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(this.track.nativeElement);
  }

  ngOnDestroy(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.onVis);
    this.ro?.disconnect();
  }

  private onVis = () => document.hidden ? this.stop() : this.start();

  private setSpeedByDevice() {
    const isMobile = matchMedia('(max-width: 768px)').matches;
    this.speed = isMobile ? this.baseSpeedMobile : this.baseSpeed;
  }

  private measure() {
    // calcola larghezza di un segmento = somma card + gap per il primo “blocco”
    const cards = this.track.nativeElement.querySelectorAll<HTMLElement>('.team-card');
    if (!cards.length) return;

    // segmento = 1/3 della track (abbiamo triplicato)
    this.segW = Math.max(1, Math.round(this.track.nativeElement.scrollWidth / 3));
  }

  // loop RAF
  private tick = (ts: number) => {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min(0.05, (ts - this.lastTs) / 1000); // clamp 50ms
    this.lastTs = ts;

    // applica velocità di base + eventuale inerzia
    const v = (this.dragging ? 0 : this.speed) + this.vx;
    this.pos -= v * dt;

    // wrap modulo segW per loop perfetto
    if (this.pos <= -this.segW) this.pos += this.segW;
    if (this.pos >= 0)         this.pos -= this.segW;

    this.transform = `translateX(${this.pos}px)`;

    // smorzamento inerzia
    if (!this.dragging) {
      this.vx *= 0.94; // attrito
      if (Math.abs(this.vx) < 2) this.vx = 0;
    }

    this.raf = requestAnimationFrame(this.tick);
  };

  private start() {
    if (this.reduced || this.loading || this.raf) return;
    this.lastTs = 0;
    this.raf = requestAnimationFrame(this.tick);
  }

  private stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.lastTs = 0;
  }

  pause()  { this.stop(); }
  resume() { this.setSpeedByDevice(); this.start(); }

  // piccoli scatti con i controlli
  nudge(dir: 1 | -1) {
    this.pause();
    this.pos -= dir * (this.cardStep() * 1.1);
    this.transform = `translateX(${this.pos}px)`;
    this.resume();
  }

  private cardStep(): number {
    // distanza media tra due card adiacenti
    const cards = this.track.nativeElement.querySelectorAll<HTMLElement>('.team-card');
    if (cards.length < 2) return 160 + 20;
    const a = cards[0].getBoundingClientRect();
    const b = cards[1].getBoundingClientRect();
    return Math.abs(b.left - a.left);
    }

  // Drag con inerzia
  onPointerDown(ev: PointerEvent) {
    (ev.target as Element).setPointerCapture?.(ev.pointerId);
    this.dragging = true;
    this.pause();
    this.dragStartX = ev.clientX;
    this.dragPosStart = this.pos;
    this.vx = 0;
    this.lastMoveTs = performance.now();
  }
  onPointerMove(ev: PointerEvent) {
    if (!this.dragging) return;
    const dx = ev.clientX - this.dragStartX;
    this.pos = this.dragPosStart + dx;
    // wrap per evitare salti quando trascini molto
    if (this.pos <= -this.segW) this.pos += this.segW;
    if (this.pos >= 0)         this.pos -= this.segW;
    this.transform = `translateX(${this.pos}px)`;

    const now = performance.now();
    const dt = now - this.lastMoveTs;
    if (dt > 0) this.vx = (dx / dt) * 1000; // px/sec
    this.lastMoveTs = now;
  }
  onPointerUp(_: PointerEvent) {
    if (!this.dragging) return;
    this.dragging = false;
    // mantiene un po' di inerzia ma limitata
    this.vx = Math.max(-300, Math.min(300, this.vx));
    this.resume();
  }

  goToCategory(cat: WcCategory) {
    this.router.navigate(['/prodotti'], { queryParams: { category: cat.id } });
  }
}
