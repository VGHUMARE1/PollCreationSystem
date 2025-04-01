import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color } from '@swimlane/ngx-charts';
import { PollService } from '../../services/poll.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-poll-analysis',
  standalone: true,
  imports: [NgxChartsModule, CommonModule, MatSnackBarModule, MatButtonModule, MatIconModule],
  templateUrl: './poll-analysis.component.html',
  styleUrls: ['./poll-analysis.component.css']
})
export class PollAnalysisComponent implements OnInit {
  poll: any = null;
  pollId: number = 0;
  voters: any[] = [];
  pollCreator: any = {};
  legendPosition: LegendPosition = LegendPosition.Below;

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
    private pollService: PollService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.pollId) {
      this.loadPollData();
    } else {
      this.router.navigate(['/home/my-polls']);
      this.showToast('Invalid poll ID', 'error');
    }
  }

 
isLoading = true;
errorLoading = false;

async loadPollData() {
  this.isLoading = true;
  this.errorLoading = false;
  
  try {
    const response = await this.pollService.getPollDetails(this.pollId);
    this.poll = response.data;
    this.voters = this.poll?.voters || [];
    this.pollCreator = this.poll?.creator || {};
    this.initializeCharts();
  } catch (error) {
    console.error('Error loading poll data:', error);
    this.errorLoading = true;
    this.showToast('Failed to load poll data', 'error');
    this.router.navigate(['/home/my-polls']);
  } finally {
    this.isLoading = false;
  }
}

copyPollLink() {
  const url = `${window.location.origin}/poll/${this.pollId}`;
  navigator.clipboard.writeText(url);
  this.showToast('Poll link copied to clipboard!', 'success');
}

  private initializeCharts() {
    if (!this.poll?.options) return;

    const totalVotes = this.poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);

    this.pieChartData = this.poll.options.map((opt: any) => ({
      name: `${opt.optionText} (${totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0}%)`,
      value: opt.votes,
      extra: {
        votes: opt.votes,
        percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0
      }
    }));

    this.barChartData = [...this.pieChartData];

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

  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  async deletePoll() {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    try {
      await this.pollService.deletePoll(this.pollId);
      this.showToast('Poll deleted successfully!', 'success');
      this.router.navigate(['/home/my-polls']);
    } catch (error) {
      console.error('Error deleting poll:', error);
      this.showToast('Failed to delete poll. Please try again.', 'error');
    }
  }

  async togglePollStatus() {
    if (!this.poll) return;

    const newStatus = this.poll.status === 'active' ? 'stopped' : 'active';
    if (!confirm(`Change poll status to ${newStatus}?`)) return;

    try {
      await this.pollService.updatePollStatus(this.pollId, newStatus);
      this.poll.status = newStatus;
      this.showToast(`Poll status changed to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      this.showToast('Failed to update poll status', 'error');
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