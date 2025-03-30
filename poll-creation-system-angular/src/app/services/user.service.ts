import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private emailApiUrl = 'http://172.16.16.11:8080/email/send';
  private otpStorage: { [email: string]: string } = {};

  constructor(private http: HttpClient) { }

  sendEmailOTP(email: string): Observable<any> {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStorage[email] = otp; // Store OTP temporarily

    const emailData = {
      email: email,
      subject: 'OTP for Poll Creation Verification',
      message: `Your OTP for poll creation is: ${otp}. This OTP is valid for 10 minutes.`
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.emailApiUrl, emailData, { headers }).pipe(
      catchError(error => {
        console.error('Error sending OTP email:', error);
        return throwError(() => new Error('Failed to send OTP. Please try again.'));
      })
    );
  }

  verifyEmailOTP(verificationData: { email: string; otp: string }): Observable<boolean> {
    return new Observable(observer => {
      // In a real application, you would verify against stored OTP in backend
      // For this demo, we're verifying against the temporarily stored OTP
      const storedOtp = this.otpStorage[verificationData.email];
      
      if (storedOtp && storedOtp === verificationData.otp) {
        // OTP is valid
        delete this.otpStorage[verificationData.email]; // Clear the OTP after verification
        observer.next(true);
      } else {
        // OTP is invalid
        observer.next(false);
      }
      observer.complete();
    });
  }

  // In a production environment, you would implement this on the backend
  // and make an HTTP call to verify the OTP
  private verifyOtpWithBackend(email: string, otp: string): Observable<boolean> {
    // This is just a placeholder for what would be your actual backend API call
    // return this.http.post<boolean>('your-backend-api/verify-otp', { email, otp });
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }
}