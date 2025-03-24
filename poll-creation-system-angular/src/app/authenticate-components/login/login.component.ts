import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   imports:[ReactiveFormsModule,CommonModule,FormsModule],
//   templateUrl: './login.component.html',
// })
// export class LoginComponent {
//   credentials = { email: '', password: '' };
//   message = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   async login() {
//     try {
//       await this.authService.login(this.credentials);
//       this.router.navigate(['/dashboard']);
//     } catch (error) {
//       this.message = 'Invalid credentials!';
//     }
//   }
// }

// import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';
  // constructor(private authService: AuthService, private router: Router) {}
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    if(this.authService.isLoggedIn()){
      
      this.router.navigate([`home/new-poll`]);
     }
    
  }

  // Check if a form field is invalid
  isInvalid(field: string): boolean {
    return (
      this.loginForm.get(field)!.invalid && this.loginForm.get(field)!.touched
    );
  }

  async login() {
    if (this.loginForm.valid) {
      try {
      const response=  await this.authService.login(this.loginForm.value);
      // if(response)
        this.message = 'Login successful!';
        console.log(response);
        // alert("welcome")
        // localStorage.setItem("user",response?.data.user);
        this.router.navigate(['home/new-poll']);
       
      } catch (error) {
        this.message = 'Invalid credentials!';
      }
    } else {
      this.message = 'Please enter valid credentials.';
      this.loginForm.markAllAsTouched(); // Show validation errors
    }
    alert(this.message);
  }
}
