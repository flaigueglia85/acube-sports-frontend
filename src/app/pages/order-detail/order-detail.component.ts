import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  order: any = null;
  loading = true;
  error = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.http.get(`/wp-json/custom/v1/orders/${id}`, { withCredentials: true })
      .subscribe({
        next: res => {
          this.order = res;
          this.loading = false;
        },
        error: err => {
          console.error('Errore ordine:', err);
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
