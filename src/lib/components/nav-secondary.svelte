<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { WithoutChildren } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import { LogOut, type Icon as IconType } from '@lucide/svelte';

	let {
		items,
		...restProps
	}: { items: { title: string; url: string; icon: typeof IconType }[] } & WithoutChildren<
		ComponentProps<typeof Sidebar.Group>
	> = $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								{#if item.icon}
									{@const Icon = item.icon}
									<Icon />
								{/if}
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton tooltipContent="Logout">
					<form
						action="/dashboard?/logout"
						method="post"
						onsubmit={(e) => {
							if (!confirm('Are you sure you want to log out?')) {
								e.preventDefault();
							}
						}}
					>
						<button type="submit" class="flex items-center gap-2 text-destructive">
							<LogOut size={16} />
							<span>Logout</span>
						</button>
					</form>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
