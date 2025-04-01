import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-poll-form',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.css']
})
export class PollFormComponent implements OnInit {
  pollQuestion: string = '';
  allowMultiple: boolean = false;
  pollOptions: { value: string }[] = [{ value: '' }, { value: '' }];
  expiryDateTime: string = '';
  minDateTime!: string;
  isSubmitting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private pollService: PollService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.setMinDateTime();
  }

  setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  addOption() {
    if (this.pollOptions.length < 10) {
      this.pollOptions = [...this.pollOptions, { value: '' }];
    }
  }

  removeOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions = this.pollOptions.filter((_, i) => i !== index);
    }
  }

  async submitPoll() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    try {
      // Validate inputs
      this.validateInputs();

      // Prepare data
      const pollData = this.preparePollData();

      // Submit to API
      await this.pollService.createPoll(pollData);
      
      // On success
      this.handleSuccess();
    } catch (error: any) {
      this.handleError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private validateInputs() {
    this.pollQuestion = this.pollQuestion.trim();
    const validOptions = this.getValidOptions();

    if (!this.pollQuestion) {
      throw new Error('Poll question is required.');
    }

    if (validOptions.length < 2) {
      throw new Error('Please provide at least two valid options.');
    }

    if (!this.expiryDateTime) {
      throw new Error('Please select an expiry date and time.');
    }

    if (new Date(this.expiryDateTime) < new Date()) {
      throw new Error('Expiry date cannot be in the past!');
    }

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      throw new Error('You must be logged in.');
    }
  }

  private getValidOptions(): string[] {
    return this.pollOptions
      .map(option => option.value.trim())
      .filter(option => option.length > 0);
  }

  private preparePollData() {
    return {
      question: this.pollQuestion,
      options: this.getValidOptions(),
      allowMultiple: this.allowMultiple,
      expiryDateTime: new Date(this.expiryDateTime).toISOString(),
      createdAt: new Date().toISOString()
    };
  }

  private handleSuccess() {
    this.showToast('Poll successfully created', 'success');
    this.router.navigate(['/home/my-polls']);
  }

  private handleError(error: any) {
    console.error('Error creating poll:', error);
    const message = error.response?.data?.message || error.message || 'Failed to create poll. Please try again.';
    this.showToast(message, 'error');
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? ['toast-success'] : ['toast-error'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}