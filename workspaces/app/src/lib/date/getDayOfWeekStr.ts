import type moment from 'moment-timezone';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export const getDayOfWeekStr = (date: moment.Moment) => {
  const dayOfWeek = date.day();
  const dayStr = days.at(dayOfWeek);
  if (dayStr == null) {
    throw new Error('dayOfWeek is invalid');
  }
  return dayStr;
};
