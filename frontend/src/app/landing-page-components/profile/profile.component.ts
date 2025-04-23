import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../services/profile.service';
import { ToastService } from '../../services/toast.service';

interface FormErrors {
  first_name: string;
  last_name: string;
  phone_no: string;
}

interface ValidationMessages {
  first_name: {
    required: string;
    minlength: string;
    maxlength: string;
  };
  last_name: {
    required: string;
    minlength: string;
    maxlength: string;
  };
  phone_no: {
    required: string;
    pattern: string;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, RouterModule],
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
  formErrors: FormErrors = {
    first_name: '',
    last_name: '',
    phone_no: ''
  };
  
  validationMessages: ValidationMessages = {
    first_name: {
      required: 'First name is required.',
      minlength: 'First name must be at least 2 characters long.',
      maxlength: 'First name cannot be more than 30 characters long.'
    },
    last_name: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least 2 characters long.',
      maxlength: 'Last name cannot be more than 30 characters long.'
    },
    phone_no: {
      required: 'Phone number is required.',
      pattern: 'Please enter a valid phone number (10-15 digits).'
    }
  };

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  async getUserProfile(): Promise<void> {
    try {
      const response = await this.profileService.getUserProfile();
      this.user = {
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        email: response.email || '',
        phone_no: response.phone_no || ''
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      this.toastService.showToast('Failed to load profile data','error');
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form errors when canceling edit
      this.formErrors = {
        first_name: '',
        last_name: '',
        phone_no: ''
      };
      // Reload original data
      this.getUserProfile();
    }
  }

  validateField(field: keyof FormErrors, value: string): void {
    this.formErrors[field] = '';

    if (!value) {
      this.formErrors[field] = this.validationMessages[field].required;
      return;
    }

    switch (field) {
      case 'first_name':
      case 'last_name':
        if (value.length < 2) {
          this.formErrors[field] = this.validationMessages[field].minlength;
        } else if (value.length > 30) {
          this.formErrors[field] = this.validationMessages[field].maxlength;
        }
        break;
      case 'phone_no':
        const phonePattern = /^\d{10,15}$/;
        if (!phonePattern.test(value)) {
          this.formErrors.phone_no = this.validationMessages.phone_no.pattern;
        }
        break;
    }
  }

  async updateProfile(): Promise<void> {
    // Validate all fields
    this.validateField('first_name', this.user.first_name);
    this.validateField('last_name', this.user.last_name);
    this.validateField('phone_no', this.user.phone_no);

    // Check for any validation errors
    if (Object.values(this.formErrors).some(error => error !== '')) {
      this.toastService.showToast('Please fix the validation errors','info');
      return;
    }

    try {
      await this.profileService.updateProfile(this.user);
      this.isEditing = false;
      this.toastService.showToast('Profile updated successfully!','success');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/home/profile']);
      });
      this.getUserProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      this.toastService.showToast(error.message || 'Failed to update profile.','error');
    }
  }
}