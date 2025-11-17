<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  total: number;
  usedSlotsTotal: number;
  usedSlotsBody: number;
  usedSlotsArts: number;
  slotsTotal: number;
  usedCapTotal: number;
  capTotal: number;
  warn: boolean;
}>();

/* 残量・状態 */
const remainSlotsRaw = computed(() => props.slotsTotal - props.usedSlotsTotal);
const remainCapRaw   = computed(() => props.capTotal   - props.usedCapTotal);
const remainSlots    = computed(() => Math.max(0, remainSlotsRaw.value));
const remainCap      = computed(() => Math.max(0, remainCapRaw.value));

const overSlots   = computed(() => props.usedSlotsTotal > props.slotsTotal);
const overCap     = computed(() => props.usedCapTotal   > props.capTotal);
const equalSlots  = computed(() => props.slotsTotal > 0 && props.usedSlotsTotal === props.slotsTotal);
const equalCap    = computed(() => props.capTotal   > 0 && props.usedCapTotal   === props.capTotal);

const pctSlots = computed(() => Math.min(1, props.slotsTotal ? props.usedSlotsTotal / props.slotsTotal : 0));
const pctCap   = computed(() => Math.min(1, props.capTotal   ? props.usedCapTotal   / props.capTotal   : 0));

function barClass(isOver: boolean, isEqual: boolean) {
  if (isOver)  return "bg-red-500";
  if (isEqual) return "bg-green-500";
  return "bg-blue-500";
}

/* ティッカー方向（残り数の上下） */
const slotsKey = ref(0), capKey = ref(0);
const slotsDir = ref<'down'|'up'>('down');
const capDir   = ref<'down'|'up'>('down');
let prevSlots = remainSlots.value, prevCap = remainCap.value;

watch(remainSlots, v => { slotsDir.value = v < prevSlots ? 'down' : 'up'; prevSlots = v; slotsKey.value++; });
watch(remainCap,   v => { capDir.value   = v < prevCap   ? 'down' : 'up'; prevCap   = v; capKey.value++; });

/* モバイル：スクロールで自動隠し（下スクロール→隠す/ 上→出す） */
const hiddenMobile = ref(false);
let lastY = 0, raf = 0;
function onScroll(){
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(()=>{
    const y = window.scrollY || 0;
    hiddenMobile.value = y > lastY + 6; // 少しだけ下に動いたら隠す
    lastY = y;
  });
}
onMounted(()=> window.addEventListener('scroll', onScroll, { passive:true }));
onBeforeUnmount(()=> window.removeEventListener('scroll', onScroll));

/* モバイル：警告トーストのフェード */
const showWarnToast = ref(false);
watch(()=>props.warn, (w)=>{
  if(!w) return;
  showWarnToast.value = true;
  setTimeout(()=> showWarnToast.value = false, 1400);
});
</script>

