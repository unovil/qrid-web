<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import * as Drawer from '$lib/components/ui/drawer';
	import type { StudentSearchRow } from '$lib/components/table-types';

	let open = $state(false);

	let {
		isDesktop,
		students = new Array<StudentSearchRow>(),
		category,
		selectedStudent = $bindable(null)
	}: {
		isDesktop: boolean;
		students: StudentSearchRow[];
		category: 'LRN' | 'Section/Name';
		selectedStudent: StudentSearchRow | null;
	} = $props();

	const studentDisplays = $derived(
		students.map((student) => ({
			lrn: student.lrn,
			name: student.name,
			gradeSection: `${student.grade} - ${student.section}`
		}))
	);

	const handleStudentSelect = (value: string) => {
		selectedStudent = students.find((student) => student.lrn.toString() === value) || null;

		console.log('Selected student value:', value);
		console.log('Category:', category);
		console.log('Selected student:', selectedStudent);

		open = false;
	};
</script>

{#if isDesktop}
	<Popover.Root bind:open>
		<Popover.Trigger>
			<Button variant="outline" class="w-80 justify-start">
				{selectedStudent
					? `${selectedStudent.name} (${selectedStudent.grade} - ${selectedStudent.section})`
					: `Search by ${category}`}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-80 p-0" align="start">
			<Command.Root>
				<Command.Input placeholder="Filter student..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group>
						{#each studentDisplays as student (student.lrn)}
							<Command.Item
								value={category === 'LRN'
									? student.lrn.toString()
									: `${student.name} (${student.gradeSection})`}
								onSelect={() => handleStudentSelect(student.lrn.toString())}
							>
								{student.name} ({student.gradeSection})
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<Button variant="outline" class="w-80 justify-start">
				{selectedStudent
					? `${selectedStudent.name} (${selectedStudent.grade} - ${selectedStudent.section})`
					: `Search by ${category}`}
			</Button>
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mt-4 border-t">
				<Command.Root>
					<Command.Input placeholder="Filter status..." />
					<Command.List>
						<Command.Empty>No results found.</Command.Empty>
						<Command.Group>
							{#each studentDisplays as student (student.lrn)}
								<Command.Item
									value={category === 'LRN'
										? student.lrn.toString()
										: `${student.name} (${student.gradeSection})`}
									onSelect={() => handleStudentSelect(student.lrn.toString())}
								>
									{student.name} ({student.gradeSection})
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
