import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/supabase/database';
import type { SectionAttendanceRowLog } from '$lib/components/table-types';

type Sections = Tables<'sections'>;
type Students = Tables<'students'>;
type Attendances = Tables<'attendances'>;

function buildAttendanceLogs(
	students: Students[],
	attendances: Attendances[],
	sections: Sections[]
) {
	const attendanceMap = new Map<string, Attendances[]>(); // key = YYYY-MM-DD
	for (const att of attendances) {
		const dateStr = att.timestamp.split('T')[0]; // get date part only
		if (!attendanceMap.has(dateStr)) attendanceMap.set(dateStr, []);
		attendanceMap.get(dateStr)!.push(att);
	}

	const uniqueDates = Array.from(attendanceMap.keys())
		.sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // latest first
		.map((d) => new Date(d));

	return uniqueDates.map((date) => {
		const dateStr = date.toISOString().split('T')[0];

		const sectionLogs = sections.map((section) => {
			const studentsInSection = students.filter((s) => s.section_id === section.id);

			let maleData: SectionAttendanceRowLog[] = [];
			let femaleData: SectionAttendanceRowLog[] = [];

			for (const student of studentsInSection) {
				const att = (attendanceMap.get(dateStr) || []).find((a) => a.student_id === student.id);
				let status: 'Present' | 'Absent' | 'Late' = 'Absent';
				let timestamp = '-';

				if (att) {
					const attTime = new Date(att.timestamp);
					timestamp = attTime.toLocaleTimeString('en-US', { hour12: true });
					status = attTime.getHours() < 7 ? 'Present' : 'Late';
				}

				const logEntry: SectionAttendanceRowLog = {
					name: `${student.last_name}, ${student.first_name} ${student.middle_name || ''}`.trim(),
					lrn: student.id,
					timestamp,
					status,
					sex: student.sex
				};

				if (student.sex === 'MALE') maleData.push(logEntry);
				else if (student.sex === 'FEMALE') femaleData.push(logEntry);
			}

			maleData.sort((a, b) => a.name.localeCompare(b.name));
			femaleData.sort((a, b) => a.name.localeCompare(b.name));

			return {
				section: `${section.level} - ${section.section}`,
				studentDataMale: maleData,
				studentDataFemale: femaleData
			};
		});

		return {
			date,
			logs: sectionLogs
		};
	});
}

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	const { data: students } = await supabase.from('students').select();
	const { data: sections } = await supabase.from('sections').select();
	const { data: attendances } = await supabase.from('attendances').select();

	const attendanceLogs = buildAttendanceLogs(students || [], attendances || [], sections || []);

	console.log(attendanceLogs);

	return { url: url.origin, attendanceLogs };
};
