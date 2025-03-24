import { Injectable } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private cookieService: CookieService) {}

  // Function to encrypt data
encryptData(data: string, secretKey: string): string {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}


  async register(user: any) {
    console.log(user);
    let response= await axios.post(`${this.apiUrl}/register`, user);
    console.log(response);
    return response;
  }

  async login(credentials: any) {
    const {email,password}=credentials;
    const secretKey = 'your-secret-key'; // Use a strong secret key
  const encryptedPayload = {
    email: email,
    password: this.encryptData(password, secretKey),
  };
    console.log("login",encryptedPayload);
    try{
    const response = await axios.post(`${this.apiUrl}/login`, encryptedPayload, { withCredentials: true });
    console.log("response",response);
    if (response.data) {
      console.log(response.data.user);
      this.cookieService.set('session', 'true', { path: '/' });
      this.cookieService.set('user', response.data.user, { path: '/' });
      // console.log(JSON.parse(this.cookieService.get('user')));
      // localStorage.setItem("us")
    }
    return response;
  }catch(error){

     console.log("error auth",error);
     throw error;
  }
  }

  async logout() {
    await axios.get(`${this.apiUrl}/logout`, { withCredentials: true });
    this.cookieService.delete('session', '/');
  }
 
  isLoggedIn(): boolean {
    return this.cookieService.check('session');
  }


  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/check-email`, { email });
      return response.data; // Assuming the backend returns a boolean
    } catch (error) {
      // console.error('Error checking email:', error);
      throw error;
    }
  }
}
