
import axios from 'axios';
import { Injectable } from '@angular/core';


import { Poll, Option } from '../model/poll.model';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:3000/polls'; // Backend API URL

  // Fetch poll data by ID
 async getPollById(pollId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${pollId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      // console.error('Error fetching poll:', error);
      throw error;
    }
  }

  // Update poll
   async updatePoll(pollId: string, pollData: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/${pollId}`, pollData, { withCredentials: true });
      return response.data;
    } catch (error) {
      // console.error('Error updating poll:', error);
      throw error;
    }
  }





  // Fetch active polls
  async getActivePolls(): Promise<Poll[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/active`, { withCredentials: true });
      return response.data.map((poll: Poll) => this.processPoll(poll));
    } catch (error) {
      // console.error('Error fetching active polls:', error);
      throw error;
    }
  }

  // Submit a vote
  async submitVote(pollId: string, optionIds: number[]): Promise<{ message: string }> {
    // console.log(pollId)
    try {
      const response = await axios.post(`${this.apiUrl}/vote`, {
        pollId,
        optionIds
      }, { withCredentials: true });
      return response.data;
    } catch (error) {
      // console.error('Error submitting vote:', error);
      throw error;
    }
  }

  // Process poll data (formatting, adding default values)
  private processPoll(poll: Poll): Poll {
    return {
      ...poll,
      selectedOptions: poll.allowMultiple ? new Array(poll.options.length).fill(false) : [],
      selectedOption: poll.allowMultiple ? null : poll.options[0]?.id,
      expiryDate: new Date(poll.expiryDate).toLocaleDateString()
    };
  }

  async getPoll(pollId: number) {
    return axios.get(`${this.apiUrl}/${pollId}`, { withCredentials: true });
  }

  async updatePollDetails(data: {
    pollId: number;
    question: string;
    allowMultipleSelect: boolean;
    options: { optionText: string }[];
  }) {
    return axios.put(`${this.apiUrl}/update`, data, { withCredentials: true });
  }

  async updateExpiryDate(pollId: number, expiryDateTime: string) {
    return axios.put(
      `${this.apiUrl}/expiry/${pollId}`,
      { expiryDateTime },
      { withCredentials: true }
    );
  }

  async getUserPolls(userId: number) {
    return axios.get(`${this.apiUrl}/user/${userId}`, { withCredentials: true });
  }


  async getPollDetails(pollId: number) {
    return axios.get(`${this.apiUrl}/${pollId}`, { withCredentials: true });
  }

  async deletePoll(pollId: number) {
    return axios.delete(`${this.apiUrl}/${pollId}`, { withCredentials: true });
  }

  async updatePollStatus(pollId: number, status: string) {
    return axios.put(
      `${this.apiUrl}/${pollId}/status`, 
      { status }, 
      { withCredentials: true }
    );
  }

  async createPoll(pollData: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    expiryDateTime: string;
    createdAt: string;
  }) {
    return axios.post(`${this.apiUrl}`, pollData, { withCredentials: true });
  }

  async getUserVotedPolls() {
    return axios.get(`${this.apiUrl}/voted-by-user`, { withCredentials: true });
  }

  async deleteVote(pollId: number) {
    return axios.delete(`${this.apiUrl}/${pollId}/vote`, { withCredentials: true });
  }

  async changeVote(data: { pollId: number; optionIds: number[] }) {
    return axios.put(`${this.apiUrl}/changeVote`, data, { withCredentials: true });
  }
}





