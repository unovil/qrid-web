<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import { IconCircleNumber1, IconCircleNumber2 } from "@tabler/icons-svelte";
  
  let { gradeItems = [], sectionItems = [], gradeValue = $bindable(), sectionValue = $bindable() }: { 
    gradeItems?: Array<{value: string; label: string}>; 
    sectionItems?: Array<{value: string; label: string}>;
    gradeValue?: string;
    sectionValue?: string;
  } = $props();
  
  const triggerContentGrade = $derived(
    gradeItems.find((f) => f.value === gradeValue)?.label ?? "Select a grade level"
  );
  
  const triggerContentSection = $derived(
    sectionItems.find((f) => f.value === sectionValue)?.label ?? "Select a section"
  );
</script>

<div class="flex flex-row gap-6">
  <div class="flex flex-row gap-3">
    <IconCircleNumber1 class="mb-auto mt-auto"/>

    <Select.Root type="single" name="gradeLevel" bind:value={gradeValue} onValueChange={() => sectionValue = ""}>
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
    <IconCircleNumber2 class="mb-auto mt-auto"/>

    <Select.Root type="single" name="section" bind:value={sectionValue} disabled={!gradeValue}>
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