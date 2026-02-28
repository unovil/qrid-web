<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { BookUser, FileDown, Gauge, Github, Settings, User } from '@lucide/svelte';
	import InnerShadowTopIcon from '@tabler/icons-svelte/icons/inner-shadow-top';
	import type { ComponentProps } from 'svelte';
	import NavMain from './nav-main.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import favicon from '$lib/assets/favicon.png';

	let {
		name,
		email,
		schoolName,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		name: string;
		email: string;
		schoolName: string;
	} = $props();

	const data = $derived({
		user: {
			name,
			email,
			avatar: favicon
		},
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: Gauge
			},
			{
				title: 'Attendance Records',
				url: '/records',
				icon: BookUser
			},
			{
				title: 'Student Search',
				url: '/student',
				icon: User
			},
			{
				title: 'Export',
				url: '/export',
				icon: FileDown
			}
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings
			},
			{
				title: 'Visit Github',
				url: 'https://github.com/unovil/qrid-web',
				icon: Github
			}
		]
	});
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<InnerShadowTopIcon class="size-5!" />
							<span class="text-base font-semibold">{schoolName}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavSecondary items={data.navSecondary} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
</Sidebar.Root>
