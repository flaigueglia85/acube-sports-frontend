import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="h-12 w-full bg-gray-100 flex items-center justify-center text-sm text-gray-500">
      © 2025 Acube
    </footer>
  `
})
export class FooterComponent {}
