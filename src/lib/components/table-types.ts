import type { DateValue, Time, ZonedDateTime } from '@internationalized/date';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export type WarningLog = {
	name: string;
	section: string;
	late: number;
	status: string;
};

export type SummaryAttendanceLog = {
	date: Date;
	present: number;
	absent: number;
	late: number;
};

export type SectionAttendanceRowLog = {
	lrn: number;
	name: string;
	timestamp: string;
	status: AttendanceStatus;
};

export type StudentSearchRow = {
	name: string;
	lrn: number;
	grade: number;
	section: string;
};

/* export type CalendarCellLog = {
	date: DateValue;
	timestamp: Time;
	status: AttendanceStatus;
} */

export type CalendarCellLog = Record<
	string,
	{
		timestamp: Time | null;
		status: AttendanceStatus;
	}
>;
