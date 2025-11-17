<script setup lang="ts">
import CharacterForm from "./components/CharacterForm.vue";
import AppShell from "./components/AppShell.vue";

const uiRevamp = import.meta.env.VITE_UI_REVAMP === '1';
</script>

<template>
  <AppShell v-if="uiRevamp">
    <CharacterForm />
    <!-- 目印バナー（消してOK） -->
    <div class="fixed right-4 top-4 z-50 rounded-lg bg-amber-500/20 border border-amber-400 px-3 py-1 text-amber-200 text-sm">
      UI Revamp Preview
    </div>
  </AppShell>

  <div v-else class="p-4">
    <CharacterForm />
  </div>
</template>
