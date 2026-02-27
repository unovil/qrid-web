<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { StudentSearchRow } from '$lib/components/table-types';
	import QueryBox from './query-box.svelte';
	import { goto } from '$app/navigation';

	const id = $props.id();

	let selectedCategory: 'LRN' | 'Section/Name' | undefined = $state(undefined);
	let selectedStudent: StudentSearchRow | null = $state(null);

	const students: StudentSearchRow[] = [
		{ name: 'Doe, John', lrn: 123456789789, grade: 7, section: 'Aristotle' },
		{ name: 'Smith, Jane', lrn: 987654321987, grade: 8, section: 'Plato' },
		{ name: 'Johnson, Emily', lrn: 456789123456, grade: 9, section: 'Socrates' },
		{ name: 'Brown, Michael', lrn: 321654987321, grade: 10, section: 'Aristotle' },
		{ name: 'Davis, Sarah', lrn: 654321987654, grade: 11, section: 'Plato' }
	];

	let open = $state(false);
	let isDesktop = $state(false);

	function checkScreenSize() {
		isDesktop = window.innerWidth >= 768;
	}

	onMount(() => {
		if (browser) {
			checkScreenSize();
			window.addEventListener('resize', checkScreenSize);
			return () => window.removeEventListener('resize', checkScreenSize);
		}
	});
</script>

<div class="flex h-full flex-col items-center justify-center gap-15 pb-15">
	<div class="items-center justify-center text-center">
		<h1 class="mb-4 text-4xl font-bold">Student Search</h1>
		<p class="text-lg text-gray-600">Search for a student using different criteria.</p>
	</div>

	<div
		class="flex w-full flex-col items-center justify-center gap-8 *:flex *:flex-col *:gap-3 @xl/main:flex-row"
	>
		<div>
			<Label for="{id}-section" class="px-1">1. Category</Label>
			<Select.Root
				type="single"
				bind:value={selectedCategory}
				onValueChange={() => (selectedStudent = null)}
			>
				<Select.Trigger id="{id}-section" class="w-48"
					>{selectedCategory || 'Select a category'}</Select.Trigger
				>
				<Select.Content>
					<Select.Item value="Section/Name">Section/Name</Select.Item>
					<Select.Item value="LRN">LRN</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<div>
			<Label for="{id}-query" class="px-1">2. Query</Label>
			{#if selectedCategory === 'LRN'}
				<QueryBox {isDesktop} {students} category="LRN" bind:selectedStudent />
			{:else if selectedCategory === 'Section/Name'}
				<QueryBox {isDesktop} {students} category="Section/Name" bind:selectedStudent />
			{:else}
				<Input
					id="{id}-query"
					type="text"
					class="w-80"
					placeholder="Select a category first"
					disabled
				></Input>
			{/if}
		</div>
		<div>
			<Label for="{id}-search" class="px-1">3. Search!</Label>
			<Button
				class="w-full cursor-pointer"
				disabled={!selectedStudent}
				onclick={() => {
					if (selectedStudent) goto(`/student/${selectedStudent.lrn}`);
				}}
			>
				Search for Student
			</Button>
		</div>
	</div>
</div>
