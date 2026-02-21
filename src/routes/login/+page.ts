import logo from '$lib/assets/favicon.png';
import classroom from '$lib/assets/classroom.jpg';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	return {
		pictures: {
			logo: logo,
			classroom: classroom
		}
	};
};
