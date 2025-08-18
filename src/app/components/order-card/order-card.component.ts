import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPdfService } from 'app/services/order-pdf.service';
import { HttpClient } from '@angular/common/http';
import { NgIcon } from '@ng-icons/core';

@Component({
    selector: 'app-order-card',
    standalone: true,
    imports: [CommonModule,NgIcon],
    templateUrl: './order-card.component.html'
})
export class OrderCardComponent {
    @Input() order!: { id: number; status: string; total: string; date: string; items: any[] };

    private pdf = inject(OrderPdfService);
    private http = inject(HttpClient);

    printOrder() {
        this.http.get(`/wp-json/custom/v1/orders/${this.order.id}`, { withCredentials: true })
            .subscribe({
                next: (fullOrder: any) => {
                    this.pdf.generate(fullOrder);
                },
                error: err => {
                    console.error('Errore caricamento ordine per PDF:', err);
                    alert('Impossibile generare il PDF in questo momento.');
                }
            });
    }
}
