import type {
	SummaryAttendanceLog,
	SummaryAttendanceLogWithSection
} from '$lib/components/table-types';
import { getPreviousPossibleDays, isStudentLate, toPostgresTimestamptz } from '$lib/dates';
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

	for (const section of sections) {
		let logs: SummaryAttendanceLog[] = [];

		const { count: studentCount } = await supabase
			.from('students')
			.select('*', { count: 'exact', head: true })
			.eq('section_id', section.id);

		if (studentCount === null) continue;

		for (const day of lastFiveDays) {
			const { data: attendances, count: notAbsentCount } = (await supabase
				.from('attendances')
				.select('timestamp, students ( sections ( id ) )', { count: 'exact' })
				.eq('students.section_id', section.id)
				.gte('timestamp', toPostgresTimestamptz(toZoned(day, 'UTC')))
				.lt('timestamp', toPostgresTimestamptz(toZoned(day, 'UTC').add({ days: 1 })))) as {
				data: { timestamp: string }[] | null;
				count: number | null;
			};

			if (attendances === null || notAbsentCount === null) continue;

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

	const todayDate = today(getLocalTimeZone());
	const yesterdayDate = todayDate.subtract({ days: 1 });

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

	return {
		url: url.origin,
		attendanceLogs: Array.from(mappedSummary.values()),
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
