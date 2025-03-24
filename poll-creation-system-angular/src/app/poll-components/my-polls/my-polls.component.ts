import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-polls',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './my-polls.component.html',
  styleUrls: ['./my-polls.component.css']
})
export class MyPollsComponent implements OnInit {
  myPolls: any[] = [];
  userId: number = 1; // Assume user is logged in
  currentPage: number = 1;
  pollsPerPage: number = 2;

  constructor(private router: Router) {}

  ngOnInit() {
    this.fetchMyPolls();
  }

  async fetchMyPolls() {
    try {
      const response = await axios.get(`http://localhost:3000/polls/user/${this.userId}`);
      this.myPolls = response.data;
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  }

  getVotePercentage(votes: number, totalVotes: number): number {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  }

  getPaginatedPolls() {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    return this.myPolls.slice(startIndex, startIndex + this.pollsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage * this.pollsPerPage < this.myPolls.length) {
      this.currentPage++;
    }
  }

  viewPollAnalysis(pollId: number) {
    console.log(`Viewing results for poll ID: ${pollId}`);
    this.router.navigate([`/home/poll-analysis/${pollId}`]);
  }
}
