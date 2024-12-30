import { Component, Input } from "@angular/core";
import { TimeAgoPipe } from "../../core/pipes/time-ago.pipe";

@Component({
  selector: "app-timeline-item",
  standalone: true,
  imports: [TimeAgoPipe],
  templateUrl: "./timeline-item.component.html",
  styleUrl: "./timeline-item.component.scss",
})
export class TimelineItemComponent {
  // timestamp of the timeline
  @Input() timestamp!: Date;

  // to dynamically assign icon
  @Input() icon = "fas fa-list";

  // to handle the focused class
  @Input() isInputFocused = false;
}
