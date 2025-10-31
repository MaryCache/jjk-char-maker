<script setup lang="ts">
import { ref, watchEffect } from "vue";

const props = withDefaults(defineProps<{
  title: string;
  defaultOpen?: boolean;
}>(),{ defaultOpen: false });

const open = ref(!!props.defaultOpen);
watchEffect(() => { /* props変化対応 */ open.value = !!props.defaultOpen && open.value; });
</script>

<template>
  <details :open="open" class="group rounded-2xl bg-zinc-900 border border-zinc-800">
    <summary
      class="list-none select-none cursor-pointer px-4 py-3 rounded-2xl
             flex items-center justify-between gap-3
             hover:bg-zinc-800/60 transition-colors"
      @click.prevent="open = !open"
    >
      <h2 class="text-lg font-bold">{{ title }}</h2>
      <span
        class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-zinc-600
               transition-transform"
        :class="{ 'rotate-90': open }"
        aria-hidden="true"
      >›</span>
    </summary>
    <div class="px-4 pb-4 pt-2">
      <slot />
    </div>
  </details>
</template>

<style scoped>
/* iOS/Safariで<summary>マーカーを消す */
summary::-webkit-details-marker { display: none; }
</style>
