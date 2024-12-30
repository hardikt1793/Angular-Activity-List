import { Pipe, PipeTransform } from "@angular/core";

/**
 * Returns the time ago based on activity created.
 */
@Pipe({
  name: "timeAgo",
  standalone: true,
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - new Date(value).getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
    if (seconds < 60) {
      return `${seconds}sec ago`;
    } else if (minutes < 60) {
      return `${minutes}min ago`;
    } else if (hours < 24) {
      return `${hours}hr ago`;
    } else if (days < 30) {
      return `${days}d ago`;
    } else if (months < 12) {
      return `${months}m ago`;
    } else {
      return `${years}y ago`;
    }
  }
}
