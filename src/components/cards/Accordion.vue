<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{
  title: string;
  defaultOpen?: boolean;
}>(), { defaultOpen: false });

const open = ref(!!props.defaultOpen);
</script>

<template>
  <section class="card-wafu overflow-hidden">
    <!-- ヘッダ -->
    <button class="w-full acc-head px-4 py-3 flex items-center justify-between select-none" @click="open = !open">
      <span class="text-gold">꧁</span>
      <div class="heading-wafu text-sm tracking-wide text-center flex-1">{{ title }}</div>
      <span class="text-gold">꧂</span>
    </button>

    <div class="rule-gold"></div>

    <!-- 本文 -->
    <div v-show="open" class="acc-body px-4 py-4">
      <slot />
    </div>
  </section>
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

/* シンプルな金グラデにして parser の誤検出を避ける */
.acc-head::after{
  content:""; position:absolute; left:10px; right:10px; bottom:0; height:1px;
  background: linear-gradient(90deg, transparent, rgba(211,181,116,.35), transparent);
  opacity:.85;
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
