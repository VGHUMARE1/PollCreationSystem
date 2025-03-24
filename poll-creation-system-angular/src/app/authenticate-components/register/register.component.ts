import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';
  emailExists = false; // Flag to track if email exists

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if(this.authService.isLoggedIn()){
      
      this.router.navigate([`home/new-poll`]);
     }

    this.registerForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Check if a form field has an error
  isInvalid(field: string): boolean {
    return this.registerForm.get(field)!.invalid && this.registerForm.get(field)!.touched;
  }

  // Check if email exists
  async checkEmailExists() {
    const email = this.registerForm.get('email')!.value;
    if (email && this.registerForm.get('email')!.valid) {
      try {
        const emailExists = await this.authService.checkEmailExists(email);
        this.emailExists = emailExists; // Update the flag
      } catch (error) {
        console.error('Error checking email:', error);
      }
    } else {
      this.emailExists = false; // Reset the flag if email is invalid or empty
    }
  }

  async register() {
    if (this.registerForm.valid && !this.emailExists) {
      try {
        const response = await this.authService.register(this.registerForm.value);
        this.message = 'Registration successful!';
        console.log('User Data:', this.registerForm.value);
        this.router.navigate(['/home/new-poll']);
        alert("Register Successfully");
      } catch (error) {
        this.message = 'Invalid credentials!';
      }
    } else {
      this.message = 'Please fill all fields correctly.';
      this.registerForm.markAllAsTouched(); // Show validation errors
    }
  }
}