import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private baseConfig: MatSnackBarConfig = {
    duration: 300000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  constructor(private snack: MatSnackBar) {}

  success(message: string): void {
    this.snack.open(message, 'Chiudi', {
      ...this.baseConfig,
      panelClass: ['custom-toast','bg-green-600', 'text-white'],
    });
  }

  error(message: string): void {
    this.snack.open(message, 'Chiudi', {
      ...this.baseConfig,
      panelClass: ['custom-toast','bg-red-600', 'text-white'],
    });
  }

  info(message: string): void {
    this.snack.open(message, 'Chiudi', {
      ...this.baseConfig,
      panelClass: ['custom-toast','bg-blue-600', 'text-white'],
    });
  }
}
