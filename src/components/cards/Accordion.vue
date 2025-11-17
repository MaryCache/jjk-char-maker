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
.acc-root{ border-radius: var(--radius); border: var(--border-subtle); background: var(--panel); }
.acc-head{
  width:100%; display:flex; align-items:center; justify-content:space-between;
  padding:12px 14px; border-bottom: var(--border-subtle);
  background: rgba(34,34,40,.45);
  border-radius: var(--radius) var(--radius) 0 0;
}
.acc-title{ font-weight:700; letter-spacing:.04em; opacity:.92; }
.acc-icon{ transition: transform .18s ease; }
.acc-icon.rot{ transform: rotate(180deg); }
.acc-body{ padding: 12px 14px; }

/* 開閉アニメ */
.acc-enter-from, .acc-leave-to { opacity:0; max-height:0; }
.acc-enter-active, .acc-leave-active {
  transition: opacity .18s ease, max-height .18s ease;
}
</style>
