const fullWeekDay = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(new Date());
const weekDayMap = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

export { fullWeekDay, weekDayMap };

export default {
  fullWeekDay,
  weekDayMap
}
