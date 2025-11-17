<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ title: string; defaultOpen?: boolean }>()
const open = ref(!!props.defaultOpen)
</script>

<template>
  <div class="acc-root" :data-open="open">
    <button class="acc-head" @click="open = !open">
      <span class="acc-title">{{ title }}</span>
      <span class="acc-icon" :class="{ 'rot': open }">▾</span>
    </button>

    <transition name="acc" appear>
      <div v-show="open" class="acc-body">
        <slot/>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ここを統一：ヘッダとボディを同じ面色に、線とインセット影で分ける */
.acc-root{
  border-radius: var(--radius);
  border: var(--border-subtle);
  background: var(--panel);
  overflow: clip;
}

/* ヘッダは面色そのまま。薄い下線＋内側シャドウで段差表現 */
.acc-head{
  width:100%; display:flex; align-items:center; justify-content:space-between;
  padding:12px 14px;
  background: transparent;               /* ← ここ重要：ボディと同じ */
  border-bottom: var(--border-subtle);   /* 線で区切る */
  box-shadow: inset 0 -10px 10px -12px rgba(0,0,0,.35);
}
.acc-title{ font-weight:700; letter-spacing:.04em; opacity:.92; }
.acc-icon{ transition: transform .18s ease; }
.acc-icon.rot{ transform: rotate(180deg); }

.acc-body{ padding: 12px 14px; }

/* 開閉アニメ（高さ＋透明度） */
.acc-enter-from, .acc-leave-to { opacity:0; max-height:0; }
.acc-enter-active, .acc-leave-active {
  transition: opacity .18s ease, max-height .18s ease;
}
</style>
