import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicDrawerComponent } from '@features/dynamic-drawer/dynamic-drawer.component';
import { DrawerService } from '@shell/drawer/drawer.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToastContainerComponent } from '@shared/components/toast/toast-container.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,DynamicDrawerComponent,ToastContainerComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {

  
  constructor(public drawer: DrawerService) {}
}
