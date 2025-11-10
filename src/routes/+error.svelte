<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center text-center">
	<main class="flex flex-1 items-center justify-center px-4">
		<div>
			<h1 class="mb-4 text-4xl font-bold">Error {page.status}</h1>
			<p class="mb-6 text-lg">
				{#if page.status === 404}
					The page you are looking for does not exist.
				{:else}
					An unexpected error has occurred.
				{/if}
			</p>

			<!-- homepage link below the message with extra padding -->
			<a href="/" class="mb-8 inline-block px-4 py-2 text-sm text-foreground hover:underline">
				Go back to the homepage
			</a>
		</div>
	</main>

	<!-- footer sticks to the bottom via mt-auto -->
	<footer
		class="mt-auto flex w-full flex-col items-center gap-2 pb-6 text-sm text-muted-foreground"
	>
		<a
			href="/"
			class="flex items-center gap-2 text-foreground hover:underline"
			aria-label="Go to homepage"
		>
			<img src="/favicon.png" alt="Site logo" class="h-6 w-6 rounded-full" />
			<span class="font-medium">QR-ID</span>
		</a>
	</footer>
</div>
