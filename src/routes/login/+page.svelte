<script lang="ts">
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldSeparator
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: className,
		data,
		params,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & PageProps = $props();
	const id = $props.id();
</script>

<div class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-3xl">
		<div class={cn('flex flex-col gap-6', className)} {...restProps}>
			<Card.Root class="overflow-hidden p-0">
				<Card.Content class="grid p-0 md:grid-cols-2">
					<form class="p-6 md:p-8">
						<div class="my-4 flex items-center justify-center gap-2">
							<img src={data.pictures.logo} alt="Logo" class="h-15 w-15" />
							<span class="font-mono text-3xl font-semibold">QR-ID</span>
						</div>
						<FieldGroup>
							<div class="flex flex-col items-center gap-2 text-center">
								<h1 class="text-2xl font-bold">Welcome back</h1>
								<p class="text-balance text-muted-foreground">Login to your QR-ID account</p>
							</div>
							<Field>
								<FieldLabel for="email-{id}">Email</FieldLabel>
								<Input id="email-{id}" type="email" placeholder="m@example.com" required />
							</Field>
							<Field>
								<div class="flex items-center">
									<FieldLabel for="password-{id}">Password</FieldLabel>
								</div>
								<Input id="password-{id}" type="password" required />
							</Field>
							<Field>
								<Button type="submit">Login</Button>
							</Field>
							<FieldDescription class="text-center">
								Don't have an account? <a href="##">Sign up</a>
							</FieldDescription>
						</FieldGroup>
					</form>
					<div class="relative hidden bg-muted md:block">
						<img
							src={data.pictures.classroom}
							alt="placeholder"
							class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</Card.Content>
			</Card.Root>
			<FieldDescription class="px-6 text-center font-mono text-xs">
				By clicking continue, you agree to our <a href="##">Terms of Service</a> and
				<a href="##">Privacy Policy</a>.
			</FieldDescription>
		</div>
	</div>
</div>
