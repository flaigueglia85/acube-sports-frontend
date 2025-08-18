import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RawOrderData, OrderPdfService } from 'app/services/order-pdf.service';

@Component({
    standalone: true,
    selector: 'app-order-confirmation',
    imports: [CommonModule, RouterModule],
    templateUrl: './order-confirmation.component.html',
    styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent {
    constructor(private orderPdf: OrderPdfService, private router: Router) {
        const nav = this.router.getCurrentNavigation();
        this.order = nav?.extras?.state?.['order'] || null;
    }

    // Simulazione: in produzione prendi l'ordine dal backend o dallo stato globale
    order: RawOrderData;

    downloadPdf() {
        this.orderPdf.generate(this.order);
    }
}
