<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	const siteHeaders: {
		route: typeof page.route.id;
		title: string;
	}[] = [
		{ route: '/dashboard', title: 'Dashboard' },
		{ route: '/records', title: 'Records' },
		{ route: '/export', title: 'Export' }
	];

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !session || page.route.id === '/'}
	{@render children()}
{:else}
	<Sidebar.Provider
		style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
		class="min-h-screen min-w-screen"
	>
		<AppSidebar variant="inset" />
		<Sidebar.Inset>
			<SiteHeader
				title={siteHeaders.find((h) => h.route === page.route.id)?.title ?? 'Dashboard'}
			/>
			<div class="flex flex-1 flex-col">
				<div class="@container/main flex flex-1 flex-col gap-2">
					<div class="flex flex-1 flex-col gap-8 px-4 py-4 md:gap-10 md:py-6 lg:px-6">
						{@render children()}
					</div>
				</div>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
