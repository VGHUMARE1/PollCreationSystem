


import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    if(!this.authService.isLoggedIn()) {
      this.router.navigate([`/login`]);
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  async logout() {
    try {
      const response = await this.authService.logout();
      console.log(response);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}


