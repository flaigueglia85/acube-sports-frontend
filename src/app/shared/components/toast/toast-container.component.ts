// toast-container.component.ts
import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';
import { Toast } from '@shared/models/toast.model';
import { ToastItemComponent } from './toast-item.component';
import { ToastService } from 'app/services/common/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgClass, ToastItemComponent],
  template: `
    <!-- top -->
    <div class="toast-stack top" [ngClass]="posClass('top')">
      <app-toast-item *ngFor="let t of topToasts()" [toast]="t"></app-toast-item>
    </div>
    <!-- bottom -->
    <div class="toast-stack bottom" [ngClass]="posClass('bottom')">
      <app-toast-item *ngFor="let t of bottomToasts()" [toast]="t"></app-toast-item>
    </div>
  `,
  styles: [`
    :host { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
    .toast-stack { position: absolute; width: 100%; display: grid; gap: 8px; padding: 12px; }
    .top    { top: 0; }
    .bottom { bottom: 0; }
    .left   { justify-items: start; }
    .center { justify-items: center; }
    .right  { justify-items: end; }
  `]
})
export class ToastContainerComponent {
  private svc = inject(ToastService);
  toasts = signal<Toast[]>([]);
  constructor() { this.svc.toasts$.subscribe(v => this.toasts.set(v)); }

  topToasts  = computed(() => this.toasts().filter(t => t.pos.startsWith('top')));
  bottomToasts = computed(() => this.toasts().filter(t => t.pos.startsWith('bottom')));

  posClass(area: 'top'|'bottom') {
    const any = (area === 'top' ? this.topToasts() : this.bottomToasts())[0];
    const align = any?.pos?.split('-')[1] ?? 'right';
    return { left: align === 'left', center: align === 'center', right: align === 'right' };
  }
}
