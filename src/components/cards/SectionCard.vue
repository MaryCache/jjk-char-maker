<script setup lang="ts">
import { computed, TransitionGroup } from "vue";
import type { LearnedItem, LearnedItemWithIndex } from "../../types";

/* テンプレ側だけで参照するので、変数に受けずに型宣言のみ */
const props = defineProps<{
  items: LearnedItem[];
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

// _uid の存在を保証し、元のインデックスも保持
const safeItems = computed(() => 
  props.items.map((it, originalIdx): LearnedItemWithIndex => {
    if (!it._uid) console.warn(`Missing _uid for item at index ${originalIdx}`);
    return {
      ...it,
      _uid: it._uid ?? (1000000 + originalIdx),
      _originalIdx: originalIdx // 元配列のインデックスを保持
    };
  })
);

// 型安全なイベントハンドラー
function handleNameInput(idx: number, event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:name', idx, target.value);
}

function handleResearchInput(idx: number, event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:research', idx, Number(target.value));
}
</script>

<template>
  <!-- フラット化 -->
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

    <TransitionGroup v-if="safeItems.length > 0" name="skill" class="space-y-2">
      <div v-for="it in safeItems" :key="it._uid" class="flex gap-2">
        <input class="input flex-1" placeholder="名前" :value="it.name"
               @input="handleNameInput(it._originalIdx, $event)" />
        <input class="input w-24" type="number" min="1" :value="it.research"
               @input="handleResearchInput(it._originalIdx, $event)" />
        <button class="btn" @click="$emit('remove', it._originalIdx)">削除</button>
      </div>
    </TransitionGroup>

    <div v-else class="text-sm opacity-50 text-center py-4">
      技を追加してください
    </div>
  </section>
</template>

<style scoped>
.flat-card { @apply p-0 bg-transparent border-none shadow-none; }
.field { @apply flex flex-col gap-1; }
.input { @apply input-wafu; }
.btn { @apply btn-wafu text-sm; }
.badge { @apply inline-flex items-center px-2 py-1 rounded border;
  background: var(--panel); border-color: var(--line); }

.skill-enter-from, .skill-leave-to { opacity:0; transform: translateY(-6px); }
.skill-enter-active, .skill-leave-active { transition: opacity .18s ease, transform .18s ease; }
.skill-move { transition: transform .18s ease; }
</style>
