import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-poll-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.css']
})
export class PollFormComponent implements OnInit {
  pollQuestion: string = '';
  allowMultiple: boolean = false;
  pollOptions: { value: string }[] = [{ value: '' }, { value: '' }]; // Minimum 2 options
  expiryDateTime: string = ''; // Store expiry date and time
  minDateTime!: string; // Store minimum datetime for expiry field

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setMinDateTime(); // Set minimum selectable datetime
  }

  setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
    this.minDateTime = now.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
  }

  addOption() {
    this.pollOptions = [...this.pollOptions, { value: '' }];
  }

  removeOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions = this.pollOptions.filter((_, i) => i !== index);
    }
  }

  async submitPoll() {
    this.pollQuestion = this.pollQuestion.trim();
    const validOptions = this.pollOptions
      .map(option => option.value.trim())
      .filter(option => option.length > 0);

    if (!this.pollQuestion) {
      alert('Poll question is required.');
      return;
    }

    if (validOptions.length < 2) {
      alert('Please provide at least two valid options.');
      return;
    }

    if (!this.expiryDateTime) {
      alert('Please select an expiry date and time.');
      return;
    }

    if (new Date(this.expiryDateTime) < new Date()) {
      alert('Expiry date cannot be in the past!');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in.');
      this.router.navigate(['/login']);
      return;
    }

    const pollData = {
      question: this.pollQuestion,
      options: validOptions,
      allowMultiple: this.allowMultiple,
      expiryDateTime: new Date(this.expiryDateTime).toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post('http://localhost:3000/polls', pollData, { withCredentials: true });
      alert('Poll successfully created');
      this.router.navigate(['/polls/my-polls']);
    } catch (error : any) {
      console.error('Error creating poll:', error);
      alert(error.response?.data?.message || 'Failed to create poll. Please try again.');
    }
  }

}
