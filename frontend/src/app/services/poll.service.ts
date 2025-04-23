import { Injectable } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';
import { Poll, Option } from '../model/poll.model';

interface User {
  email: string;
  first_name: string;
  last_name: string;
  phone_no: string;
}

@Injectable({
  providedIn: 'root',
})
export class PollService {
  private apiUrl = 'http://localhost:8080'; // Backend API URL
  private user: User | null = null;
  private JWTToken: string | '' = '';

  constructor(private cookieService: CookieService) {
    this.JWTToken = this.cookieService
      .get('JWTToken')
      .replace(/^"+|"+$/g, '')
      .trim();
    console.log(this.JWTToken);
    this.initializeUser();
  }

  private initializeUser(): void {
    const userCookie = this.cookieService.get('user');

    console.log(userCookie);
    if (userCookie) {
      try {
        this.user = JSON.parse(userCookie) as User;
      } catch (e) {
        console.log('Failed to parse user cookie', e);
        this.user = null;
      }
    }
  }
  // Fetch poll data by ID
  async getPollById(pollId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/polls/analysis?pollId=${pollId}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async updatePoll(pollId: string, pollData: any): Promise<any> {
    console.log(pollData);
    try {
      const response = await axios.put(`${this.apiUrl}/polls`, pollData, {
        headers: {
          Authorization: `Bearer ${this.JWTToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to update polls'
      );
    }
  }

  async getActivePolls(): Promise<Poll[]> {
    if (!this.JWTToken) {
      throw new Error('Authentication required - no token available');
    }

    try {
      const response = await axios.get(
        `${this.apiUrl}/polls/active?email=${encodeURIComponent(
          this.user?.email || ''
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.map((poll: Poll) => this.processPoll(poll));
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  // Submit a vote
  async submitVote(
    pollId: string,
    optionIds: number[]
  ): Promise<{ message: string }> {
    const voteData = {
      pollId: pollId,
      optionIds: optionIds,
      voterEmail: this.user?.email,
    };
    console.log(voteData);
    try {
      const response = await axios.post(`${this.apiUrl}/vote`, voteData, {
        headers: {
          Authorization: `Bearer ${this.JWTToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to cast vote');
    }
  }

  private processPoll(poll: Poll): Poll {
    return {
      ...poll,
      selectedOptions: poll.allowMultiple
        ? new Array(poll.options.length).fill(false)
        : [],
      selectedOption: poll.allowMultiple ? null : poll.options[0]?.id,
      expiryDate: new Date(poll.expiryDate).toLocaleDateString(),
    };
  }

  async getPoll(pollId: number) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/polls/analysis?pollId=${pollId}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async updatePollDetails(data: {
    pollId: number;
    question: string;
    allowMultipleSelect: boolean;
    options: { optionText: string }[];
  }) {
    try {
      const response = await axios.put(`${this.apiUrl}/polls`, data, {
        headers: {
          Authorization: `Bearer ${this.JWTToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to update polls'
      );
    }
  }

  async updateExpiryDate(pollId: number, expiryDateTime: string) {
    try {
      const response = await axios.put(
        `${this.apiUrl}/polls/expiry/${pollId}/${expiryDateTime}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response from spring server to update expiry : ' + response);
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to update expiry date and time'
      );
    }
  }

  async getUserPolls(userId: number) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/polls?email=${encodeURIComponent(
          this.user?.email || ''
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async getPollDetails(pollId: number) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/polls/analysis?pollId=${pollId}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async deletePoll(pollId: number) {
    try {
      const response = await axios.delete(`${this.apiUrl}/polls?id=${pollId}`, {
        headers: {
          Authorization: `Bearer ${this.JWTToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async updatePollStatus(pollId: number, status: string) {
    try {
      if (status === 'stopped') {
        const response = await axios.put(
          `${this.apiUrl}/polls/stop/${pollId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.JWTToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response;
      } else {
        const response = await axios.put(
          `${this.apiUrl}/polls/resume/${pollId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.JWTToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response;
      }
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async createPoll(pollData: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    expiryDateTime: string;
    createdAt: string;
  }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/polls`,
        { ...pollData, email: this.user?.email },
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async getUserVotedPolls() {
    try {
      const response = await axios.get(
        `${this.apiUrl}/polls/voted?email=${encodeURIComponent(
          this.user?.email || ''
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  }

  async deleteVote(pollId: number) {
    try {
      console.log();
      const response = await axios.delete(
        `${this.apiUrl}/vote?pollId=${pollId}&email=${this.user?.email}`,
        {
          headers: {
            Authorization: `Bearer ${this.JWTToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to delete vote');
    }
  }

  async changeVote(data: { pollId: number; optionIds: number[] }) {
    const voteData = {
      pollId: data.pollId,
      optionIds: data.optionIds,
      voterEmail: this.user?.email,
    };
    console.log(voteData);
    try {
      const response = await axios.put(`${this.apiUrl}/vote`, voteData, {
        headers: {
          Authorization: `Bearer ${this.JWTToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error: any) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(error.response?.data?.message || 'Failed to change vote');
    }
  }
}
