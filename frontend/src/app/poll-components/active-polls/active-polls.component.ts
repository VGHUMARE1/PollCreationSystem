import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from '../../services/poll.service';
import { Poll, Option } from '../../model/poll.model';
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
  currentPage = 1;
  pollsPerPage = 2;
  totalPages = 1;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
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
      const polls = await this.pollService.getActivePolls();
      this.allPolls = polls.map(poll => this.initializePoll(poll));
      this.totalPages = Math.ceil(this.allPolls.length / this.pollsPerPage);
      this.updateDisplayedPolls();
    } catch (error) {
      this.errorMessage = 'Failed to load polls. Please try again later.';
      this.toastService.showToast(this.errorMessage, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  private initializePoll(poll: Poll): Poll {
    return {
      ...poll,
      selectedOptions: poll.allowMultiple 
        ? poll.selectedOptions || new Array(poll.options.length).fill(false)
        : [],
      selectedOption: poll.selectedOption ?? null
    };
  }

  private updateDisplayedPolls(): void {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    const endIndex = startIndex + this.pollsPerPage;
    this.displayedPolls = this.allPolls.slice(startIndex, endIndex);
  }

  async vote(poll: Poll): Promise<void> {
    if (poll.userVoted || !this.validateVote(poll)) return;

    try {
      const optionIds = this.getSelectedOptionIds(poll);
      console.log(optionIds)
      console.log(poll)
      const response = await this.pollService.submitVote(poll._id+"", optionIds);
      this.toastService.showToast(response.message, 'success');
      await this.fetchActivePolls();
    } catch (error: any) {
      this.handleVoteError(error);
    }
  }

  private validateVote(poll: Poll): boolean {
    if (poll.allowMultiple) {
      const selectedCount = poll.selectedOptions.filter(opt => opt !== null).length;
      if (selectedCount === 0) {
        this.toastService.showToast('Please select at least one option', 'info');
        return false;
      }
    } else if (poll.selectedOption === null) {
      this.toastService.showToast('Please select an option', 'info');
      return false;
    }
    return true;
  }

  private getSelectedOptionIds(poll: Poll): number[] {
    if (poll.allowMultiple) {
      if (!poll.selectedOptions || !Array.isArray(poll.selectedOptions)) {
        return [];
      }
      // Get IDs of selected options (where checkbox is true)
      return poll.options
        .filter((_, index) => poll.selectedOptions[index])
        .map(option => option.id);
    } else {
      return poll.selectedOption !== null ? [poll.selectedOption] : [];
    }
  }

  private handleVoteError(error: any): void {
    const message = error.response?.data?.message || 
                   error.message || 
                   'An error occurred while submitting your vote.';
    this.toastService.showToast(message, 'error');
  }

  // Pagination methods remain the same
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
      return Array.from({length: this.totalPages}, (_, i) => i + 1);
    }
    
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    if (start > 1) range.push(1);
    if (start > 2) range.push(-1);
    
    for (let i = start; i <= end; i++) range.push(i);
    
    if (end < this.totalPages - 1) range.push(-1);
    if (end < this.totalPages) range.push(this.totalPages);
    
    return range;
  }

  trackByOption(index: number, option: Option): number {
    return option.id;
  }

  
}