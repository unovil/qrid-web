import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/supabase/database';
import {
	CalendarDateTime,
	getLocalTimeZone,
	parseAbsolute,
	parseDateTime,
	parseZonedDateTime,
	toCalendar,
	toCalendarDateTime
} from '@internationalized/date';
import { toZoned } from '@internationalized/date';

export const load: PageServerLoad = async ({ params, url, locals: { supabase } }) => {
	const userRequest = await supabase.auth.getUser();
	if (userRequest.error || !userRequest.data?.user) {
		redirect(302, '/login');
	}

	const studentRequest = await supabase
		.from('students')
		.select(
			`
		id,
		last_name,
		first_name,
		middle_name,
		avatar,
		sections (
			level,
			section	
		)
	`
		)
		.eq('id', Number(params.slug))
		.limit(1)
		.single();

	const attendanceRequest = await supabase
		.from('attendances')
		.select()
		.eq('student_id', Number(params.slug));

	if (studentRequest.error || !studentRequest.data) {
		error(404, { message: 'Student not found' });
	}

	if (attendanceRequest.error || !attendanceRequest.data) {
		error(404, { message: 'Attendance records not found' });
	}

	const studentData = studentRequest.data as {
		id: number;
		last_name: string;
		first_name: string;
		middle_name: string;
		avatar: string;
		sections: {
			level: number;
			section: string;
		};
	};
	const attendanceData = (attendanceRequest.data as Tables<'attendances'>[]).map((a) => {
		const zonedDateTime = parseAbsolute(a.timestamp.split('.')[0] + 'Z', getLocalTimeZone());

		return {
			...a,
			timestamp: zonedDateTime
		};
	});

	const avatar = supabase.storage.from('avatars').getPublicUrl(studentData.avatar);

	return {
		url: url.origin,
		student: studentData,
		attendances: attendanceData,
		avatar: avatar.data.publicUrl
	};
};
