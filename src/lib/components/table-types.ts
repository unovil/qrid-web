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
	status: 'Present' | 'Absent' | 'Late';
};

export type StudentSearchRow = {
	name: string;
	lrn: number;
	grade: number;
	section: string;
};
