// src/app/shell/drawer/drawer-host.component.ts
import { Component, Injector, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PortalModule, ComponentPortal } from '@angular/cdk/portal';
import { DrawerService } from './drawer.service';
import { DRAWER_DATA, DrawerRef } from './drawer.token';

@Component({
  selector: 'app-drawer-host',
  standalone: true,
  imports: [MatSidenavModule, PortalModule],
  templateUrl: './drawer-host.component.html',
  styleUrls: ['./drawer-host.component.scss'],
})
export class DrawerHostComponent {
  svc = inject(DrawerService);
  injector = inject(Injector);

  // segnali derivati dallo stato
  private stateSig = toSignal(this.svc.state$, {
    initialValue: { component: null, position: 'end', mode: 'over', width: '520px' }
  });
  opened = computed(() => !!this.stateSig().component);
  position = computed(() => this.stateSig().position);
  mode = computed(() => this.stateSig().mode);
  width = computed(() => this.stateSig().width);

  portal = computed<ComponentPortal<any> | null>(() => {
    const s = this.stateSig();
    if (!s.component) return null;
    const ref = new DrawerRef<any>(r => this.svc.close(r));
    const childInjector = Injector.create({
      providers: [
        { provide: DRAWER_DATA, useValue: s.data },
        { provide: DrawerRef, useValue: ref },
      ],
      parent: this.injector,
    });
    return new ComponentPortal(s.component, null, childInjector);
  });
}
