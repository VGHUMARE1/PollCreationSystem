import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    // alert(this.authService.isLoggedIn());
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
