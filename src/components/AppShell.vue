<script setup lang="ts">
import CharacterForm from "./CharacterForm.vue";
</script>

<template>
  <div class="min-h-dvh grid grid-rows-[56px_1fr] bg-neutral-950 text-neutral-200">
    <!-- ヘッダー -->
    <header class="px-4 flex items-center border-b border-white/10 bg-neutral-950/80 backdrop-blur-sm">
      <h1 class="font-semibold text-lg">呪術廻戦TRPG キャラ作成</h1>
      <div class="ml-auto text-xs opacity-60">UI Revamp Preview</div>
    </header>

    <!-- メインコンテンツ -->
    <main class="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 p-4 overflow-auto">
      <!-- 左列：フォーム -->
      <section class="card p-4">
        <CharacterForm />
      </section>

      <!-- 右列：HUD/プレビュー -->
      <aside class="sticky top-4 h-fit card p-4">
        <p class="opacity-60 text-sm">ここにHUDやプレビューを載せる</p>
      </aside>
    </main>
  </div>
</template>

<style scoped>
.card {
  border-radius: var(--radius, 16px);
  background-color: rgba(23, 23, 23, 0.6);
  border: var(--border-subtle, 1px solid rgba(255, 255, 255, 0.1));
  box-shadow: var(--elev-1, 0 6px 24px rgba(0, 0, 0, 0.35));
  backdrop-filter: blur(4px);
}
</style>
