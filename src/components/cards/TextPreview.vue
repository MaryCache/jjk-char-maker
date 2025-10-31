<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  title: string;
  text: string;
}>();

const copying = ref(false);
const copyOk = ref(false);

async function copyToClipboard() {
  const value = props.text ?? "";
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      // フォールバック（古いブラウザ用）
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    copyOk.value = true;
  } catch {
    copyOk.value = false;
  } finally {
    copying.value = false;
    setTimeout(() => (copyOk.value = false), 1400);
  }
}
</script>

<template>
  <section class="bg-zinc-900 rounded-2xl shadow overflow-hidden">
    <header class="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <button
        class="btn"
        :disabled="copying"
        @click="copyToClipboard"
        title="内容をコピー"
      >
        {{ copyOk ? "✓ コピー済み" : "コピー" }}
      </button>
    </header>
    <div class="p-4">
      <pre class="preview" :data-empty="!text || text.length === 0">{{ text || "（出力なし）" }}</pre>
    </div>
  </section>
</template>

<style scoped>
.btn { @apply px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-60 text-sm; }
.preview {
  @apply font-mono text-sm leading-6 whitespace-pre-wrap break-words bg-zinc-950/40 border border-zinc-800 rounded-xl p-4;
}
</style>
