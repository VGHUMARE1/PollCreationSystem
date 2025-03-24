import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-active-polls',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './active-polls.component.html',
  styleUrls: ['./active-polls.component.css'],
})
export class ActivePollsComponent implements OnInit {
  activePolls: any[] = [];

  constructor() {}

  ngOnInit() {
    this.fetchActivePolls();
  }

  // Fetch active polls from backend
  async fetchActivePolls() {
    try {
      const response = await axios.get('http://localhost:3000/polls/active');
      this.activePolls = response.data.data.map((poll: any) => ({
        ...poll,
        selectedOptions: poll.allowMultiple ? new Array(poll.options.length).fill(false) : [],
        selectedOption: '',
      }));
    } catch (error) {
      console.error('Error fetching active polls:', error);
    }
  }

  // Voting function
  async vote(poll: any) {
    if (poll.allowMultiple && !poll.selectedOptions.some((option: boolean) => option)) {
      alert('Please select at least one option.');
      return;
    } else if (!poll.allowMultiple && !poll.selectedOption) {
      alert('Please select an option.');
      return;
    }

    try {
      const payload = {
        pollId: poll._id,
        selectedOptions: poll.allowMultiple
          ? poll.options.filter((_: any, index: number) => poll.selectedOptions[index])
          : [poll.selectedOption],
      };

      const response = await axios.put('http://localhost:3000/polls/vote', payload);
      alert(`Vote submitted: ${response.data.message}`);
      this.fetchActivePolls(); // Refresh polls after voting
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }
}