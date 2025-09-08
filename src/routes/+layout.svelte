<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import SiteSidebar from '$lib/components/site-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { page } from '$app/state';
	import '../app.css';

	let { children } = $props();

	const titleMap = {
		'/settings': 'Settings',
		'/attendances': 'Attendances',
		'/': 'Dashboard',
	};

	let headerTitle = $derived.by(() => {
		return Object.entries(titleMap).find(([prefix]) =>
			page.url.pathname.startsWith(prefix)
		)?.[1] ?? 'Default'
	});
</script>

<Sidebar.Provider style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);">
	<SiteSidebar variant="inset" />
	<Sidebar.Inset>
		<SiteHeader title={headerTitle}/>
		{@render children()}	
	</Sidebar.Inset>
</Sidebar.Provider>