// src/app/components/dynamic-drawer/dynamic-drawer.component.ts
import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DrawerConfig, DrawerService } from '@shell/drawer/drawer.service';

@Component({
  selector: 'app-dynamic-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-drawer-container class="drawer-container" [hasBackdrop]="!isDesktop">
      <mat-drawer 
        #drawer 
        [mode]="drawerMode" 
        [opened]="isOpen"
        [disableClose]="config?.disableClose || false"
        position="end"
        class="dynamic-drawer"
        [style.width]="drawerWidth"
        (openedChange)="onDrawerToggle($event)">
        
        <!-- Header del drawer -->
        <div class="drawer-header">
          <button 
            mat-icon-button 
            (click)="closeDrawer()"
            class="close-button">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Contenuto dinamico -->
        <div class="drawer-content">
          <ng-container #dynamicContent></ng-container>
        </div>
      </mat-drawer>
    </mat-drawer-container>
  `,
  styles: [`
    .drawer-container {
      position: fixed;
      top: 4rem; /* Altezza dell'header */
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 40; /* sotto l'header (z-50) */
      pointer-events: none;
    }

    .dynamic-drawer {
      pointer-events: auto;
      max-width: 90vw;
      background: white;
      box-shadow: -2px 0 8px rgba(0,0,0,0.15);
    }

    .drawer-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      min-height: 48px;
    }

    .close-button {
      margin-left: auto;
    }

    .drawer-content {
      padding: 16px;
      height: calc(100% - 48px);
      overflow-y: auto;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dynamic-drawer {
        max-width: 100vw;
      }
      
      .drawer-content {
        padding: 12px;
      }
    }
  `]
})
export class DynamicDrawerComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true }) 
  dynamicContent!: ViewContainerRef;

  isOpen = false;
  config: DrawerConfig | null = null;
  drawerMode: 'over' | 'push' | 'side' = 'over';
  drawerWidth = '400px';
  isDesktop = false;

  private destroy$ = new Subject<void>();

  constructor(
    private drawerService: DrawerService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // Imposta il ViewContainerRef nel servizio
    this.drawerService.setViewContainerRef(this.dynamicContent);

    // Ascolta i cambiamenti di stato del drawer
    this.drawerService.isOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isOpen = isOpen;
      });

    this.drawerService.config$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        this.config = config;
        if (config?.width) {
          this.drawerWidth = config.width;
        } else {
          this.setResponsiveWidth();
        }
      });

    // Gestione responsività
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isDesktop = result.breakpoints[Breakpoints.Large];
        this.drawerMode = this.isDesktop ? 'over' : 'over';
        this.setResponsiveWidth();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDrawer() {
    this.drawerService.close();
  }

  onDrawerToggle(isOpen: boolean) {
    if (!isOpen && this.isOpen) {
      this.drawerService.close();
    }
  }

  private setResponsiveWidth() {
    if (!this.config?.width) {
      if (this.isDesktop) {
        this.drawerWidth = '400px';
      } else {
        this.drawerWidth = '90vw';
      }
    }
  }
}