<template>
  <!-- デスクトップ/タブレット：従来カード -->
  <aside
    class="hidden sm:block fixed right-4 bottom-4 w-[340px] md:w-[380px] lg:w-[400px]
           bg-zinc-900/95 backdrop-blur rounded-2xl shadow-lg border border-zinc-700/70 p-4
           text-[clamp(11px,0.95vw,14px)]"
    :class="{ 'animate-shake': warn }"
    aria-live="polite"
  >
    <header class="flex items-baseline justify-between mb-3">
      <h3 class="text-sm opacity-80">総合力</h3>
      <div class="text-2xl font-bold tabular-nums">{{ total }}</div>
    </header>

    <!-- 枠 -->
    <section class="space-y-1.5">
      <div class="flex items-center justify-between">
        <span class="text-xs opacity-80">習得枠（使用/合計）</span>
        <span class="tabular-nums text-sm" :class="overSlots ? 'text-red-400' : (equalSlots ? 'text-green-400' : '')">
          {{ usedSlotsTotal }} / {{ slotsTotal }}
        </span>
      </div>
      <div class="h-2 rounded bg-zinc-800 overflow-hidden">
        <div class="h-full transition-all duration-300" :style="{ width: (pctSlots*100)+'%' }" :class="barClass(overSlots, equalSlots)" />
      </div>
      <div class="flex justify-end">
        <span class="pill" :class="[remainSlotsRaw<0?'pill-warn':'', equalSlots&&remainSlots===0&&!overSlots?'pill-success':'']">
          残り
          <span class="numwrap">
            <Transition :name="slotsDir==='down'?'ticker-down':'ticker-up'" mode="out-in">
              <span :key="slotsKey" class="num">{{ remainSlots }}</span>
            </Transition>
          </span>
        </span>
      </div>
    </section>

    <!-- 力 -->
    <section class="space-y-1.5 mt-4">
      <div class="flex items-center justify-between">
        <span class="text-xs opacity-80">習得力（使用/合計）</span>
        <span class="tabular-nums text-sm" :class="overCap ? 'text-red-400' : (equalCap ? 'text-green-400' : '')">
          {{ usedCapTotal }} / {{ capTotal }}
        </span>
      </div>
      <div class="h-2 rounded bg-zinc-800 overflow-hidden">
        <div class="h-full transition-all duration-300" :style="{ width: (pctCap*100)+'%' }" :class="barClass(overCap, equalCap)" />
      </div>
      <div class="flex justify-end">
        <span class="pill" :class="[remainCapRaw<0?'pill-warn':'', equalCap&&remainCap===0&&!overCap?'pill-success':'']">
          残り
          <span class="numwrap">
            <Transition :name="capDir==='down'?'ticker-down':'ticker-up'" mode="out-in">
              <span :key="capKey" class="num">{{ remainCap }}</span>
            </Transition>
          </span>
        </span>
      </div>
    </section>

    <div class="mt-3 text-xs opacity-75">
      体術: <span class="tabular-nums">{{ usedSlotsBody }}</span> 技 /
      呪術: <span class="tabular-nums">{{ usedSlotsArts }}</span> 技
    </div>
  </aside>

  <!-- モバイル：極薄ストリップ（自動隠し）。展開なし -->
  <div class="sm:hidden fixed left-1/2 -translate-x-1/2 bottom-3 z-50 pointer-events-none">
    <!-- 警告トースト -->
    <transition name="toasty">
      <div v-if="showWarnToast"
           class="mx-auto mb-2 w-[88vw] max-w-[360px] rounded-lg px-3 py-1.5 text-[11px]
                  bg-amber-500/15 border border-amber-600 text-amber-300 text-center">
        上限超過があります。値を調整してください。
      </div>
    </transition>

    <div
      class="pointer-events-auto flex items-center gap-2
             bg-zinc-900/95 backdrop-blur border border-zinc-700/70 rounded-full shadow
             px-3 py-1 h-[28px] w-[92vw] max-w-[420px]
             transition-transform duration-200"
      :class="hiddenMobile ? 'translate-y-8 opacity-0' : 'opacity-100'"
      :aria-label="`総合力 ${total}、枠 ${usedSlotsTotal}/${slotsTotal}、力 ${usedCapTotal}/${capTotal}`"
    >
      <!-- 総合力 -->
      <span class="text-[12px] font-semibold">総合</span>
      <span class="text-[16px] font-extrabold tabular-nums">{{ total }}</span>

      <!-- 仕切り -->
      <span class="mx-1 h-4 w-px bg-zinc-700/70"></span>

      <!-- 2本の極薄バー（枠/力） -->
      <div class="flex-1 flex flex-col gap-0.5">
        <div class="h-1 rounded bg-zinc-800 overflow-hidden">
          <div class="h-full transition-all duration-300" :style="{ width:(pctSlots*100)+'%' }" :class="barClass(overSlots, equalSlots)"></div>
        </div>
        <div class="h-1 rounded bg-zinc-800 overflow-hidden">
          <div class="h-full transition-all duration-300" :style="{ width:(pctCap*100)+'%' }" :class="barClass(overCap, equalCap)"></div>
        </div>
      </div>

      <!-- 残りピル（極小） -->
      <span class="pill pill-xs" :class="[remainSlotsRaw<0?'pill-warn':'', equalSlots&&remainSlots===0&&!overSlots?'pill-success':'']">
        枠 <span class="numwrap numwrap-xs">
          <Transition :name="slotsDir==='down'?'ticker-down':'ticker-up'" mode="out-in">
            <span :key="slotsKey" class="num num-xs">{{ remainSlots }}</span>
          </Transition>
        </span>
      </span>
      <span class="pill pill-xs" :class="[remainCapRaw<0?'pill-warn':'', equalCap&&remainCap===0&&!overCap?'pill-success':'']">
        力 <span class="numwrap numwrap-xs">
          <Transition :name="capDir==='down'?'ticker-down':'ticker-up'" mode="out-in">
            <span :key="capKey" class="num num-xs">{{ remainCap }}</span>
          </Transition>
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.tabular-nums { font-variant-numeric: tabular-nums; }

