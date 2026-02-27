import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/supabase/database';

export const load: PageServerLoad = async ({ params, url, locals: { supabase } }) => {
	const userRequest = await supabase.auth.getUser();
	if (userRequest.error || !userRequest.data?.user) {
		redirect(302, '/login');
	}

	/* const studentRequest = await supabase
		.from("students")
		.select()
		.eq("id", Number(params.slug))
		.limit(1).single()

	if (studentRequest.error || !studentRequest.data) {
		error(404, { message: "Student not found" })
	}

	const studentData = studentRequest.data as Tables<"students">; */

	return { url: url.origin /* studentData */ };
};
