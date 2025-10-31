<script setup lang="ts">
import { copyToClipboard } from "../utils/copy";
defineProps<{ title: string; text: string }>();
const onCopy = async (t: string) => { await copyToClipboard(t); alert("コピーしました"); };
</script>

<template>
  <div class="bg-zinc-900 rounded-2xl p-4 shadow">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <button class="px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm" @click="onCopy(text)">コピー</button>
    </div>
    <pre class="whitespace-pre-wrap text-sm leading-relaxed">{{ text }}</pre>
  </div>
</template>
