import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

type Size = 'sm'|'md'|'lg';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [NgClass,NgIf],
  template: `
    <div class="w-full" [ngClass]="{ 'fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm grid place-items-center': overlay }">
      <div class="flex items-center justify-center gap-3" role="status" aria-live="polite">
        <span class="spinner" [ngClass]="sizeClass" aria-hidden="true"></span>
        <span *ngIf="label" class="text-sm text-gray-600">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .spinner {
      display:inline-block; border-radius:9999px; border-style:solid; border-color: currentColor transparent currentColor transparent;
      animation: spin 1s linear infinite;
    }
    .sm { width: 16px; height:16px; border-width:2px; }
    .md { width: 24px; height:24px; border-width:3px; }
    .lg { width: 36px; height:36px; border-width:4px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() label = '';
  @Input() size: Size = 'md';
  @Input() overlay = false;

  get sizeClass() {
    return {
      'text-primary sm': this.size === 'sm',
      'text-primary md': this.size === 'md',
      'text-primary lg': this.size === 'lg',
    };
  }
}
