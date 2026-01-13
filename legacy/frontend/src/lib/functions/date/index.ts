const units = [
  { label: 'yr', seconds: 31536000 },
  { label: 'mo', seconds: 2592000 },
  { label: 'wk', seconds: 604800 },
  { label: 'd', seconds: 86400 },
  { label: 'hr', seconds: 3600 },
  { label: 'min', seconds: 60 },
  { label: 's', seconds: 1 }
];

export class FormatDate {
  private readonly parsedDate: Date;

  constructor(date: string) {
    const _date = new Date(date);
    if (isNaN(_date.valueOf())) {
      throw new Error('invalid date format');
    }
    this.parsedDate = _date;
  }

  format() {
    const formatted_date = this.parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return formatted_date;
  }

  timeAgo() {
    const diff_time = Math.floor((new Date().valueOf() - this.parsedDate.valueOf()) / 1000);
    if (diff_time <= 0) return 'just now';

    for (const { label, seconds } of units) {
      const interval = Math.floor(diff_time / seconds);
      if (interval >= 1) {
        return `${interval}${label} ago`;
      }
    }
    // for future dates
    return 'on the way';
  }
}
