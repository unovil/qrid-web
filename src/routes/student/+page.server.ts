import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StudentSearchRow } from '$lib/components/table-types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const { data, error } = await supabase.auth.getUser();

	if (error || !data?.user) {
		redirect(302, '/login');
	}

	const { data: studentRowData, error: studentError } = await supabase.from('students').select(`
		id,
		last_name,
		first_name,
		middle_name,
		sections (
			level,
			section	
		)
	`);

	const studentRowDataTyped = studentRowData as {
		id: number;
		last_name: string;
		first_name: string;
		middle_name: string;
		sections: {
			level: number;
			section: string;
		};
	}[];

	const studentDataMapped: StudentSearchRow[] = studentRowDataTyped.map((s) => ({
		name: `${s.last_name}, ${s.first_name} ${s.middle_name}`,
		lrn: s.id,
		grade: s.sections.level,
		section: s.sections.section
	}));

	return { url: url.origin, students: studentDataMapped };
};
