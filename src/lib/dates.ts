import {
	CalendarDate,
	getDayOfWeek,
	getLocalTimeZone,
	parseAbsolute,
	today,
	toZoned,
	ZonedDateTime,
	type DateValue
} from '@internationalized/date';

export type CalendarRange = { start: CalendarDate; end: CalendarDate };

export const quarters: CalendarRange[] = [
	{
		start: new CalendarDate(2025, 6, 16),
		end: new CalendarDate(2025, 8, 22)
	},
	{
		start: new CalendarDate(2025, 8, 26),
		end: new CalendarDate(2025, 10, 24)
	},
	{
		start: new CalendarDate(2025, 11, 3),
		end: new CalendarDate(2026, 1, 23)
	},
	{
		start: new CalendarDate(2026, 1, 26),
		end: new CalendarDate(2026, 3, 20)
	}
];

const firstSchoolDay = new CalendarDate(2025, 6, 16);
const lastSchoolDay = new CalendarDate(2026, 3, 20);

export const holidays: (CalendarRange & { name: string })[] = [
	{
		name: 'Ninoy Aquino Day',
		start: new CalendarDate(2025, 8, 21),
		end: new CalendarDate(2025, 8, 21)
	},
	{
		name: 'National Heroes Day',
		start: new CalendarDate(2025, 8, 25),
		end: new CalendarDate(2025, 8, 25)
	},
	{
		name: 'Feast of Immucalate Conception',
		start: new CalendarDate(2025, 12, 8),
		end: new CalendarDate(2025, 12, 8)
	},
	{
		name: 'Year-End Break',
		start: new CalendarDate(2025, 12, 22),
		end: new CalendarDate(2026, 1, 2)
	},
	{
		name: 'Chinese New Year',
		start: new CalendarDate(2026, 2, 17),
		end: new CalendarDate(2026, 2, 17)
	}
];

export const isHoliday = (date: DateValue) => {
	return holidays.some(
		(holiday) => date.compare(holiday.start) >= 0 && date.compare(holiday.end) <= 0
	);
};

export const getHolidayName = (date: DateValue) => {
	const holidayFound = holidays.find(
		(holiday) => date.compare(holiday.start) >= 0 && date.compare(holiday.end) <= 0
	);
	if (holidayFound) {
		return holidayFound.name;
	}

	return null;
};

export const isSchoolDay = (date: DateValue) => {
	return date.compare(firstSchoolDay) >= 0 && date.compare(lastSchoolDay) <= 0;
};

export const isFirstSchoolDay = (date: DateValue) => {
	return date.compare(firstSchoolDay) === 0;
};

export const isLastSchoolDay = (date: DateValue) => {
	return date.compare(lastSchoolDay) === 0;
};

export const isAfterToday = (date: DateValue) => {
	return date.compare(today(getLocalTimeZone())) > 0;
};

export const isWeekend = (date: DateValue) => {
	const dayOfWeek = getDayOfWeek(date, 'en-US');
	return dayOfWeek === 0 || dayOfWeek === 6;
};

export const isDateDisabled = (date: DateValue) => {
	return isWeekend(date) || isHoliday(date) || !isSchoolDay(date) || isAfterToday(date);
};

export const toPostgresTimestamptz = (zdt: ZonedDateTime) => {
	const pad = (n: number, l = 2) => String(n).padStart(l, '0');

	return (
		`${zdt.year}-${pad(zdt.month)}-${pad(zdt.day)} ` +
		`${pad(zdt.hour)}:${pad(zdt.minute)}:${pad(zdt.second)}.` +
		`${pad(zdt.millisecond, 3)}+00`
	);
};

export const isStudentLate = (dbTimestamp: string) => {
	const datedTimestamp = parseAbsolute(dbTimestamp, getLocalTimeZone());

	// Create cutoff time: 7:00:00 AM on the same day
	const cutoff = new Date(
		datedTimestamp.year,
		datedTimestamp.month - 1,
		datedTimestamp.day,
		7,
		0,
		0,
		0
	);
	const attTime = datedTimestamp.toDate();

	return attTime > cutoff;
};

export const getPreviousPossibleDays = (n: number) => {
	let date = today(getLocalTimeZone());
	let previousDays = [] as CalendarDate[];

	while (previousDays.length < n) {
		if (!isDateDisabled(date)) previousDays.push(date);
		date = date.subtract({ days: 1 });
	}

	return previousDays;
};
