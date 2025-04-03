// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: any[] = [];

   constructor(
      private snackBar: MatSnackBar
    ) {}
  

  show(severity: 'success' | 'error' | 'warn', summary: string, detail: string) {
    const toast = { severity, summary, detail, visible: true };
    this.toasts.push(toast);
    setTimeout(() => {
      toast.visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }, 3000);
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }


  getToasts() {
    return this.toasts;
  }
}