import {useTranslation} from 'react-i18next';
import {useCallback} from 'react';

export function useFormatDate() {
  const {t, i18n} = useTranslation();
  const locale = i18n.language;

  return useCallback(
    (ts: number): string => {
      const date = new Date(ts);
      const time = date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });

      const today = new Date();
      const isSameDay = date.toDateString() === today.toDateString();

      const dayLabel = isSameDay
        ? t('common.today')
        : date.toLocaleDateString(locale, {day: 'numeric', month: 'short'});

      return `${dayLabel}, ${time}`;
    },
    [locale, t],
  );
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}
