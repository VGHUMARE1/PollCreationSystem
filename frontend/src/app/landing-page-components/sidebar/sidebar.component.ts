import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from './../../services/profile.service';
import { ToastService } from '../../services/toast.service';

interface UserProfile {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_no?: string | null;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isLoading = true;
  userProfile: UserProfile | null = null;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loadUserProfile();
  }
  
  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      localStorage.setItem("redirecttUrl", this.router.url);
      this.router.navigate(['/login']);
    }
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    
    try {
      const response = await this.profileService.getUserProfile();
      this.userProfile = {
        email: response.email,
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        phone_no: response.phone_no || null
      };
    } catch (error) {
      this.toastService.showToast('Failed to load profile data','error');
      console.error('Profile load error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get initials(): string {
    if (!this.userProfile) return '?';
    
    let initials = '';
    if (this.userProfile.first_name) initials += this.userProfile.first_name[0].toUpperCase();
    if (this.userProfile.last_name) initials += this.userProfile.last_name[0].toUpperCase();
    
    return initials || this.userProfile.email[0].toUpperCase();
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.toastService.showToast('Logged out successfully','success');
      this.router.navigate(['/']);
    } catch (error) {
      this.toastService.showToast('Failed to logout. Please try again.','error');
      console.error('Logout error:', error);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    const message = this.isCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded';
    this.toastService.showToast(message, 'info');
  }
}