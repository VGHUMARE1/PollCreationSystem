import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from './../../services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    first_name: '',
    last_name: '',
    email: '',
    phone_no: ''
  };

  isEditing = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getUserProfile();
  }

  // Fetch User Profile
  async getUserProfile() {
    try {
      this.user = await this.profileService.getUserProfile();
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
    try {
      await this.profileService.updateProfile(this.user);
      this.isEditing = false;
      alert('Profile updated successfully!');
    } catch (error:any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile.');
    }
  }
}