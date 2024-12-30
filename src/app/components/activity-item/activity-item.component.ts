import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Activity, ActivityType } from "../../core/models/activity.model";
import { ActivityService } from "../../core/services/activity.service";
import { TimelineItemComponent } from "../timeline-item/timeline-item.component";

@Component({
  selector: "app-activity-item",
  standalone: true,
  imports: [TimelineItemComponent],
  templateUrl: "./activity-item.component.html",
  styleUrl: "./activity-item.component.scss",
})
export class ActivityItemComponent {
  // Input for activity data
  @Input({ required: true }) activity!: Activity;

  // Output event to notify removal
  @Output() removeActivity = new EventEmitter<number>();

  // activity type mapping
  activityTypeMappingOptions!: ActivityType;

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityTypeMappingOptions =
      this.activityService.getActivityTypeMappingOptions();
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

    return diffDays > 0 ? `had ` : "have ";
  }

  /**
   * Emit the activity ID to the parent for removal.
   * @param id - activity id to be removed.
   */
  onRemoveActivity(id: number): void {
    this.removeActivity.emit(id); // Pass activity ID to parent
  }
}
