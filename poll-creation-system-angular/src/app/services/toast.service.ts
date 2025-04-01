// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: any[] = [];

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

  getToasts() {
    return this.toasts;
  }
}