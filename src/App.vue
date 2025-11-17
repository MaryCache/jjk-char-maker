<script setup lang="ts">
import CharacterForm from "./components/CharacterForm.vue";
</script>

<template>
  <main class="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl md:text-3xl font-bold engraved-title">呪術廻戦TRPG キャラクター作成</h1>
      <span class="text-xs opacity-0 select-none">.</span>
    </header>
    <CharacterForm />
  </main>
</template>

<style scoped>
.engraved-title {
  color: transparent;
  background: linear-gradient(135deg, #f1e0a0 0%, #d9b56b 50%, #c39a56 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 0 20px rgba(217, 181, 107, 0.3);
  letter-spacing: 0.08em;
}
</style>
