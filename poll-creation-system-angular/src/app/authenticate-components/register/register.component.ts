import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  isSuccess = false;
  emailExists = false;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home/new-poll']);
    }

    this.registerForm = this.fb.group({
      fname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      lname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      terms: [false, [Validators.requiredTrue]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  async checkEmailExists() {
    const email = this.registerForm.get('email')?.value;
    if (email && this.registerForm.get('email')?.valid) {
      try {
        this.emailExists = await this.authService.checkEmailExists(email);
      } catch (error) {
        console.error('Error checking email:', error);
        this.emailExists = false;
      }
    } else {
      this.emailExists = false;
    }
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value;
    if (!password) return '';
    
    // Check password strength
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;
    
    if (length < 6) return 'Very Weak';
    if (length >= 6 && hasLetters && !hasNumbers && !hasSpecialChars) return 'Weak';
    if (length >= 8 && hasLetters && hasNumbers && !hasSpecialChars) return 'Moderate';
    if (length >= 10 && hasLetters && hasNumbers && hasSpecialChars) return 'Strong';
    if (length >= 12 && hasLetters && hasNumbers && hasSpecialChars) return 'Very Strong';
    
    return 'Moderate';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength().toLowerCase().replace(' ', '-');
    return `strength-${strength}`;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async register() {
    if (this.registerForm.invalid || this.emailExists) {
      this.registerForm.markAllAsTouched();
      this.message = 'Please fill all fields correctly.';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    try {
      const response = await this.authService.register(this.registerForm.value);
      this.message = 'Registration successful! Redirecting...';
      this.isSuccess = true;
      
      // Redirect after short delay
      setTimeout(() => {
        this.router.navigate(['/home/new-poll']);
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      this.message = 'Registration failed. Please try again.';
      this.isSuccess = false;
    } finally {
      this.isSubmitting = false;
    }
  }
}