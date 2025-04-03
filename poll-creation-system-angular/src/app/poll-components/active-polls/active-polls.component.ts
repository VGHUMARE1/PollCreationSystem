import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { Poll, Option } from '../../model/poll.model';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-active-polls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './active-polls.component.html',
  styleUrls: ['./active-polls.component.css']
})
export class ActivePollsComponent implements OnInit {
  allPolls: Poll[] = [];
  displayedPolls: Poll[] = [];
  currentPage: number = 1;
  pollsPerPage: number = 2;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  
  constructor(
    private router: Router, 
    private pollService: PollService,
    private toastService: ToastService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchActivePolls();
  }

  async fetchActivePolls(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    
    try {
      this.allPolls = await this.pollService.getActivePolls();
      this.initializePollSelections();
      this.totalPages = Math.ceil(this.allPolls.length / this.pollsPerPage);
      this.updateDisplayedPolls();
    } catch (error) {
      this.errorMessage = 'Failed to load polls. Please try again later.';
      this.toastService.showToast('Failed to load polls. Please try again later.', 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private initializePollSelections(): void {
    this.allPolls.forEach(poll => {
      if (poll.allowMultiple) {
        poll.selectedOptions = poll.options.map(() => false);
        if (poll.userVoted && Array.isArray(poll.selectedOptions)) {
          poll.selectedOptions = poll.options.map(option => 
            poll.selectedOptions?.some(selected => 
              typeof selected !== 'boolean' && selected.id === option.id
            ) || false
          );
        }
      } else {
        if (poll.userVoted && Array.isArray(poll.selectedOptions) ){
          const firstSelected = poll.selectedOptions.find(opt => true);
          poll.selectedOption = typeof firstSelected !== 'boolean' ? firstSelected?.id : null;
        }
      }
    });
  }

  private updateDisplayedPolls(): void {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    const endIndex = startIndex + this.pollsPerPage;
    this.displayedPolls = this.allPolls.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPolls();
      window.scrollTo(0, 0);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPolls();
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedPolls();
      window.scrollTo(0, 0);
    }
  }

  getPageRange(): number[] {
    const range: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      if (start > 1) range.push(1);
      if (start > 2) range.push(-1);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      if (end < this.totalPages - 1) range.push(-1);
      if (end < this.totalPages) range.push(this.totalPages);
    }
    
    return range;
  }

  async vote(poll: Poll): Promise<void> {
    if (poll.userVoted) {
      this.toastService.showToast('You have already voted on this poll', 'info');
      return;
    }

    if (!this.validateVote(poll)) {
      return;
    }

    try {
      const optionIds = this.getSelectedOptionIds(poll);
      const response = await this.pollService.submitVote(poll._id, optionIds);
      this.toastService.showToast(response.message, 'success');
      await this.fetchActivePolls();
    } catch (error: any) {
      this.handleVoteError(error);
    }
  }

  private validateVote(poll: Poll): boolean {
    if (poll.allowMultiple) {
      const selectedCount = poll.selectedOptions?.filter(opt => opt === true).length || 0;
      if (selectedCount === 0) {
        this.toastService.showToast('Please select at least one option', 'info');
        return false;
      }
    } else if (poll.selectedOption === null || poll.selectedOption === undefined) {
      this.toastService.showToast('Please select an option', 'info');
      return false;
    }
    return true;
  }

  private getSelectedOptionIds(poll: Poll): number[] {
    if (poll.allowMultiple) {
      return poll.options
        .filter((_, index) => poll.selectedOptions?.[index] === true)
        .map(option => option.id);
    } else {
      return poll.selectedOption !== null && poll.selectedOption !== undefined 
        ? [poll.selectedOption] 
        : [];
    }
  }

  private handleVoteError(error: any): void {
    const message = error.error?.message || error.message || "An error occurred while submitting your vote.";
    this.toastService.showToast(message, 'error');
  }

  trackByOption(index: number, option: Option): number {
    return option.id;
  }
}