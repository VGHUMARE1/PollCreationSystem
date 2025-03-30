import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType } from '@swimlane/ngx-charts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '@swimlane/ngx-charts';
import { PollService } from '../../services/poll.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll-analysis',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './poll-analysis.component.html',
  styleUrls: ['./poll-analysis.component.css']
})
export class PollAnalysisComponent implements OnInit {
  poll: any = null;
  pollId: number = 0;
  voters: any[] = [];
  pollCreator: any = {};

  // Chart Configurations
  pieChartData: any[] = [];
  barChartData: any[] = [];
  
  pieChartColorScheme: Color = {
    domain: [],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  barChartColorScheme: Color = {
    domain: [],
    name: '',
    selectable: false,
    group: ScaleType.Time
  };

  private colorPalette: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#E7E9ED', '#8C564B', '#17BECF', '#BCBD22'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollService: PollService
  ) {}

  ngOnInit() {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.pollId) {
      this.loadPollData();
    } else {
      this.router.navigate(['/home/my-polls']);
    }
  }

  async loadPollData() {
    try {
      const response = await this.pollService.getPollDetails(this.pollId);
      this.poll = response.data;
      this.voters = this.poll?.voters || [];
      this.pollCreator = this.poll?.creator || {};
      this.initializeCharts();
    } catch (error) {
      console.error('Error loading poll data:', error);
      this.router.navigate(['/home/my-polls']);
    }
  }

  private initializeCharts() {
    if (!this.poll?.options) return;

    this.pieChartData = this.poll.options.map((opt: any) => ({
      name: opt.optionText,
      value: opt.votes
    }));

    this.barChartData = [...this.pieChartData]; // Same data for both charts

    const colors = this.generateColorScheme(this.poll.options.length);
    this.pieChartColorScheme.domain = colors;
    this.barChartColorScheme.domain = colors;
  }

  private generateColorScheme(numColors: number): string[] {
    return Array.from({ length: numColors }, (_, i) => 
      this.colorPalette[i % this.colorPalette.length] || this.getRandomColor()
    );
  }

  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  async deletePoll() {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    try {
      await this.pollService.deletePoll(this.pollId);
      this.router.navigate(['/home/my-polls'], {
        state: { message: 'Poll deleted successfully!' }
      });
    } catch (error) {
      console.error('Error deleting poll:', error);
      alert('Failed to delete poll. Please try again.');
    }
  }

  async togglePollStatus() {
    if (!this.poll) return;

    const newStatus = this.poll.status === 'active' ? 'stopped' : 'active';
    if (!confirm(`Change poll status to ${newStatus}?`)) return;

    try {
      await this.pollService.updatePollStatus(this.pollId, newStatus);
      this.poll.status = newStatus;
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update poll status.');
    }
  }

  editPoll() {
    this.router.navigate([`/home/edit-poll/${this.pollId}`]);
  }

  getVotedOptionText(votedOptionId: number): string {
    const option = this.poll?.options.find((opt: any) => opt.id === votedOptionId);
    return option?.optionText || 'Unknown option';
  }
}