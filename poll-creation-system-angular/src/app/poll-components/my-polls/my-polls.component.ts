import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PollService } from '../../services/poll.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule,MatSnackBarModule, MatButtonModule, MatIconModule],
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
    private toastService: ToastService
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
        this.toastService.showToast('You have not created any polls yet','info');
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
      this.toastService.showToast('Failed to load your polls. Please try again later.','error');
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
      this.toastService.showToast(`Showing page ${this.currentPage}`, 'info');
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.toastService.showToast(`Showing page ${this.currentPage}`, 'info');
    }
  }

  viewPollAnalysis(pollId: number) {
    this.router.navigate([`/home/poll-analysis/${pollId}`]);
  }

  trackByPollId(index: number, poll: any): number {
    return poll.id;
  }
}