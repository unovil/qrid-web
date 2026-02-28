import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/supabase/database';
import type { AttendanceStatus, SectionAttendanceRowLog } from '$lib/components/table-types';
import {
	getLocalTimeZone,
	parseAbsolute,
	parseDate,
	toCalendarDate,
	toZoned,
	ZonedDateTime
} from '@internationalized/date';
import type { PostgrestError } from '@supabase/supabase-js';

function toPostgresTimestamptz(zdt: ZonedDateTime): string {
	const pad = (n: number, l = 2) => String(n).padStart(l, '0');

	return (
		`${zdt.year}-${pad(zdt.month)}-${pad(zdt.day)} ` +
		`${pad(zdt.hour)}:${pad(zdt.minute)}:${pad(zdt.second)}.` +
		`${pad(zdt.millisecond, 3)}+00`
	);
}

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	const { data: sections } = (await supabase.from('sections').select()) as {
		data: Tables<'sections'>[];
	};

	const selectedDate = url.searchParams.get('date');
	const selectedSectionId = url.searchParams.get('sectionId');

	console.log('URL parameters - date:', selectedDate, 'sectionId:', selectedSectionId);

	if (!selectedDate || !selectedSectionId || isNaN(Number(selectedSectionId))) {
		return { url: url.origin, sections };
	}

	let parsedDate: ZonedDateTime | null = null;
	try {
		parsedDate = toZoned(toZoned(parseDate(selectedDate), getLocalTimeZone()), 'UTC');
		console.log('Parsed date:', parsedDate.toString());
	} catch (e) {
		console.error('Invalid date format:', selectedDate);
		return { url: url.origin, sections };
	}

	const { data: students } = (await supabase
		.from('students')
		.select()
		.eq('section_id', Number(selectedSectionId))) as { data: Tables<'students'>[] };
	if (!students) {
		return { url: url.origin, sections };
	}

	console.log(
		toPostgresTimestamptz(parsedDate),
		toPostgresTimestamptz(parsedDate.add({ days: 1 }))
	);

	const { data: attendances, error: attendanceError } = (await supabase
		.from('attendances')
		.select(
			`
			id,
			students (
				id,
				section_id
			),
			timestamp
		`
		)
		.eq('students.section_id', Number(selectedSectionId))
		.gte('timestamp', toPostgresTimestamptz(parsedDate))
		.lt('timestamp', toPostgresTimestamptz(parsedDate.add({ days: 1 })))) as {
		data: {
			id: number;
			students: {
				id: number;
				section_id: number;
			};
			timestamp: string;
		}[];
		error: PostgrestError | null;
	};

	const attendanceLogs: SectionAttendanceRowLog[] = students.map((student) => {
		const attendance = attendances?.find((att) => att.students?.id === student.id);

		let status: AttendanceStatus = 'Absent';
		let timestamp = '-';

		if (attendance) {
			const datedTimestamp = toZoned(
				parseAbsolute(attendance.timestamp, 'UTC'),
				getLocalTimeZone()
			);
			console.log(
				'Original timestamp (UTC):',
				attendance.timestamp,
				'Parsed timestamp (local):',
				datedTimestamp.toString()
			);

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

			timestamp = datedTimestamp
				.toDate()
				.toLocaleTimeString('en-US', {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: true
				});
			status = attTime <= cutoff ? 'Present' : 'Late';
		}

		return {
			name: `${student.last_name}, ${student.first_name} ${student.middle_name}`,
			lrn: student.id,
			timestamp,
			status,
			sex: student.sex
		};
	});

	console.log(attendanceLogs);

	return { url: url.origin, sections, attendanceLogs };
};
