import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule ],
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

  // OTP related properties
  emailOTPSent: boolean = false;
  emailVerified: boolean = false;
  isSendingOTP: boolean = false;
  isVerifyingOTP: boolean = false;
  otpError: string | null = null;
  otpResendTimer = 0;
  otpResendInterval: any;
  maxOtpAttempts = 3;
  otpAttempts = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home/new-poll']);
    }

    this.registerForm = this.fb.group({
      first_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      last_name: ['', [
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
      phone_no: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      otp: ['', [
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]*$/)
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
        if (this.emailExists) {
          this.emailVerified = false;
          this.emailOTPSent = false;
          this.registerForm.get('otp')?.reset();
        }
      } catch (error) {
        console.error('Error checking email:', error);
        this.emailExists = false;
      }
    } else {
      this.emailExists = false;
    }
  }

  async sendEmailOTP() {
    const email = this.registerForm.get('email')?.value;
    if (!email || this.emailExists) return;

    this.isSendingOTP = true;
    this.otpError = null;
    this.registerForm.get('otp')?.reset();
    
    try {
      await this.authService.sendEmailOTP(email);
      this.isSendingOTP = false;
      this.emailOTPSent = true;
      this.emailVerified = false;
      this.startOtpResendTimer();
      
      // Start OTP expiry timer
      setTimeout(() => {
        if (!this.emailVerified) {
          this.otpError = 'OTP expired. Please request a new one.';
          this.emailOTPSent = false;
          this.registerForm.get('otp')?.reset();
        }
      }, 300000); // 5 minutes expiry
    } catch (error) {
      this.isSendingOTP = false;
      this.otpError = 'Failed to send OTP. Please try again.';
      console.error('OTP send error:', error);
    }
  }

  startOtpResendTimer() {
    this.otpResendTimer = 30; // 30 seconds cooldown
    this.otpResendInterval = setInterval(() => {
      this.otpResendTimer--;
      if (this.otpResendTimer <= 0) {
        clearInterval(this.otpResendInterval);
      }
    }, 1000);
  }

  verifyEmailOTP() {
    if (this.registerForm.get('otp')?.invalid) return;

    this.otpAttempts++;
    if (this.otpAttempts >= this.maxOtpAttempts) {
      this.otpError = 'Maximum attempts reached. Please request a new OTP.';
      this.emailOTPSent = false;
      this.registerForm.get('otp')?.reset();
      return;
    }

    const email = this.registerForm.get('email')?.value;
    const otp = this.registerForm.get('otp')?.value;

    this.isVerifyingOTP = true;
    this.otpError = null;

    this.authService.verifyEmailOTP(email, otp).subscribe({
      next: (res) => {
        this.isVerifyingOTP = false;
        if (res.verified) {
          this.emailVerified = true;
          this.emailOTPSent = false;
          clearInterval(this.otpResendInterval);
        } else {
          this.otpError = 'Invalid OTP. Please try again.';
        }
      },
      error: (err) => {
        this.isVerifyingOTP = false;
        this.otpError = 'Verification failed. Please try again.';
        console.error('OTP verification error:', err);
      }
    });
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async register() {
    if (this.registerForm.invalid || this.emailExists || !this.emailVerified) {
      this.registerForm.markAllAsTouched();
      this.message = 'Please complete all verification steps.';
      this.isSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    try {
      await this.authService.register(this.registerForm.value);
      this.message = 'Registration successful! Redirecting...';
      this.isSuccess = true;
      
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