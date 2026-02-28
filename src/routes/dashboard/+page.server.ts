import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Database } from '$lib/supabase/database';
import type { SummaryAttendanceLogWithSection } from '$lib/components/table-types';
import { getLocalTimeZone, toCalendarDate, today } from '@internationalized/date';

type SummaryAttendanceReturn =
	Database['public']['Functions']['get_attendance_summary_last_5_days']['Returns'];

export const load: PageServerLoad = async ({ url, locals: { safeGetSession, supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	const { data: attendanceSummary, error: attendanceError } = await supabase.rpc(
		'get_attendance_summary_last_5_days'
	);

	if (attendanceError || !attendanceSummary) {
		console.error('Error fetching attendance summary:', attendanceError);
		return {
			error: 'An error occurred while fetching your attendance summary. Please try again later.'
		};
	}

	const map = new Map<string, SummaryAttendanceLogWithSection>();

	for (const row of attendanceSummary as SummaryAttendanceReturn) {
		const sectionLabel = `${row.level} - ${row.section}`;

		if (!map.has(sectionLabel)) {
			map.set(sectionLabel, {
				section: sectionLabel,
				logs: []
			});
		}

		map.get(sectionLabel)!.logs.push({
			date: new Date(row.date),
			present: row.present,
			absent: row.absent,
			late: row.late
		});
	}

	// Optional but usually desired: newest first
	for (const entry of map.values()) {
		entry.logs.sort((a, b) => b.date.getTime() - a.date.getTime());
	}

	const attendanceLogs = Array.from(map.values());

	const todayDate = today(getLocalTimeZone());
	const yesterdayDate = todayDate.subtract({ days: 1 });

	const totals = {
		today: { present: 0, absent: 0, late: 0 },
		yesterday: { present: 0, absent: 0, late: 0 }
	};

	for (const section of attendanceLogs) {
		for (const log of section.logs) {
			if (log.date.toISOString().split('T')[0] === todayDate.toString()) {
				totals.today.present += log.present;
				totals.today.absent += log.absent;
				totals.today.late += log.late;
			}

			if (log.date.toISOString().split('T')[0] === yesterdayDate.toString()) {
				totals.yesterday.present += log.present;
				totals.yesterday.absent += log.absent;
				totals.yesterday.late += log.late;
			}
		}
	}

	return {
		url: url.origin,
		attendanceLogs,
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
