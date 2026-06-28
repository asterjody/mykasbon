import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';

export function getRelativeTime(date: string): string {
  const parsedDate = new Date(date);

  if (isToday(parsedDate)) {
    return 'Hari ini';
  }

  if (isYesterday(parsedDate)) {
    return 'Kemarin';
  }

  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: id });
}

export function formatDate(date: string): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: id });
}
