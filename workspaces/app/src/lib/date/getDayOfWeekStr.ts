import dayjs from 'dayjs';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export const getDayOfWeekStr = (date: dayjs.Dayjs) => {
  const dayOfWeek = date.day();
  const dayStr = days[dayOfWeek]; // Use bracket notation for compatibility
  if (dayStr === undefined) {
    throw new Error('dayOfWeek is invalid');
  }
  return dayStr;
};
