import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './my-polls.component.html',
  styleUrls: ['./my-polls.component.css']
})
export class MyPollsComponent implements OnInit {
  myPolls: any[] = [];
  userId: number = 1; // Assume user is logged in
  currentPage: number = 1;
  pollsPerPage: number = 2;

  constructor(
    private router: Router,
    private pollService: PollService
  ) {}

  async ngOnInit() {
    await this.fetchMyPolls();
  }

  async fetchMyPolls() {
    try {
      const response = await this.pollService.getUserPolls(this.userId);
      this.myPolls = response.data;
    } catch (error) {
      console.error('Error fetching polls:', error);
      this.myPolls = []; // Ensure empty array on error
    }
  }

  createNewPoll() {
    this.router.navigate(['/home/new-poll']);
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
    this.router.navigate([`/home/poll-analysis/${pollId}`]);
  }

  
  trackByPollId(index: number, poll: any): number {
    return poll.id;
  }
}