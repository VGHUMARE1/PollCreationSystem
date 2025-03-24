import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-edit-poll',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.css'],
})
export class EditPollComponent implements OnInit {
  poll: any = {
    question: '',
    options: [],
    expiryDate: '',
    allowMultiple: false,
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const pollId = this.route.snapshot.paramMap.get('id');
    this.fetchPoll("1");
  }

  async fetchPoll(pollId: string) {
    try {
      const response = await axios.get(`http://localhost:3000/polls/${pollId}`);
      this.poll = {
        ...response.data,
        options: JSON.parse(response.data.options), // Parse options if stored as JSON string
        expiryDate: this.formatDateTime(response.data.expiryDate), // Format expiry date for input
      };
    } catch (error) {
      console.error('Error fetching poll:', error);
    }
  }

  // Format date to 'YYYY-MM-DDTHH:MM' for datetime-local input
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  addOption() {
    this.poll.options.push('');
  }

  removeOption(index: number) {
    this.poll.options.splice(index, 1);
  }

  async submitPoll() {
    try {
      const pollId = this.route.snapshot.paramMap.get('id');
      const payload = {
        question: this.poll.question,
        options: JSON.stringify(this.poll.options), // Stringify options if needed
        expiryDate: new Date(this.poll.expiryDate).toISOString(), // Convert to ISO string
        allowMultiple: this.poll.allowMultiple,
      };

      await axios.put(`http://localhost:3000/polls/${pollId}`, payload);
      alert('Poll updated successfully!');
      this.router.navigate(['/my-polls']); // Redirect to My Polls page
    } catch (error) {
      console.error('Error updating poll:', error);
      alert('Failed to update poll.');
    }
  }
}
