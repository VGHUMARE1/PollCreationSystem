import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { ToastrService } from 'ngx-toastr';

interface Voter {
  email: string;
  name: string;
  votedOptionId: number;
}

interface PollOption {
  id: number;
  pollId: number;
  optionText: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  creator: {
    email: string;
    name: string;
  };
  expiryDateTime: string;
  status: string;
  voters: Voter[];
  selectedOption?: number;
  selectedOptions?: boolean[];
}

@Component({
  selector: 'app-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  poll: Poll = {
    id: 0,
    question: '',
    options: [],
    allowMultiple: false,
    creator: { email: '', name: '' },
    expiryDateTime: '',
    status: '',
    voters: [],
    selectedOption: undefined,
    selectedOptions: []
  };
  isLoading = false;
  errorMessage: string | null = null;
  pollId = '';
  hasVoted = false;
  currentUserEmail = 'user@example.com'; // Replace with actual user email from auth service
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollService: PollService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pollId = params['pollId'];
      if (this.pollId) {
        this.fetchPoll();
      } else {
        this.router.navigate(['/home/new-poll']);
      }
    });
  }

 
  async fetchPoll(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    
    try {
      const data = await this.pollService.getPollById(this.pollId);
      this.hasVoted = data.voters.some((voter: { email: string; }) => voter.email === this.currentUserEmail);
      
      this.poll = {
        ...data,
        selectedOption: undefined,
        selectedOptions: data.allowMultiple ? 
          new Array(data.options.length).fill(false) : 
          undefined
      };
    } catch (error) {
      // console.error('Poll fetch error:', error);
      this.errorMessage = 'Failed to load poll. Please try again.';
      this.toastr.error('Failed to load poll. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async submitVote(): Promise<void> {
    if (this.hasVoted || !this.validateVote()) return;

    try {
      const optionIds = this.getSelectedOptionIds();
      const response = await this.pollService.submitVote(this.pollId, optionIds);
      this.hasVoted = true;
      this.toastr.success(response.message || 'Your vote has been submitted successfully!', 'success');
      await this.fetchPoll();
      this.router.navigate(['/home/voted-polls']);
    } catch (error: any) {
      // console.error('Vote submission error:', error);
      this.toastr.error( error.response?.data?.message || 'Failed to submit vote. Please try again.');
    }
  }

  private validateVote(): boolean {
    if (this.poll.allowMultiple) {
      if (!this.poll.selectedOptions?.some(selected => selected)) {
        this.toastr.info('Please select at least one option', 'warning');
        return false;
      }
    } else if (this.poll.selectedOption === undefined) {
      this.toastr.info('Please select an option', 'warning');
      return false;
    }
    return true;
  }

  private getSelectedOptionIds(): number[] {
    if (this.poll.allowMultiple && this.poll.selectedOptions) {
      return this.poll.options
        .filter((_, index) => this.poll.selectedOptions![index])
        .map(option => option.id);
    }
    return this.poll.selectedOption !== undefined ? [this.poll.selectedOption] : [];
  }

  trackByOption(index: number, option: PollOption): number {
    return option.id;
  }

  get totalVotes(): number {
    return this.poll.options.reduce((sum, option) => sum + option.votes, 0);
  }
}