// toast-item.component.ts
import { Component, Input, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { ToastService } from 'app/services/common/toast.service';
import { Toast } from '@shared/models/toast.model';

@Component({
    selector: 'app-toast-item',
    standalone: true,
    imports: [NgClass],
    animations: [
        // slide (da lato coerente con stack)
        trigger('slide', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-16px)' }),
                animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
            ])
        ]),
        // fade
        trigger('fade', [
            transition(':enter', [style({ opacity: 0 }), animate('180ms ease-out', style({ opacity: 1 }))]),
            transition(':leave', [animate('120ms ease-in', style({ opacity: 0 }))])
        ]),
        // rubber (gommosa)
        trigger('rubber', [
            transition(':enter', [
                animate('420ms cubic-bezier(.175,.885,.32,1.275)', keyframes([
                    style({ offset: 0, opacity: 0, transform: 'scale(0.8)' }),
                    style({ offset: 0.4, opacity: 1, transform: 'scale(1.08)' }),
                    style({ offset: 0.7, transform: 'scale(0.96)' }),
                    style({ offset: 1, transform: 'scale(1)' }),
                ]))
            ]),
            transition(':leave', [
                animate('160ms ease-in', style({ opacity: 0, transform: 'scale(0.98)' }))
            ])
        ]),
    ],
    template: `
    <div class="toast"
         [@slide]="toast.anim==='slide' ? 'in' : null"
         [@fade]="toast.anim==='fade' ? 'in' : null"
         [@rubber]="toast.anim==='rubber' ? 'in' : null"
         [ngClass]="cls()"
         (mouseenter)="hover=true" (mouseleave)="hover=false">
      <span class="msg">{{ toast.message }}</span>
      <button type="button" class="x" (click)="close()">×</button>
    </div>
  `,
    styleUrls:['./toast-item.component.scss']
})
export class ToastItemComponent {
    @Input() toast!: Toast;
    hover = false;
    private svc = inject(ToastService);

    close() { this.svc.dismiss(this.toast.id); }
    cls() {
        return {
            info: this.toast.type === 'info',
            success: this.toast.type === 'success',
            warning: this.toast.type === 'warning'
        };
    }
}
