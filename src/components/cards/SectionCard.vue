<script setup lang="ts">
import { TransitionGroup } from "vue";

/* 親から受け取るデータ（テンプレ内のみ参照） */
defineProps<{
  items: { name: string; research: number }[];
  usedSlots: number;
  usedCap: number;
  slotsTotal: number;
  capTotal: number;
  baseSlots: number;
  baseCap: number;
}>();

const emit = defineEmits<{
  (e:'add'):void
  (e:'remove', idx:number):void
  (e:'update:name', idx:number, v:string):void
  (e:'update:research', idx:number, v:number):void
}>();
</script>

<template>
  <section class="flat-card">
    <div class="flex items-center justify-between mb-3">
      <div class="grid grid-cols-2 gap-3 items-end">
        <div class="field">
          <span>習得枠（使用/合計）</span>
          <div class="badge">{{ usedSlots }} / {{ slotsTotal }}</div>
        </div>
        <div class="field">
          <span>習得力（使用/合計）</span>
          <div class="badge">{{ usedCap }} / {{ capTotal }}</div>
        </div>
      </div>
      <button class="btn" @click="$emit('add')">＋</button>
    </div>

    <!-- :key は「非列挙UID(__k)」があればそれを使う -->
    <TransitionGroup name="skill" tag="div" class="space-y-2">
      <div v-for="(it,i) in items" :key="(it as any).__k ?? i" class="flex gap-2">
        <input class="input flex-1" placeholder="名前" :value="it.name"
               @input="$emit('update:name', i, ($event.target as HTMLInputElement).value)" />
        <input class="input w-24" type="number" min="1" :value="it.research"
               @input="$emit('update:research', i, Number(($event.target as HTMLInputElement).value))" />
        <button class="btn" @click="$emit('remove', i)">削除</button>
      </div>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.flat-card { @apply p-0 bg-transparent border-none shadow-none; }
.field { @apply flex flex-col gap-1; }
.input { @apply px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500; }
.btn { @apply px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm; }
.badge { @apply inline-flex items-center px-2 py-1 rounded bg-zinc-800 border border-zinc-700; }

.skill-enter-from, .skill-leave-to { opacity:0; transform: translateY(-6px); }
.skill-enter-active, .skill-leave-active { transition: opacity .18s ease, transform .18s ease; }
.skill-move { transition: transform .18s ease; }
</style>
