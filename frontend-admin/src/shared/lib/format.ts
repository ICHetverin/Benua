import dayjs from 'dayjs';

export const formatDate = (iso: string | undefined): string =>
  iso ? dayjs(iso).format('DD.MM.YYYY HH:mm') : '—';
