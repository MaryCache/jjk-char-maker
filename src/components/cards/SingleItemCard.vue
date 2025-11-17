<script setup lang="ts">
const props = defineProps<{
  enabled: boolean;
  item: { name:string; research:number } | null;
}>();
const emit = defineEmits<{
  (e:'update:enabled', v:boolean):void
  (e:'update:name', v:string):void
  (e:'update:research', v:number):void
}>();
</script>

<template>
  <!-- フラット化 -->
  <section class="flat-card">
    <div class="mb-2">
      <label class="inline-flex items-center gap-2 mr-4">
        <input type="radio" :checked="!props.enabled" @change="emit('update:enabled', false)" />
        <span>なし</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="radio" :checked=" props.enabled" @change="emit('update:enabled', true)" />
        <span>あり</span>
      </label>
    </div>

    <div v-if="props.enabled && props.item" class="flex gap-2">
      <input class="input flex-1" placeholder="『名称』" :value="props.item.name"
             @input="emit('update:name', ($event.target as HTMLInputElement).value)" />
      <input class="input w-24" type="number" min="1" :value="props.item.research"
             @input="emit('update:research', Number(($event.target as HTMLInputElement).value))" />
    </div>

    <div v-else-if="props.enabled" class="text-amber-400 text-sm">
      ⚠ データ不整合（読み込み中...）
    </div>

    <div v-else style="color: var(--text-dim);">『なし』</div>
  </section>
</template>

<style scoped>
.flat-card { @apply p-0 bg-transparent border-none shadow-none; }
.input { @apply input-wafu; }
</style>
