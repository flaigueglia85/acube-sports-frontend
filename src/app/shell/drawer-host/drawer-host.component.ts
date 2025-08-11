// src/app/shell/drawer-host/drawer-host.component.ts
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductDetailDrawerComponent } from '../../components/product-detail-panel/product-detail-panel.component';
import { ProductDetailDrawerService } from '../../services/product-detail-drawer.service';

@Component({
  selector: 'app-drawer-host',
  standalone: true,
  imports: [AsyncPipe, MatSidenavModule, ProductDetailDrawerComponent],
  template: `
<mat-drawer-container class="fixed inset-0 z-[1000] pointer-events-none">
  <div mat-drawer-content></div>
  <mat-drawer
    class="pointer-events-auto"
    position="end"
    mode="over"
    [opened]="svc.isOpen$ | async"
    (closedStart)="svc.close()">
    <app-product-detail-drawer
      [product]="(svc.product$ | async)!"
      (close)="svc.close()">
    </app-product-detail-drawer>
  </mat-drawer>
</mat-drawer-container>
  `
})
export class DrawerHostComponent {
  svc = inject(ProductDetailDrawerService);
}
