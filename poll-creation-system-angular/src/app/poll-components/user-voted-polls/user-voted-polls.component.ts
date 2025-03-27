import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

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

  ngOnInit() {
    this.fetchUserVotedPolls();
  }

  async fetchUserVotedPolls() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const response = await axios.get('http://localhost:3000/polls/voted-by-user', {
        withCredentials: true
      });
      
      this.votedPolls = response.data.map((poll: any) => ({
        ...poll,
        expiryDate: new Date(poll.expiryDate).toLocaleDateString(),
        allowMultiple: poll.userVotes.length > 1,
        selectedOptions: poll.options.map((opt: PollOption) => 
          poll.userVotes.some((v: PollOption) => v.id === opt.id)
        )
      }));
      
      this.totalPages = Math.ceil(this.votedPolls.length / this.pollsPerPage);
    } catch (error) {
      console.error('Error fetching voted polls:', error);
      this.errorMessage = 'Failed to load voted polls. Please try again later.';
    } finally {
      this.isLoading = false;
    }
  }

  toggleEditMode(pollId: number) {
    this.editingPollId = this.editingPollId === pollId ? null : pollId;
  }

  async deleteVote(pollId: number) {
    if (!confirm('Are you sure you want to delete your vote?')) return;
  
    try {
      const response = await axios.delete(`http://localhost:3000/polls/${pollId}/vote`, {
        withCredentials: true
      });
  
      alert(response.data.msg || "Vote deleted successfully");
      console.log(response);
      this.fetchUserVotedPolls();
    } catch (error: any) {
      console.error('Error deleting vote:', error);
  
      if (error.response) {
        const { status, data } = error.response;
      //  console.log(data.msg.message);
        if (status === 400) {
          alert(data.msg.message || "Bad Request: Invalid Poll ID or Email");
        } else if (status === 500) {
          alert("Internal Server Error. Please try again later.");
        } else {
          alert(data.msg.message || "An error occurred while deleting the vote.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    }
  }
  

  async changeVote(poll: VotedPoll) {
    if (!poll.selectedOptions?.some(selected => selected)) {
      alert('Please select at least one option');
      return;
    }
  
    try {
      // Extract selected option IDs
      const optionIds = poll.options
        .filter((_, index) => poll.selectedOptions?.[index])
        .map(opt => opt.id); // Only sending option IDs
  
      const requestData = {
        pollId: poll._id, // Ensure pollId is correctly set
        voterEmail: "akankshbodakhe@gmail.com", // Ensure voterEmail is included
        optionIds: optionIds // Sending as an array of IDs
      };
  
      const response = await axios.put(`http://localhost:3000/polls/changeVote`, requestData, {
        withCredentials: true
      });
  
      // Handling the backend response properly
      if (response.data.message === "Vote changed successfully.") {
        alert('Vote changed successfully!');
        this.editingPollId = null;
        this.fetchUserVotedPolls();
      } else {
        alert(response.data.message || "Unexpected response from server.");
      }
    } catch (error: any) {
      console.error('Error changing vote:', error.response?.data || error.message);
  
      // Handle known backend error responses
      if (error.response) {
        alert(error.response.data?.message || "An error occurred while changing the vote.");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  }
  

  get displayedPolls(): VotedPoll[] {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    const endIndex = startIndex + this.pollsPerPage;
    return this.votedPolls.slice(startIndex, endIndex);
  }

  isUserVoted(option: PollOption, userVotes: PollOption[]): boolean {
    return userVotes.some(vote => vote.id === option.id);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo(0, 0);
    }
  }

  getPageRange(): number[] {
    const range = [];
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

  trackByPollId(index: number, poll: VotedPoll): number {
    return poll._id;
  }

  trackByOptionId(index: number, option: PollOption): number {
    return option.id;
  }
}