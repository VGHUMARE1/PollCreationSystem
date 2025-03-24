import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

import { SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-poll-analysis',
  templateUrl: './poll-analysis.component.html',
  styleUrls: ['./poll-analysis.component.css']
})
export class PollAnalysisComponent implements OnInit {
  poll: any = null;
  pollId: number = 0;
  voters: any[] = [];

  // Pie Chart Configuration
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels: string[] = [];
  pieChartData: SingleDataSet = [];
  pieChartType: ChartType = 'pie';

  // Bar Chart Configuration
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Votes', backgroundColor: '#00ADB5' }]
  };
  barChartType: ChartType = 'bar';

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
      const response = await axios.get(`http://localhost:3000/polls/${this.pollId}`);
      this.poll = response.data;
      this.voters = this.poll?.voters || [];

      if (this.poll?.options) {
        this.pieChartLabels = this.poll.options.map((opt: any) => opt.optionText);
        this.pieChartData = this.poll.options.map((opt: any) => opt.votes);

        this.barChartLabels = this.pieChartLabels;
        this.barChartData.labels = this.pieChartLabels;
        this.barChartData.datasets[0].data = this.poll.options.map((opt: any) => opt.votes);
      }
    } catch (error) {
      console.error('Error fetching poll details:', error);
      alert('Failed to fetch poll details. Please try again.');
    }
  }

  async deletePoll() {
    if (!confirm('Are you sure you want to delete this poll?')) return;

    try {
      await axios.delete(`http://localhost:3000/polls/${this.pollId}`);
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
      await axios.put(`http://localhost:3000/polls/${this.pollId}`, { status: newStatus });
      this.poll.status = newStatus;
    } catch (error) {
      console.error('Error updating poll status:', error);
      alert('Failed to update poll status. Please try again.');
    }
  }

  editPoll() {
    this.router.navigate([`/home/edit-poll/${this.pollId}`]);
  }
}
