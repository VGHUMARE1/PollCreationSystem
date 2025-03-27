import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { Color } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-poll-analysis',
  imports: [NgxChartsModule],
  templateUrl: './poll-analysis.component.html',
  styleUrls: ['./poll-analysis.component.css']
})
export class PollAnalysisComponent implements OnInit {
  poll: any = null;
  pollId: number = 0;
  voters: any[] = [];
  pollCreator: any = {};

  // Pie Chart Configuration
  pieChartData: any[] = [];
  pieChartColorScheme: Color = {
    domain: [],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  // Bar Chart Configuration
  barChartData: any[] = [];
  barChartColorScheme: Color = {
    domain: [],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  // Predefined color palette
  private colorPalette: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#E7E9ED', '#8C564B', '#17BECF', '#BCBD22'
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.pollId) {
      this.fetchPollDetails();
    } else {
      console.error('Invalid poll ID.');
      this.router.navigate(['/home/my-polls']);
    }
  }

  async fetchPollDetails() {
    try {
      const response = await axios.get(`http://localhost:3000/polls/${this.pollId}`,{ withCredentials: true });
      this.poll = response.data;
      this.voters = this.poll?.voters || [];
      this.pollCreator = this.poll?.creator || {};

      if (this.poll?.options) {
        // Prepare Pie Chart Data
        this.pieChartData = this.poll.options.map((opt: any, index: number) => ({
          name: opt.optionText,
          value: opt.votes
        }));

        // Prepare Bar Chart Data
        this.barChartData = this.poll.options.map((opt: any, index: number) => ({
          name: opt.optionText,
          value: opt.votes
        }));

        // Dynamically generate color scheme
        const colors = this.generateColorScheme(this.poll.options.length);
        this.pieChartColorScheme.domain = colors;
        this.barChartColorScheme.domain = colors;
      }
    } catch (error) {
      console.error('Error fetching poll details:', error);
      alert('Failed to fetch poll details. Please try again.');
    }
  }

  // Generate a color scheme dynamically
  private generateColorScheme(numColors: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
      // Use predefined palette or generate random colors
      colors.push(this.colorPalette[i % this.colorPalette.length] || this.getRandomColor());
    }
    return colors;
  }

  // Generate a random color
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async deletePoll() {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    try {
      await axios.delete(`http://localhost:3000/polls/${this.pollId}`,{ withCredentials: true });
      alert('Poll deleted successfully!');
      this.router.navigate(['/home/my-polls']);
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete the poll. Please try again.');
    }
  }

  async togglePollStatus() {
    if (!this.poll) return;

    const newStatus = this.poll.status === 'active' ? 'stopped' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus} this poll?`)) return;

    try {
      await axios.put(`http://localhost:3000/polls/${this.pollId}/status`, { status: newStatus },{ withCredentials: true });
      this.poll.status = newStatus;
    } catch (error) {
      console.error('Error updating poll status:', error);
      alert('Failed to update poll status. Please try again.');
    }
  }

  editPoll() {
    this.router.navigate([`/home/edit-poll/${this.pollId}`]);
  }

  getVotedOptionText(votedOptionId: number): string {
    const option = this.poll?.options.find((opt: { id: number; }) => opt.id === votedOptionId);
    return option ? option.optionText : 'N/A';
  }
}