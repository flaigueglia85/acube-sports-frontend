import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { OrderCardComponent } from 'app/components/order-card/order-card.component';
import { NgIconsModule } from '@ng-icons/core';

interface Order {
    id: number;
    status: string;
    total: string;
    date: string;
    items: { name: string; quantity: number; total: string; image?: string | null }[];
}

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule,OrderCardComponent,NgIconsModule],
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
    private http = inject(HttpClient);

    orders: Order[] = [];
    activeOrders: Order[] = [];
    completedOrders: Order[] = [];
    cancelledOrders: Order[] = [];
    loading = true;
    error = false;

    ngOnInit() {
        this.http.get<Order[]>('/wp-json/custom/v1/orders/mine', { withCredentials: true })
            .subscribe({
                next: res => {
                    this.orders = res;
                    this.activeOrders = res.filter(o => ['on-hold', 'processing'].includes(o.status));
                    this.completedOrders = res.filter(o => o.status === 'completed');
                    this.cancelledOrders = res.filter(o => ['cancelled', 'failed'].includes(o.status));
                    this.loading = false;
                },
                error: err => {
                    console.error('Errore caricamento ordini:', err);
                    this.error = true;
                    this.loading = false;
                }
            });
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            'on-hold': 'In attesa',
            'processing': 'In lavorazione',
            'completed': 'Completato',
            'cancelled': 'Annullato',
            'failed': 'Fallito',
        };
        return map[status] || status;
    }
}
