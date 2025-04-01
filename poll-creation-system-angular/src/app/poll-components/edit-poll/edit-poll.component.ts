import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from '../../services/poll.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    public router: Router,
    private pollService: PollService,
    private toastr: ToastrService
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
      const response = await this.pollService.getPoll(this.pollId);
      this.pollData = response.data;
      this.totalVotes = this.pollData.voters?.length || 0;
      this.populateAllFormFields();
    } catch (error) {
      console.error('Error fetching poll:', error);
      this.toastr.error('Failed to load poll data. Please try again.', 'Error');
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
    if (this.pollForm.invalid) {
      this.toastr.warning('Please fix all errors before submitting.', 'Validation Error');
      return;
    }

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
      
      await this.pollService.updatePollDetails(data);
      this.toastr.success('Poll details updated successfully!', 'Success');
      this.pollData.question = question;
    } catch (error) {
      console.error('Error updating poll details:', error);
      this.toastr.error('Failed to update poll details. Please try again.', 'Error');
    } finally {
      this.savingDetails = false;
    }
  }

  async updateExpiryDate() {
    if (this.expiryForm.invalid) {
      this.toastr.warning('Please select a valid future date and time.', 'Validation Error');
      return;
    }
  
    this.savingExpiry = true;
    try {
      const date = new Date(this.expiryForm.value.expiryDateTime);
      const expiryDateTime =
        date.getFullYear() +
        '-' + String(date.getMonth() + 1).padStart(2, '0') +
        '-' + String(date.getDate()).padStart(2, '0') +
        'T' + String(date.getHours()).padStart(2, '0') +
        ':' + String(date.getMinutes()).padStart(2, '0') +
        ':00.000000';
  
      await this.pollService.updateExpiryDate(this.pollId, expiryDateTime);
      this.originalExpiryDate = expiryDateTime;
      this.pollData.expiryDateTime = expiryDateTime;
      this.toastr.success(`Expiry date updated successfully for Poll ID: ${this.pollId}`, 'Success');
    } catch (error: any) {
      console.error("Error updating expiry date:", error.response?.data || error.message);
      this.toastr.error(error.response?.data?.message || "Failed to update expiry date. Please try again.", 'Error');
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
}