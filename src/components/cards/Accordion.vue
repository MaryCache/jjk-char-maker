<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(defineProps<{
  title: string;
  defaultOpen?: boolean;
}>(),{ defaultOpen: false });

const open = ref(!!props.defaultOpen);

// props.defaultOpen の変化を監視（immediate 不要）
watch(() => props.defaultOpen, (newVal) => {
  open.value = !!newVal;
});
</script>

<template>
  <details :open="open" class="group card-wafu">
    <summary
      class="list-none select-none cursor-pointer px-4 py-3 rounded-2xl
             flex items-center justify-between gap-3
             hover:bg-zinc-800/20 transition-colors"
      style="border-radius: inherit;"
      tabindex="0"
      @click.prevent="open = !open"
      @keydown.enter.prevent="open = !open"
      @keydown.space.prevent="open = !open"
    >
      <h2 class="text-lg font-bold">{{ title }}</h2>
      <span
        class="inline-flex h-6 w-6 items-center justify-center rounded-md border transition-transform"
        :class="{ 'rotate-90': open }"
        style="border-color: var(--gold-soft); color: var(--gold);"
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
