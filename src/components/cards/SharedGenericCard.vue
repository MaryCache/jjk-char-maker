<script setup lang="ts">
const props = defineProps<{
  baseSlots: number;
  baseCapacity: number;
  slotsAdjust: number;
  capacityAdjust: number;
}>();
const emit = defineEmits<{
  (e:'update:slotsAdjust', v:number):void
  (e:'update:capacityAdjust', v:number):void
}>();
</script>

<template>
  <section class="flat-card">
    <!-- 1段目：基準 -->
    <div class="grid grid-cols-2 gap-3 mb-3">
      <label class="field">
        <span>習得枠（基準）</span>
        <input class="input input-fixed" type="number" :value="props.baseSlots" disabled />
      </label>
      <label class="field">
        <span>習得力（基準）</span>
        <input class="input input-fixed" type="number" :value="props.baseCapacity" disabled />
      </label>
    </div>
    <!-- 2段目：補正 -->
    <div class="grid grid-cols-2 gap-3">
      <label class="field">
        <span>習得枠 補正（±）</span>
        <input class="input" type="number" :value="props.slotsAdjust"
               @input="emit('update:slotsAdjust', Number(($event.target as HTMLInputElement).value))" />
      </label>
      <label class="field">
        <span>習得力 補正（±）</span>
        <input class="input" type="number" :value="props.capacityAdjust"
               @input="emit('update:capacityAdjust', Number(($event.target as HTMLInputElement).value))" />
      </label>
    </div>
  </section>
</template>

<style scoped>
.flat-card { @apply p-0 bg-transparent border-none shadow-none; }
.field { @apply flex flex-col gap-1; }
.input { @apply px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500; }
.input-fixed { @apply bg-zinc-950 border-zinc-800 text-zinc-500 italic; }
</style>
