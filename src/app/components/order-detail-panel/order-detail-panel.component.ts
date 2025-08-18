import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DRAWER_DATA, DrawerRef } from '@shell/drawer/drawer.token';

@Component({
  selector: 'app-order-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail-panel.component.html',
})
export class OrderDetailPanelComponent implements OnInit {
  constructor(
    @Inject(DRAWER_DATA) private data: { orderId: number },
    private drawer: DrawerRef,
    private http: HttpClient
  ) {}

  order: any = null;
  loading = true;

  ngOnInit(): void {
    this.http.get(`/wp-json/custom/v1/orders/${this.data.orderId}`, { withCredentials: true })
      .subscribe({
        next: res => {
          this.order = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  close() {
    this.drawer.close();
  }
}
