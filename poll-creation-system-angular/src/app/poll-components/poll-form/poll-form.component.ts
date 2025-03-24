import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class PollFormComponent {
  pollQuestion: string = '';
  allowMultiple: boolean = false;
  pollOptions: { value: string }[] = [{ value: '' }, { value: '' }]; // Minimum 2 options
  expiryDateTime: string = ''; // Store expiry date and time
constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
  }


  addOption() {
    this.pollOptions = [...this.pollOptions, { value: '' }]; // Adds a new option while keeping the array immutable
  }

  removeOption(index: number) {
    if (this.pollOptions.length > 2) {
      this.pollOptions = this.pollOptions.filter((_, i) => i !== index); // Creates a new array to prevent focus loss
    }
  }

 async submitPoll() {
    // Trim the question and options
    this.pollQuestion = this.pollQuestion.trim();
    const validOptions = this.pollOptions
      .map(option => option.value.trim())
      .filter(option => option.length > 0); // Removing empty options

    // Validations
    if (!this.pollQuestion) {
      alert('Poll question is required.');
      return;
    }

    if (validOptions.length < 2) {
      alert('Please provide at least two valid options.');
      return;
    }

    if (!this.expiryDateTime) {
      alert('Please select an expiry date and time for the poll.');
      return;
    }
    // console.log()
     if(!this.authService.isLoggedIn()){
      alert("You must logged in ");
      this.router.navigate([`/login`]);
     }
    // Creating JSON object
    const pollData = {
      question: this.pollQuestion,
      options: validOptions,
      allowMultiple: this.allowMultiple,
      expiryDateTime: new Date(this.expiryDateTime).toISOString(), // Convert to ISO format
      createdAt: new Date().toISOString(), // Adding timestamp
    };

    let response= await axios.post("http://localhost:3000/polls",pollData, { withCredentials: true });
    alert("Poll successfully created");
    console.log(pollData);
  }
}