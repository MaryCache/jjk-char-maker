<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import CharacterForm from './components/CharacterForm.vue'
import AppShell from './components/AppShell.vue'

const uiRevamp = import.meta.env.VITE_UI_REVAMP === '1'

onMounted(() => {
  const root = document.documentElement
  if (uiRevamp) root.setAttribute('data-ui', 'revamp')
  else root.removeAttribute('data-ui')
})
onBeforeUnmount(() => {
  document.documentElement.removeAttribute('data-ui')
})
</script>

<template>
  <AppShell v-if="uiRevamp">
    <CharacterForm />
    <div class="revamp-badge">UI Revamp Preview</div>
  </AppShell>

  <div v-else class="p-4">
    <CharacterForm />
  </div>
</template>

<style scoped>
.revamp-badge{
  position: fixed; right: 1rem; top: 1rem; z-index: 50;
  padding: .25rem .5rem; border-radius: .5rem;
  border: 1px solid rgba(245, 158, 11,.5);
  background: rgba(245, 158, 11,.15); color: #fef3c7; font-size: .85rem;
  backdrop-filter: blur(6px);
}
</style>
