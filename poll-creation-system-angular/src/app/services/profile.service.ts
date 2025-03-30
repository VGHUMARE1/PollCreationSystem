import { Injectable } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private cookieService: CookieService) {}

  // Fetch User Profile
  async getUserProfile() {
    try {
      const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
      return response.data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update User Profile
  async updateProfile(user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_no: string;
  }) {
    if (!user.first_name || !user.last_name || !/^[0-9]{10}$/.test(user.phone_no)) {
      throw new Error("Please enter valid details!");
    }
    
    try {
      await axios.put('http://localhost:3000/auth/editprofile', user, { withCredentials: true });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}