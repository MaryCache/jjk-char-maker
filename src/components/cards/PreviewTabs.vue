<script setup lang="ts">
import { ref, watch } from "vue";
import { copyToClipboard } from "../../utils/copy";

const props = defineProps<{
  tabs: { id: string; label: string; text: string }[];
}>();
const emit = defineEmits<{ (e:"copy", id:string):void }>();

const current = ref(props.tabs[0]?.id ?? "t1");
watch(() => props.tabs, (v) => {
  if (!v.find(t => t.id === current.value)) current.value = v[0]?.id ?? "t1";
});

async function onCopy(txt: string, id: string) {
  await copyToClipboard(txt);
  emit("copy", id);
}
</script>

<template>
  <section class="card-wafu p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex gap-2">
        <button
          v-for="t in tabs" :key="t.id"
          class="tab-btn"
          :class="{ active: current===t.id }"
          @click="current=t.id"
        >{{ t.label }}</button>
      </div>
      <button
        class="btn-wafu"
        @click="onCopy(tabs.find(x=>x.id===current)?.text ?? '', current)"
      >コピー</button>
    </div>

    <pre class="preview">{{ tabs.find(x=>x.id===current)?.text ?? '' }}</pre>
  </section>
</template>

<style scoped>
.tab-btn {
  @apply px-3 py-1 rounded-md text-sm border transition-colors;
  border-color: var(--line);
  background: rgba(18,20,26,0.6);
  color: var(--text);
}
.tab-btn:hover {
  background: rgba(30,34,45,0.8);
}
.tab-btn.active {
  background: linear-gradient(135deg, rgba(55,60,78,0.9), rgba(32,36,50,0.9));
  border-color: var(--gold-soft);
  color: var(--gold);
}
.preview {
  @apply whitespace-pre-wrap overflow-auto rounded-xl p-4;
  min-height: 320px;
  background: rgba(13,16,22,0.96);
  border: 1px solid var(--line-soft);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-hi);
}
</style>
