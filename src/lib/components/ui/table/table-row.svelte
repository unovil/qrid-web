<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		onclick,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props();
</script>

<tr
	bind:this={ref}
	data-slot="table-row"
	class={cn(
		'border-b transition-colors data-[state=selected]:bg-muted hover:[&,&>svelte-css-wrapper]:[&>th,td]:bg-muted/50',
		className
	)}
	{...restProps}
	{onclick}
>
	{@render children?.()}
</tr>
