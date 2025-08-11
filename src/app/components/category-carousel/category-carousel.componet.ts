// src/app/components/category-carousel/category-carousel.component.ts
import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CategoryService, WcCategory } from '../../services/category.service';

@Component({
  selector: 'app-category-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-carousel.component.html',
  styleUrls: ['./category-carousel.component.scss']
})
export class CategoryCarouselComponent implements AfterViewInit, OnDestroy {
  @Input() visible = 4;        // quante card visibili
  @Input() autoplayMs = 2200;  // intervallo autoplay

  categories: WcCategory[] = [];
  stream: WcCategory[] = [];   // duplicato per loop
  loading = true;

  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('track', { static: true }) track!: ElementRef<HTMLDivElement>;

  viewportWidth = 0;   // <-- bindata in HTML
  private stepPx = 0;  // distanza tra card (gap + larghezza)
  private timer: any = null;

  private licensed = ['Genoa','Atalanta','Como','Hellas Verona','AS Roma','Bologna'];

  constructor(private cats: CategoryService, private router: Router) {}

  ngAfterViewInit(): void {
    this.cats.getAllCategories().subscribe({
      next: (all) => {
        const byName = new Map(all.map(c => [c.name.toLowerCase(), c]));
        const selected: WcCategory[] = this.licensed
          .map(n => byName.get(n.toLowerCase()))
          .filter((x): x is WcCategory => !!x)
          .map(c => ({ ...c, image: c.image ?? { src: '/assets/placeholder.png' } }));

        this.categories = selected;
        this.stream = [...selected, ...selected]; // per loop
        this.loading = false;

        setTimeout(() => {
          this.computeMetrics();   // misura card & calcola viewportWidth/stepPx
          this.startAutoplay();
        });
      },
      error: () => { this.loading = false; }
    });

    // pausa autoplay su hover/tab nascosta
    this.viewport.nativeElement.addEventListener('mouseenter', () => this.stopAutoplay());
    this.viewport.nativeElement.addEventListener('mouseleave', () => this.startAutoplay());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAutoplay(); else this.startAutoplay();
    });

    // resize -> ricalcola dimensioni esatte
    window.addEventListener('resize', this.computeMetrics);
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    window.removeEventListener('resize', this.computeMetrics);
  }

  /** misura reale: distanza tra 1a e 2a card (step) e larghezza card */
  computeMetrics = () => {
    const cards = this.track.nativeElement.querySelectorAll<HTMLElement>('.team-card');
    if (cards.length < 2) return;

    const first  = cards[0];
    const second = cards[1];

    // step = distanza orizzontale tra due card adiacenti (tiene conto del gap)
    const step   = Math.round(second.offsetLeft - first.offsetLeft);
    const width  = Math.round(first.getBoundingClientRect().width);

    this.stepPx = step;
    // viewportWidth = cardWidth + step*(visible-1)
    this.viewportWidth = width + step * (this.visible - 1);
  };

  private startAutoplay() {
    if (this.timer || this.loading || !this.stepPx) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const vp = this.viewport.nativeElement;
    const tr = this.track.nativeElement;
    const half = tr.scrollWidth / 2; // lunghezza della prima metà (prima del duplicato)

    this.timer = setInterval(() => {
      // se supero metà, “riavvolgo” senza salto visivo
      if (vp.scrollLeft + this.stepPx >= half) {
        // mantieni la stessa posizione relativa nella prima metà
        vp.scrollLeft = vp.scrollLeft - half + this.stepPx;
      } else {
        vp.scrollBy({ left: this.stepPx, behavior: 'smooth' });
      }
    }, this.autoplayMs);
  }

  private stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  prev() {
    this.stopAutoplay();
    const vp = this.viewport.nativeElement;
    const tr = this.track.nativeElement;
    const half = tr.scrollWidth / 2;

    if (vp.scrollLeft - this.stepPx < 0) {
      // vai alla metà, meno uno step → effetto loop all’indietro
      vp.scrollLeft = vp.scrollLeft + half - this.stepPx;
    } else {
      vp.scrollBy({ left: -this.stepPx, behavior: 'smooth' });
    }
  }

  next() {
    this.stopAutoplay();
    const vp = this.viewport.nativeElement;
    const tr = this.track.nativeElement;
    const half = tr.scrollWidth / 2;

    if (vp.scrollLeft + this.stepPx >= half) {
      vp.scrollLeft = vp.scrollLeft - half + this.stepPx;
    } else {
      vp.scrollBy({ left: this.stepPx, behavior: 'smooth' });
    }
  }

  goToCategory(cat: WcCategory) {
    this.router.navigate(['/prodotti'], { queryParams: { category: cat.id } });
  }
}
