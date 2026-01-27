import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatDateRange(startDate: Date | string, endDate?: Date | string | null): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
  
  const startStr = start.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  const endStr = end 
    ? end.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : 'Present';
  
  return `${startStr} - ${endStr}`;
}
