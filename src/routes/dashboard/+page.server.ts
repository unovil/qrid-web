import type {
	SummaryAttendanceLog,
	SummaryAttendanceLogWithSection
} from '$lib/components/table-types';
import {
	getPreviousPossibleDays,
	isStudentLate,
	quarters,
	toPostgresTimestamptz
} from '$lib/dates';
import type { Tables } from '$lib/supabase/database';
import { getLocalTimeZone, today, toZoned } from '@internationalized/date';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	const lastFiveDays = getPreviousPossibleDays(5);

	let mappedSummary = new Map<string, SummaryAttendanceLogWithSection>();

	const sections = (await supabase.from('sections').select()).data as Tables<'sections'>[] | null;
	if (!sections)
		return { error: 'An error occurred while fetching your sections. Please try again later.' };

	console.log(sections);

	for (const section of sections) {
		let logs: SummaryAttendanceLog[] = [];

		const { count: studentCount } = await supabase
			.from('students')
			.select('*', { count: 'exact', head: true })
			.eq('section_id', section.id);

		if (studentCount === null) continue;
		console.log('Student count for section', section.section, ' is ', studentCount);

		for (const day of lastFiveDays) {
			const { data: attendances } = (await supabase
				.from('attendances')
				.select('timestamp, students!inner(section_id) )')
				.eq('students.section_id', section.id)
				.gte('timestamp', toPostgresTimestamptz(toZoned(toZoned(day, getLocalTimeZone()), 'UTC')))
				.lt(
					'timestamp',
					toPostgresTimestamptz(toZoned(toZoned(day, getLocalTimeZone()), 'UTC').add({ days: 1 }))
				)) as {
				data: { timestamp: string }[] | null;
			};

			const notAbsentCount = attendances?.length;

			if (attendances === null || notAbsentCount === undefined) continue;

			const absentCount = studentCount - notAbsentCount;

			const onTimeCount = attendances.filter((att) => {
				return !isStudentLate(att.timestamp);
			}).length;

			const lateCount = notAbsentCount - onTimeCount;

			logs.push({
				date: day.toDate(getLocalTimeZone()),
				present: onTimeCount,
				absent: absentCount,
				late: lateCount
			});
		}

		mappedSummary.set(`${section.level} - ${section.section}`, {
			section: `${section.level} - ${section.section}`,
			logs
		});
	}

	for (const entry of mappedSummary.values()) {
		entry.logs.sort((a, b) => b.date.getTime() - a.date.getTime());
	}

	const totals = {
		today: { present: 0, absent: 0, late: 0 },
		yesterday: { present: 0, absent: 0, late: 0 }
	};

	for (const section of mappedSummary.values()) {
		totals.today.present += section.logs[0]?.present || 0;
		totals.today.absent += section.logs[0]?.absent || 0;
		totals.today.late += section.logs[0]?.late || 0;

		totals.yesterday.present += section.logs[1]?.present || 0;
		totals.yesterday.absent += section.logs[1]?.absent || 0;
		totals.yesterday.late += section.logs[1]?.late || 0;
	}

	const attendancesThisQuarter = (
		await supabase
			.from('attendances')
			.select(
				`
			students (
				id,
				last_name,
				first_name,
				middle_name,
				sections (
					level,
					section
				)
			),
			timestamp
		`
			)
			.gte('timestamp', toPostgresTimestamptz(toZoned(quarters['4th Quarter'].start, 'UTC')))
			.lt(
				'timestamp',
				toPostgresTimestamptz(toZoned(quarters['4th Quarter'].end, 'UTC').add({ days: 1 }))
			)
	).data as
		| {
				students: {
					id: number;
					last_name: string;
					first_name: string;
					middle_name: string;
					sections: {
						level: number;
						section: string;
					};
				};
				timestamp: string;
		  }[]
		| null;

	if (attendancesThisQuarter === null) {
		return {
			url: url.origin,
			attendanceLogs: Array.from(mappedSummary.values()),
			totals
		};
	}

	const map = new Map<number, { name: string; section: string; late: number; status: string }>();

	for (const record of attendancesThisQuarter) {
		const { students, timestamp } = record;

		if (!map.has(students.id)) {
			map.set(students.id, {
				name: `${students.last_name}, ${students.first_name} ${students.middle_name}`,
				section: `${students.sections.level} - ${students.sections.section}`,
				late: 0,
				status: ''
			});
		}

		if (isStudentLate(timestamp)) {
			map.get(students.id)!.late++;
		}
	}

	for (const [id, info] of map.entries()) {
		// ... here lies status text!
		// 3 = warning slip
		// 6 = parent conference
		// 9 = community service

		if (info.late >= 9) {
			info.status = 'Community Service';
		} else if (info.late >= 6) {
			info.status = 'Parent Conference';
		} else if (info.late >= 3) {
			info.status = 'Warning Slip';
		} else {
			info.status = 'None';
		}

		if (info.late === 0) map.delete(id);
	}

	return {
		url: url.origin,
		attendanceLogs: Array.from(mappedSummary.values()),
		lateStudents: Array.from(map.values()).sort((a, b) => b.late - a.late),
		totals
	};
};

export const actions: Actions = {
	logout: async (event) => {
		const {
			locals: { supabase }
		} = event;

		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error('Error signing out:', error);
			return { error: 'An error occurred while trying to log out. Please try again.' };
		}

		redirect(302, '/login');
	}
};
