import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
  isLoading = false;
  passwordFieldType: 'password' | 'text' = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
    });

    if(this.authService.isLoggedIn()) {
      this.router.navigate(['home/new-poll']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  async login() {
    if (this.loginForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.message = '';

    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['home/new-poll']);
    } catch (error: any) {
      this.message = error.response.data.msg || 'Login failed. Please try again.';
      if (error.status === 401) {
        this.message = 'Invalid email or password';
      }
    } finally {
      this.isLoading = false;
    }
  }

  getEmailErrors() {
    if (this.email?.hasError('required')) return 'Email is required';
    if (this.email?.hasError('email') || this.email?.hasError('pattern')) 
      return 'Please enter a valid email address';
    return '';
  }

  getPasswordErrors() {
    if (this.password?.hasError('required')) return 'Password is required';
    if (this.password?.hasError('minlength')) 
      return 'Password must be at least 8 characters';
    if (this.password?.hasError('pattern')) 
      return 'Password must contain at least one uppercase, one lowercase, one number and one special character';
    return '';
  }
}