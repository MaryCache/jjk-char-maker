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
.acc-root{
  border-radius: var(--radius);
  border: var(--border-subtle);
  background: var(--panel);
  overflow: clip;
}

/* ヘッダは面色そのまま。物理の下線はナシ、疑似要素で繊細ライン */
.acc-head{
  width:100%; display:flex; align-items:center; justify-content:space-between;
  padding:12px 14px;
  background: transparent;            /* ← ボディと同じ色 */
  position: relative;
  box-shadow: inset 0 -10px 10px -12px rgba(0,0,0,.35); /* ほんのり段差 */
}

/* 和風テーマ時は金筋、通常は薄いグレーのグラデ仕切り */
.acc-head::after{
  content:""; position:absolute; left:10px; right:10px; bottom:0; height:1px;
  background: linear-gradient(90deg,
    transparent,
    color-mix(in oklab, #d4b26a 35%, rgba(255,255,255,.28)) 35%,
    transparent);
  opacity:.7;
}
:root:not([data-theme="wa"]) .acc-head::after{
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
}

.acc-title{ font-weight:700; letter-spacing:.04em; opacity:.92; }
.acc-icon{ transition: transform .18s ease; }
.acc-icon.rot{ transform: rotate(180deg); }

.acc-body{ padding: 12px 14px; }

/* 開閉アニメ（高さ＋透明度） */
.acc-enter-from, .acc-leave-to { opacity:0; max-height:0; }
.acc-enter-active, .acc-leave-active { transition: opacity .18s ease, max-height .18s ease; }
</style>
