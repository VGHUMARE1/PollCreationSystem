import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface UserProfile {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_no?: string | null;
}

@Component({
  selector: 'app-sidebar',
  imports : [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isLoading = true;
  profileError: string | null = null;
  userProfile: UserProfile | null = null;

  constructor( private authService: AuthService,private router: Router) {

  }

  async ngOnInit() {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    }
    await this.loadUserProfile();
   
  }

  async loadUserProfile() {
    this.isLoading = true;
    this.profileError = null;
    
    try {
      const response = await axios.get('http://localhost:3000/profile', { 
        withCredentials: true 
      });
      
      this.userProfile = {
        email: response.data.user.email,
        first_name: response.data.user.first_name || '',
        last_name: response.data.user.last_name || '',
        phone_no: response.data.user.phone_no || null
      };
      
    } catch (error) {
      this.profileError = 'Failed to load profile';
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