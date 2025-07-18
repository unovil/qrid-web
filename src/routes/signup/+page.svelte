<!-- <script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";

    const id = $props.id();
</script>

<div class="flex h-screen w-full">
    <div class="w-[55%] border-r border-r-black flex items-center justify-center px-4">
        <p>Here is some text. This should be a placeholder only.</p>
    </div>
    <div class="w-[45%] flex items-center justify-center px-4">
        <Card.Root class="mx-auto w-full max-w-sm">
            <Card.Header>
                <Card.Title class="text-2xl">Verify Your Credentials</Card.Title>
                <Card.Description>Enter your given credentials below to verify your ID before signing up.</Card.Description>
            </Card.Header>
            <Card.Content>
                <div class="flex gap-4 flex-col">
                    <div class="flex gap-2 flex-col">
                        <Label for="domain-{id}">Domain</Label>
                        <Input id="domain-{id}" type="text" placeholder="domain.org" required/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <Label for="domain-id-{id}">Domain ID</Label>
                        <Input id="domain-id-{id}" type="text" placeholder="domain-id" required></Input>
                    </div>
                    <div class="flex gap-2 flex-col">
                        <Label for="password-{id}">Password</Label>
                        <Input id="password-{id}" type="password" placeholder="Enter your given password" required/>
                    </div>
                    <Button type="submit" class="w-full">Verify</Button>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div> -->

<script lang="ts">
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLFormAttributes> = $props();
	const id = $props.id();
</script>

<div class="flex h-screen w-full">
	<div class="w-[55%] border-r border-r-black flex items-center justify-center px-4">
		<p>Here is some text. This should be a placeholder only.</p>
	</div>
	<div class="w-[45%] flex items-center justify-center px-4">
		<form class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
			<div class="flex flex-col items-center gap-2 text-center">
				<h1 class="text-2xl font-bold">Login to your account</h1>
				<p class="text-muted-foreground text-balance text-sm">
					Enter your email below to login to your account
				</p>
			</div>
			<div class="flex flex-col gap-6">
				<div class="flex flex-col gap-3">
					<Label for="email-{id}">Email</Label>
					<Input id="email-{id}" type="email" placeholder="m@example.com" required />
				</div>
				<div class="flex flex-col gap-3">
					<Label for="password-{id}">Password</Label>
					<Input id="password-{id}" type="password" required />
				</div>
				<Button type="submit" class="w-full">Login</Button>
			</div>
		</form>
	</div>
</div>
