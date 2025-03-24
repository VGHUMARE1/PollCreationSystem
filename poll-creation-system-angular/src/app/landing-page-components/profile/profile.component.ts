import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  imports:[ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    fname: '',
    lname: '',
    email: '',
    phoneNumber: ''
  };

  isEditing = false;
 constructor(private cookieService: CookieService) {
  
    console.log(this.cookieService.check(""));
  }

  ngOnInit() {
    this.getUserProfile();
  }

  // Fetch User Profile
  async getUserProfile() {
    try {
      const response = await axios.get('http://localhost:3000/profile', { withCredentials: true });
      this.user = response.data.user;
      console.log(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  // Enable Edit Mode
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  // Update User Profile
  async updateProfile() {
    if (!this.user.fname || !this.user.lname || !/^[0-9]{10}$/.test(this.user.phoneNumber)) {
      alert("Please enter valid details!");
      return;
    }
    try {
      const token = localStorage.getItem('userToken');
      await axios.put('http://localhost:3000/auth/editprofile', this.user, { withCredentials: true });

      this.isEditing = false;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  }
}
