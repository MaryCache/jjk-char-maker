<script setup lang="ts">
</script>

<template>
  <div class="app-shell min-h-screen">
    <!-- Header -->
    <header class="app-header">
      <h1 class="app-title">呪術廻戦TRPG キャラクター作成</h1>
    </header>

    <!-- Main 3 columns: [content] [preview] [spacer for HUD] -->
    <main class="app-main">
      <section class="app-content">
        <slot />
      </section>
      <aside class="app-preview">
        <!-- 右側は現状プレビュー領域の背景器（必要なら今後差し替え） -->
      </aside>
      <aside class="app-hud-spacer">
        <!-- 右下フローティングHUD用の空き（重なりを避けるための余白） -->
      </aside>
    </main>
  </div>
</template>

<style scoped>
.app-shell{
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  padding: 16px;
}

.app-header{
  border-radius: var(--radius);
  border: var(--border-subtle);
  box-shadow: var(--elev-1);
  background: rgba(24,24,27,.6);
  backdrop-filter: blur(8px);
  padding: 10px 14px;
}

.app-title{
  font-size: 1rem;
  letter-spacing: .02em;
  opacity: .92;
}

.app-main{
  display: grid;
  grid-template-columns: minmax(780px, 1fr) minmax(360px, 520px) 280px;
  gap: 16px;
}

/* 左のフォーム領域 */
.app-content{
  border-radius: var(--radius);
  border: var(--border-subtle);
  box-shadow: var(--elev-1);
  background: rgba(24,24,27,.55);
  backdrop-filter: blur(8px);
  padding: 16px;
}

/* 右のプレビューの器（将来用。今は背景で質感差だけ出す） */
.app-preview{
  border-radius: var(--radius);
  border: var(--border-subtle);
  box-shadow: var(--elev-1);
  background: rgba(12,12,14,.55);
}

/* HUD の重なりを避けるためのスペーサ（中身なし） */
.app-hud-spacer{
  border-radius: var(--radius);
  border: var(--border-subtle);
  background: rgba(24,24,27,.2);
  box-shadow: var(--elev-0);
  min-height: 120px;
}
</style>
