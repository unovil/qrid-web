<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="flex min-h-screen flex-col bg-radial from-white from-30% to-gray-200">
	<div class="mt-4 flex items-center justify-center gap-2 pt-6 pb-8">
		<img src={data.logo} alt="Logo" class="h-15 w-15" />
		<span class="font-mono text-3xl font-semibold">QR-ID</span>
	</div>
	<div class="flex flex-1 flex-col items-center justify-center px-6">
		<div
			class="mx-auto w-full text-center sm:max-w-160 md:max-w-3xl md:px-8 lg:max-w-5xl xl:max-w-7xl"
		>
			<h1
				class="sm:text-4.5xl mx-auto max-w-70 text-3xl/9 font-bold tracking-tight text-balance text-gray-950 sm:max-w-4xl! md:text-5xl md:font-bold lg:text-6xl [@media(width>=27.5em)]:max-w-97"
			>
				Secure attendance management, all in your fingertips.
			</h1>
			<p
				class="mx-auto mt-4 max-w-md text-base/6 text-pretty text-gray-600 sm:max-w-2xl sm:text-lg"
			>
				Need more than attendance recording? QR-ID on Web gives you full attendance control over the
				QR-ID system. Now you can manage your students' records, view statistics, and export data.
			</p>
			<div class="my-10 flex justify-center gap-4">
				<!-- Should change depending on whether the user has already signed in or not. -->
				<a
					href="/login"
					class="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>Get started</a
				>
				<a
					href="https://github.com/unovil/qrid-web"
					class="inline-block rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600"
					>See us on GitHub</a
				>
			</div>
		</div>
	</div>
	<footer class="mt-auto">
		<p class="mx-auto py-8 text-center font-mono text-xs text-balance text-gray-500">
			This research project is hosted by Pasig City Science High School and developed by Batch 16
			researcher Juan Miguel Villegas. This project is licensed under the MIT License.
		</p>
	</footer>
</div>
