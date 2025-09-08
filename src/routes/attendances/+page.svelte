<script lang="ts">
  import AttendanceSelector from "$lib/components/attendance-selector.svelte";
  
  let gradeLevels = [7, 8, 9, 10, 11, 12];
  let gradeLevelItems = $derived(
    gradeLevels.map((level) => ({ value: level.toString(), label: `Grade ${level}` }))
  );
  
  let selectedGradeLevel: string | undefined = $state(undefined);
  let selectedSection: string | undefined = $state(undefined);
  
  let sections = {
    7: [
      { value: "15", label: "A" },
      { value: "16", label: "B" },
      { value: "17", label: "C" },
      { value: "18", label: "D" },
    ],
    8: [
      { value: "19", label: "E" },
      { value: "20", label: "F" },
      { value: "21", label: "G" },
      { value: "22", label: "H" },
    ],
    9: [
      { value: "23", label: "I" },
      { value: "24", label: "J" },
      { value: "25", label: "K" },
      { value: "26", label: "L" },
    ],
    10: [
      { value: "27", label: "M" },
      { value: "28", label: "N" },
      { value: "29", label: "O" },
      { value: "30", label: "P" },
    ],
  } as Record<number, { value: string; label: string }[]>;
  let sectionItems = $derived.by(() => {
    const gradeLevel = (!selectedGradeLevel) ? 0 : parseInt(selectedGradeLevel);
    if (!(gradeLevel in sections)) return [];

    return sections[gradeLevel];
  });

  $inspect(selectedGradeLevel, selectedSection);
</script>

<div class="flex flex-col items-center m-4 gap-y-10">
  <div class="text-center">
    <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Attendance Viewer
    </h2>
    <p class="text-muted-foreground">
      Select a date to view or manage attendance records.
    </p>
  </div>
  
  <AttendanceSelector 
    bind:gradeValue={selectedGradeLevel} 
    bind:sectionValue={selectedSection}
    gradeItems={gradeLevelItems}
    sectionItems={sectionItems}
  />
</div>

