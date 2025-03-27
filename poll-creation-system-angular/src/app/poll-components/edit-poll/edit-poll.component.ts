import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-poll',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-poll.component.html',
  styleUrls: ['./edit-poll.component.css'],
})
export class EditPollComponent implements OnInit {
  pollForm!: FormGroup;
  expiryForm!: FormGroup;
  pollId!: number;
  loading: boolean = true;
  savingDetails: boolean = false;
  savingExpiry: boolean = false;
  minDateTime!: string;
  activeTab: 'details' | 'expiry' = 'details';
  originalExpiryDate!: string;
  pollData: any;
  totalVotes: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.initializeForms();
  }

  async ngOnInit() {
    this.pollId = Number(this.route.snapshot.paramMap.get('id'));
    this.setMinDateTime();
    await this.fetchPollData();
  }

  setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);
  }

  initializeForms() {
    this.pollForm = this.fb.group({
      question: ['', [Validators.required, Validators.maxLength(200)]],
      allowMultiple: [false],
      options: this.fb.array([], Validators.minLength(2)),
    });

    this.expiryForm = this.fb.group({
      expiryDateTime: ['', Validators.required],
    });
  }

  async fetchPollData() {
    try {
      const response = await axios.get(
        `http://localhost:3000/polls/${this.pollId}`,
        { withCredentials: true }
      );
      this.pollData = response.data;
      this.totalVotes = this.pollData.voters?.length || 0;
      this.populateAllFormFields();
    } catch (error) {
      console.error('Error fetching poll:', error);
      this.showToast('Failed to load poll data. Please try again.', 'error');
      this.router.navigate(['/polls']);
    } finally {
      this.loading = false;
    }
  }

  populateAllFormFields() {
    this.pollForm.patchValue({
      question: this.pollData.question,
      allowMultiple: this.pollData.allowMultiple,
    });

    const optionsArray = this.pollForm.get('options') as FormArray;
    optionsArray.clear();
    this.pollData.options.forEach((option: any) => {
      optionsArray.push(
        this.fb.control(option.optionText, [
          Validators.required,
          Validators.maxLength(100),
        ])
      );
    });

    const formattedDate = this.formatDateTimeLocal(
      this.pollData.expiryDateTime
    );
    this.expiryForm.patchValue({
      expiryDateTime: formattedDate,
    });
    this.originalExpiryDate = this.pollData.expiryDateTime;
  }

  formatDateTimeLocal(dateTime: string): string {
    const date = new Date(dateTime);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    if (this.options.length < 10) {
      this.options.push(
        this.fb.control('', [Validators.required, Validators.maxLength(100)])
      );
    }
  }

  removeOption(index: number) {
    if (this.options.length > 2) {
      this.options.removeAt(index);
    }
  }

  async updatePollDetails() {
    if (this.pollForm.invalid) return;

    this.savingDetails = true;
    try {
      const { question, allowMultiple } = this.pollForm.value;
      const options = this.pollForm.value.options.map((optionText: string) => ({
        optionText,
      }));
      const data = {
        pollId: this.pollId,
        question,
        allowMultipleSelect: allowMultiple,
        options,
      };
      console.log(data);
     const response= await axios.put(`http://localhost:3000/polls/update`, data, {
        withCredentials: true,
      });
      console.log(response);
      alert(response.data);

      this.showToast('Poll details updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating poll details:', error);
      this.showToast(
        'Failed to update poll details. Please try again.',
        'error'
      );
    } finally {
      this.savingDetails = false;
    }
  }

  async updateExpiryDate() {
    if (this.expiryForm.invalid) return;

    this.savingExpiry = true;
    try {
      const date = new Date(this.expiryForm.value.expiryDateTime);
      // Format the date manually to avoid the 'Z' at the end
      const expiryDateTime =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0') +
        'T' +
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0') +
        ':00';

      await axios.put(
        `http://localhost:3000/polls/expiry/${this.pollId}`,
        { expiryDateTime },
        { withCredentials: true }
      );

      this.originalExpiryDate = expiryDateTime;
      this.showToast('Expiry date updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating expiry date:', error);
      this.showToast(
        'Failed to update expiry date. Please try again.',
        'error'
      );
    } finally {
      this.savingExpiry = false;
    }
  }

  hasExpiryChanged(): boolean {
    if (!this.originalExpiryDate) return false;
    const newDate = new Date(this.expiryForm.value.expiryDateTime);
    const originalDate = new Date(this.originalExpiryDate);
    return newDate.getTime() !== originalDate.getTime();
  }

  showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="bi ${
        type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'
      }"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
  }
}
