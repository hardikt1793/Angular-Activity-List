import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity, ActivityType } from '../../core/models/activity.model';
import { ActivityService } from '../../core/services/activity.service';
import { TimeAgoPipe } from '../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TimeAgoPipe],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit {

  // form group to bind the form
  messageForm!: FormGroup;

  // To hold the activity lists
  activityList: Activity[] = [];

  // to hold the selected activity
  selectedActivity = 'Message';

  // to hold input focus value
  isInputFocused = false;

  // activity type mapping 
  activityTypeMappingOptions: ActivityType = {
    Message: {
      title: "added a note to",
      icon: "fas fa-message",
    },
    Phone: {
      title: "a call with",
      icon: "fas fa-phone",
    },
    Coffee: {
      title: "a coffee with",
      icon: "fas fa-coffee",
    },
    Beer: {
      title: "a party with",
      icon: "fas fa-beer",
    },
    "Meeting Note": {
      title: "a meeting with",
      icon: "fas fa-user",
    },
  };


  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
  ) {

  }

  ngOnInit(): void {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required]], 
    });
    this.getActivityList();
  }

  /**
   * To get the activity note keys
   */
  get getNoteKeys(): string[] {
    return Object.keys(this.activityTypeMappingOptions);
  }

  /**
   * To hold the selected activity. 
   * @param noteType - the type of activity selected.
   */
  selectIcon(noteType: string): void {
    this.selectedActivity = noteType;
  }

  /**
   * To create new activity.
   * @returns 
   */
  onSubmit(): void {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    const activityPayload: Activity = {
      id: Date.now(),
      user: 'You',
      timestamp: new Date(),
      type: this.selectedActivity,
      note: this.messageForm.value.message.trim(),
    };

    setTimeout(() => {
      this.activityService.addNewActivity(activityPayload);
      this.messageForm.reset();
      this.selectedActivity = 'Message';
      this.getActivityList();
    },1000);
    
  }

  /**
   * Get all activity lists.
   */
  getActivityList(): void {
    this.activityList = this.activityService.getActivityList();
  }

  /**
   * Remove the Activity by id. 
   * @param id - id of the activity to be removed
   */
  removeActivity(id: number) {
    const userConfirmed = confirm("Are you sure you want to delete?");

    if (userConfirmed) {
      this.activityService.deleteActivityById(id);
      this.getActivityList();
    }
  }

/**
 * To get the 'had' or 'have' text based on the time of the activity created
 * @param eventDate - date to checked for. 
 * @returns string
 */
isPastOrPresent(eventDate: Date): string {
    const today = new Date();
    // Directly create a Date object from the input string
    const eventDateObj = new Date(eventDate);

    // Get the time difference in milliseconds
    const diffTime = today.getTime() - eventDateObj.getTime();

    // Convert milliseconds to days
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    return diffDays > 0 ? `had ` : 'have ';
  }

}
