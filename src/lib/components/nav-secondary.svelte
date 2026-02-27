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
				<form
					action="/dashboard?/logout"
					method="post"
					onsubmit={(e) => {
						if (!confirm('Are you sure you want to log out?')) {
							e.preventDefault();
						}
					}}
				>
					<button
						class="peer/menu-button flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm text-destructive ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-destructive focus-visible:ring-2 active:bg-sidebar-accent active:text-destructive disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
						type="submit"
					>
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</form>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
