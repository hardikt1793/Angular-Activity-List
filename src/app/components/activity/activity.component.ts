import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Activity, ActivityType } from "../../core/models/activity.model";
import { ActivityService } from "../../core/services/activity.service";
import { ActivityItemComponent } from "../activity-item/activity-item.component";
import { TimelineItemComponent } from "../timeline-item/timeline-item.component";

@Component({
  selector: "app-activity",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActivityItemComponent,
    TimelineItemComponent,
  ],
  templateUrl: "./activity.component.html",
  styleUrl: "./activity.component.scss",
})
export class ActivityComponent implements OnInit {
  // form group to bind the form
  messageForm!: FormGroup;

  // To hold the activity lists
  activityList: Activity[] = [];

  // to hold the selected activity
  selectedActivity = "Message";

  // to hold input focus value
  isInputFocused = false;

  // activity type mapping
  activityTypeMappingOptions!: ActivityType;

  // to check whether the submit action is still in progress
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.activityTypeMappingOptions =
      this.activityService.getActivityTypeMappingOptions();
    this.messageForm = this.fb.group({
      message: ["", [Validators.required]],
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
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    const activityPayload: Activity = {
      id: Date.now(),
      user: "You",
      timestamp: new Date(),
      type: this.selectedActivity,
      note: this.messageForm.value.message.trim(),
    };

    setTimeout(() => {
      try {
        this.activityService.addNewActivity(activityPayload);
        this.messageForm.reset();
        this.selectedActivity = "Message";
        this.getActivityList();
      } catch (error) {
        console.error("Error saving activity:", error);
      } finally {
        this.isSubmitting = false;
      }
    }, 1000);
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
}
