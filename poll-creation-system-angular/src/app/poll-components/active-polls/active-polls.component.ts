import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';

interface Option {
  id: number;
  optionText: string;
}

interface Poll {
  _id: string;
  question: string;
  options: Option[];
  allowMultiple: boolean;
  selectedOptions?: boolean[];
  selectedOption?: number; // Now stores the selected option ID
  createdBy: string;
  expiryDate: string;
  totalVotes: number;
}

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
  pollsPerPage: number = 4;
  totalPages: number = 1;
  
constructor(private router: Router) {}
  ngOnInit() {
    this.fetchActivePolls();
  }

  async fetchActivePolls() {
    try {
      const response = await axios.get('http://localhost:3000/polls/active', { withCredentials: true });
      this.allPolls = response.data.map((poll: Poll) => ({
        ...poll,
        selectedOptions: poll.allowMultiple ? new Array(poll.options.length).fill(false) : [],
        selectedOption: poll.allowMultiple ? null : poll.options[0]?.id, // Set to first option's ID if single choice
        expiryDate: new Date(poll.expiryDate).toLocaleDateString()
      }));
      this.totalPages = Math.ceil(this.allPolls.length / this.pollsPerPage);
      this.updateDisplayedPolls();
    } catch (error) {
      console.error('Error fetching active polls:', error);
    }
  }

  updateDisplayedPolls() {
    const startIndex = (this.currentPage - 1) * this.pollsPerPage;
    const endIndex = startIndex + this.pollsPerPage;
    this.displayedPolls = this.allPolls.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedPolls();
      window.scrollTo(0, 0);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPolls();
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedPolls();
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

  async vote(poll: Poll) {
    try {
      const payload = {
        pollId: poll._id,
        optionIds: poll.allowMultiple
          ? poll.options
              .filter((_, index) => poll.selectedOptions![index])
              .map(option => option.id)
          : [poll.selectedOption]
      };
  
      const response = await axios.post('http://localhost:3000/polls/vote', payload, { withCredentials: true });
      // console.log("Vote Successful:", response.data);
      alert(response.data.message);
      this.router.navigate(['/home/voted-polls']);
      this.fetchActivePolls();
    } catch (error:any) {
     
      alert(error.response?.data?.message || "An error occurred while submitting your vote.");
    }
  }

  trackByOption(index: number, option: Option): number {
    return option.id;
  }
}