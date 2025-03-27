import axios from 'axios';

export class PollService {
  private static apiUrl = 'http://localhost:3000/polls'; // Backend API URL

  // Fetch poll data by ID
  static async getPollById(pollId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/${pollId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching poll:', error);
      throw error;
    }
  }

  // Update poll
  static async updatePoll(pollId: string, pollData: any): Promise<any> {
    try {
      const response = await axios.put(`${this.apiUrl}/${pollId}`, pollData);
      return response.data;
    } catch (error) {
      console.error('Error updating poll:', error);
      throw error;
    }
  }
}
