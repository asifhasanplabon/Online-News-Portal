import { format, formatDistanceToNow } from "date-fns";

// "June 15, 2025"
export const formatFullDate = (date) => format(new Date(date), "MMMM dd, yyyy");

// "2 hours ago"
export const formatRelativeDate = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });

// "Jun 15"
export const formatShortDate = (date) => format(new Date(date), "MMM dd");