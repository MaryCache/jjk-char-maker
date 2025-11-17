<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  tabs: { id: string; label: string; text: string }[];
}>();
const emit = defineEmits<{ (e:"copy", id:string):void }>();

const current = ref(props.tabs[0]?.id ?? "t1");
watch(() => props.tabs, (v) => {
  if (!v.find(t => t.id === current.value)) current.value = v[0]?.id ?? "t1";
});

function onCopy(txt: string, id: string) {
  navigator.clipboard.writeText(txt).then(() => emit("copy", id));
}
</script>

<template>
  <section class="card">
    <div class="flex items-center justify-between mb-2">
      <div class="flex gap-2">
        <button
          v-for="t in tabs" :key="t.id"
          class="px-3 py-1 rounded-md text-sm border"
          :class="current===t.id ? 'bg-zinc-700 border-zinc-600' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'"
          @click="current=t.id"
        >{{ t.label }}</button>
      </div>
      <button
        class="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm"
        @click="onCopy(tabs.find(x=>x.id===current)?.text ?? '', current)"
      >コピー</button>
    </div>

    <!-- ここで『```』を付けない。textをそのまま表示 -->
    <pre class="whitespace-pre-wrap bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 overflow-auto min-h-[320px]">
{{ tabs.find(x=>x.id===current)?.text ?? '' }}
    </pre>
  </section>
</template>

<style scoped>
.card { @apply bg-zinc-900 rounded-2xl p-4 shadow; }

/* Revamp tabs enhancement */
:global([data-ui="revamp"]) .tabs{
  display:flex; gap:6px; padding:6px; border-radius: var(--radius);
  border: var(--border-subtle); background: rgba(16,16,20,.45);
}
:global([data-ui="revamp"]) .tab{
  padding: 6px 10px; border-radius: 10px; border: var(--border-subtle);
  background: rgba(30,30,36,.45); cursor:pointer; user-select:none;
  transition: background-color .12s ease, box-shadow .12s ease;
}
:global([data-ui="revamp"]) .tab:hover{ box-shadow: var(--elev-1); }
:global([data-ui="revamp"]) .tab[aria-selected="true"]{
  background: rgba(40,40,48,.65);
  box-shadow: var(--elev-1);
  outline: none;
}
:global([data-ui="revamp"]) .panel{ margin-top:10px; border-radius: var(--radius); border: var(--border-subtle); background: rgba(12,12,14,.6); }
</style>