/* ピル */
.pill { @apply inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-sm; }
.pill-xs { @apply text-[11px] px-1.5 py-0; }
.pill-warn { @apply bg-red-900/40 border-red-600 text-red-300; }
.pill-success { @apply bg-green-900/30 border-green-600 text-green-300; animation: ring-pulse 900ms ease-out; }

/* 数字ティッカー（通常/極小） */
.numwrap{ display:inline-block; position:relative; overflow:hidden; height:1.1em; width:2ch; text-align:right; font-variant-numeric: tabular-nums; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace; }
.num{ position:absolute; left:0; right:0; top:0; line-height:1.1em; text-align:right; }
.numwrap-xs{ height:1em; width:1.6ch; }
.num-xs{ line-height:1em; }

/* ティッカー */
.ticker-down-enter-active,.ticker-down-leave-active,.ticker-up-enter-active,.ticker-up-leave-active{ transition: transform 160ms ease, opacity 160ms ease; will-change: transform, opacity; }
.ticker-down-enter-from{ transform: translateY(-100%); opacity:0; } .ticker-down-enter-to{ transform: translateY(0%); opacity:1; }
.ticker-down-leave-from{ transform: translateY(0%); opacity:1; }  .ticker-down-leave-to{ transform: translateY(100%); opacity:0; }
.ticker-up-enter-from{ transform: translateY(100%); opacity:0; }   .ticker-up-enter-to{ transform: translateY(0%); opacity:1; }
.ticker-up-leave-from{ transform: translateY(0%); opacity:1; }    .ticker-up-leave-to{ transform: translateY(-100%); opacity:0; }

/* シェイク（デスクトップ用） */
@keyframes shake-kf { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(3px)} 60%{transform:translateX(-2px)} 80%{transform:translateX(2px)} }
.animate-shake { animation: shake-kf 380ms cubic-bezier(.36,.07,.19,.97); }

/* 緑リング・パルス */
@keyframes ring-pulse { 0%{ box-shadow:0 0 0 0 rgba(34,197,94,.45); transform:scale(.96);} 60%{ box-shadow:0 0 0 8px rgba(34,197,94,0); transform:scale(1.02);} 100%{ box-shadow:0 0 0 0 rgba(34,197,94,0); transform:scale(1);} }

/* トースト */
.toasty-enter-from,.toasty-leave-to{ opacity:0; transform:translateY(4px); }
.toasty-enter-active,.toasty-leave-active{ transition: opacity .18s ease, transform .18s ease; }

/* Revamp scope: enhance glass & elevation */
:global([data-ui="revamp"]) aside{
  background: rgba(12,12,14,.75) !important;
  border: var(--border-strong) !important;
  box-shadow: var(--elev-2) !important;
}
</style>
