import { Injectable } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private emailApiUrl = 'http://localhost:8080/email/send';
  private otpStorage: {[email: string]: {otp: string, expiry: Date}} = {};

  constructor(private cookieService: CookieService) {}

  // Function to encrypt data
  encryptData(data: string, secretKey: string): string {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  }

  async register(user: any) {
    // console.log(user);
    let response = await axios.post(`${this.apiUrl}/register`, user);
    // console.log(response);
    return response;
  }

  async login(credentials: any) {
    const { email, password } = credentials;
    const secretKey = 'topSecret'; //  secret key
    const encryptedPayload = {
      email: email,
      password: this.encryptData(password, secretKey),
    };
    // console.log('login', encryptedPayload);
    try {
      const response = await axios.post(
        `${this.apiUrl}/login`,
        encryptedPayload,
        { withCredentials: true }
      );

      console.log(response);
      if (response.data) {
        console.log(response.data.user);
        this.cookieService.set('session', 'true', { path: '/' });
        this.cookieService.set('user',JSON.stringify(response.data.user) , { path: '/' });
        this.cookieService.set('JWTToken',response.data.token , { path: '/' });
        console.log(this.cookieService.get('user'))
      }
      return response;
    } catch (error) {
      console.log( error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await axios.get(`${this.apiUrl}/logout`, {
        withCredentials: true,
      });
      this.clearAuthData();
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.cookieService.delete('session', '/');
    this.cookieService.delete('user', '/');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('session');
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/check-email`, {
        email,
      });
      return response.data; //from backend in response boolean value return
    } catch (error) {
      // console.error('Error checking email:', error);
      throw error;
    }
  }





  async sendEmailOTP(email: string): Promise<any> {
   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); 
    
    this.otpStorage[email] = { otp, expiry };
    
    const subject = 'Your OTP for Registration';
    const message = `Your OTP is: ${otp}. This OTP is valid for 5 minutes.`;
    
    try {
      const response = await axios.post(`${this.apiUrl}/email/send`, { email, subject, message });
      // console.log(`OTP ${otp} sent to ${email}`);
      return response.data;
    } catch (error) {
      // console.error('Error sending OTP:', error);
      throw error;
    }
  }

  verifyEmailOTP(email: string, otp: string): Observable<{verified: boolean}> {
    const storedOtp = this.otpStorage[email];
    
    if (!storedOtp) {
      return of({verified: false});
    }
    
    const verified = storedOtp.otp === otp && new Date() < new Date(storedOtp.expiry);
    
    
    if (verified) {
      delete this.otpStorage[email];
    }
    
    // return of({verified});
    return of({verified});
  }

}