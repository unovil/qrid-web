<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { IconCircleNumber1, IconCircleNumber2 } from '@tabler/icons-svelte';

	let {
		gradeItems = [],
		sectionItems = [],
		gradeValue = $bindable(),
		sectionValue = $bindable()
	}: {
		gradeItems?: Array<{ value: string; label: string }>;
		sectionItems?: Array<{ value: string; label: string }>;
		gradeValue?: string;
		sectionValue?: string;
	} = $props();

	const triggerContentGrade = $derived(
		gradeItems.find((f) => f.value === gradeValue)?.label ?? 'Select a grade level'
	);

	const triggerContentSection = $derived(
		sectionItems.find((f) => f.value === sectionValue)?.label ?? 'Select a section'
	);

	$effect(() => {
		if (gradeItems.length === 1) gradeValue = gradeItems[0].value;
		if (sectionItems.length === 1) sectionValue = sectionItems[0].value;
	});
</script>

<div class="flex flex-row gap-6">
	<div class="flex flex-row gap-3">
		<IconCircleNumber1 class="mt-auto mb-auto" />

		<Select.Root
			type="single"
			name="gradeLevel"
			bind:value={gradeValue}
			disabled={gradeItems.length < 2}
			onValueChange={() => (sectionValue = '')}
		>
			<Select.Trigger class="w-[180px]">
				{triggerContentGrade}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Grade Levels</Select.Label>
					{#each gradeItems as grade (grade.value)}
						<Select.Item value={grade.value} label={grade.label} disabled={false}>
							{grade.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex flex-row gap-3">
		<IconCircleNumber2 class="mt-auto mb-auto" />

		<Select.Root
			type="single"
			name="section"
			bind:value={sectionValue}
			disabled={!gradeValue || sectionItems.length < 2}
		>
			<Select.Trigger class="w-[180px]">
				{triggerContentSection}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Sections</Select.Label>
					{#each sectionItems as section (section.value)}
						<Select.Item value={section.value} label={section.label} disabled={false}>
							{section.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>
