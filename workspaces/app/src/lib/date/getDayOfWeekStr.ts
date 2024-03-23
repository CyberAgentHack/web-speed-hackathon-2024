import dayjs from 'dayjs';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export const getDayOfWeekStr = (date: dayjs.Dayjs) => {
  const dayOfWeek = date.day();
  const dayStr = days[dayOfWeek];
  if (dayStr == null) {
    throw new Error('dayOfWeek is invalid');
  }
  return dayStr;
};