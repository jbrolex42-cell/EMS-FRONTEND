import { formatDistanceToNow, format, parseISO } from 'date-fns';

export const timeAgo = (date) => {
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });
  } catch { return 'Unknown'; }
};

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, fmt);
  } catch { return '—'; }
};

export const formatDateTime = (date) => formatDate(date, 'dd MMM yyyy, HH:mm');

export const minutesToHumanReadable = (minutes) => {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
