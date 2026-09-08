export function formatDate(ts: number): string {
  const date = new Date(ts);
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const today = new Date();
  const isSameDay = date.toDateString() === today.toDateString();

  const dayLabel = isSameDay
    ? 'Today'
    : date.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});

  return `${dayLabel}, ${time}`;
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}
