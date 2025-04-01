import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';
import { ToastrService } from 'ngx-toastr';

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
  isLoading: boolean = false;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private pollService: PollService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.fetchMyPolls();
  }

  async fetchMyPolls() {
    this.isLoading = true;
    try {
      const response = await this.pollService.getUserPolls(this.userId);
      this.myPolls = response.data;
      this.calculateTotalPages();
      if (this.myPolls.length === 0) {
        this.toastr.info('You have not created any polls yet');
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      this.toastr.error('Failed to load your polls. Please try again later.');
      this.myPolls = [];
      this.totalPages = 0;
    } finally {
      this.isLoading = false;
    }
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.myPolls.length / this.pollsPerPage);
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
      this.toastr.info(`Showing page ${this.currentPage}`, '', { timeOut: 1000 });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.toastr.info(`Showing page ${this.currentPage}`, '', { timeOut: 1000 });
    }
  }

  viewPollAnalysis(pollId: number) {
    this.router.navigate([`/home/poll-analysis/${pollId}`]);
  }

  trackByPollId(index: number, poll: any): number {
    return poll.id;
  }
}