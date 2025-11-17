<script setup lang="ts">
import CharacterForm from "./components/CharacterForm.vue";
import AppShell from "./components/AppShell.vue";

const uiRevamp = import.meta.env.VITE_UI_REVAMP === '1';
</script>

<template>
  <AppShell v-if="uiRevamp" />
  <main v-else class="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-bold">呪術廻戦TRPG キャラクター作成</h1>
      <span class="text-xs opacity-0 select-none">.</span>
    </header>
    <CharacterForm />
  </main>
</template>
