import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SHARED_IMPORTS } from '../shared-imports';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...SHARED_IMPORTS,NavbarComponent],
  templateUrl: './header.component.html'
  
})
export class HeaderComponent {
  dropdownOpen = false;

  constructor(public auth: AuthService, private router: Router) { }

  get username(): string {
    return this.auth.getUsername();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.auth.logout();
    this.dropdownOpen = false;
    this.router.navigate(['/auth/login']);
  }

  goToProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('app-header');
    if (!clickedInside) {
      this.dropdownOpen = false;
    }
  }
}
