<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	let {
		studentAttendances = $bindable()
	}: {
		studentAttendances: string;
	} = $props();
</script>
