import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from '../../services/poll.service';

interface PollOption {
  id: number;
  optionText: string;
}

interface VotedPoll {
  _id: number;
  question: string;
  options: PollOption[];
  userVotes: PollOption[];
  totalVotes: number;
  createdBy: string;
  expiryDate: string;
  allowMultiple?: boolean;
  selectedOptions?: boolean[];
}

@Component({
  selector: 'app-user-voted-polls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-voted-polls.component.html',
  styleUrls: ['./user-voted-polls.component.css']
})
export class UserVotedPollsComponent implements OnInit {
  votedPolls: VotedPoll[] = [];
  currentPage: number = 1;
  pollsPerPage: number = 4;
  totalPages: number = 1;
  editingPollId: number | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private pollService: PollService) {}

  async ngOnInit() {
    await this.loadVotedPolls();
  }

  private async loadVotedPolls() {
    this.isLoading = true;
    this.errorMessage = null;
    
    try {
      const response = await this.pollService.getUserVotedPolls();
      this.processPollData(response.data);
    } catch (error) {
      this.handleLoadError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private processPollData(polls: any[]) {
    this.votedPolls = polls.map(poll => ({
      ...poll,
      expiryDate: new Date(poll.expiryDate).toLocaleDateString(),
      allowMultiple: poll.userVotes.length > 1,
      selectedOptions: poll.options.map((opt: PollOption) => 
        poll.userVotes.some((v: PollOption) => v.id === opt.id)
    )}));
    
    this.totalPages = Math.ceil(this.votedPolls.length / this.pollsPerPage);
  }

  private handleLoadError(error: any) {
    console.error('Error fetching voted polls:', error);
    this.errorMessage = 'Failed to load voted polls. Please try again later.';
  }

  // Add this method to fix the template error
  isUserVoted(option: PollOption, userVotes: PollOption[]): boolean {
    return userVotes.some(vote => vote.id === option.id);
  }

  toggleEditMode(pollId: number) {
    this.editingPollId = this.editingPollId === pollId ? null : pollId;
  }

  toggleOptionSelection(poll: VotedPoll, index: number) {
    if (!poll.selectedOptions) return;

    if (poll.allowMultiple) {
      poll.selectedOptions[index] = !poll.selectedOptions[index];
    } else {
      poll.selectedOptions = poll.selectedOptions.map((_, i) => i === index);
    }
  }

  async deleteVote(pollId: number) {
    if (!confirm('Are you sure you want to delete your vote?')) return;
  
    try {
      await this.pollService.deleteVote(pollId);
      alert('Vote deleted successfully');
      await this.loadVotedPolls();
    } catch (error: any) {
      this.handleVoteError(error, 'deleting');
    }
  }

  async changeVote(poll: VotedPoll) {
    if (!poll.selectedOptions?.some(selected => selected)) {
      alert('Please select at least one option');
      return;
    }
  
    try {
      const optionIds = this.getSelectedOptionIds(poll);
      await this.pollService.changeVote({ pollId: poll._id, optionIds });
      
      alert('Vote changed successfully!');
      this.editingPollId = null;
      await this.loadVotedPolls();
    } catch (error: any) {
      this.handleVoteError(error, 'changing');
    }
  }

  private getSelectedOptionIds(poll: VotedPoll): number[] {
    return poll.options
      .filter((_, index) => poll.selectedOptions?.[index])
      .map(opt => opt.id);
  }

  private handleVoteError(error: any, action: string) {
    console.error(`Error ${action} vote:`, error);
    
    const message = error.response?.data?.message || 
                   error.message || 
                   `An error occurred while ${action} the vote.`;
    
    alert(message);
  }

  // Pagination methods
  get displayedPolls(): VotedPoll[] {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    return this.votedPolls.slice(startIndex, startIndex + this.pollsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    window.scrollTo(0, 0);
  }

  getPageRange(): number[] {
    const maxVisible = 5;
    const range: number[] = [];
    
    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    if (start > 1) range.push(1);
    if (start > 2) range.push(-1); // Ellipsis marker
    
    for (let i = start; i <= end; i++) range.push(i);
    
    if (end < this.totalPages - 1) range.push(-1);
    if (end < this.totalPages) range.push(this.totalPages);

    return range;
  }

  // TrackBy functions
  trackByPollId(index: number, poll: VotedPoll): number {
    return poll._id;
  }

  trackByOptionId(index: number, option: PollOption): number {
    return option.id;
  }
}