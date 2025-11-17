<script setup lang="ts">
import { reactive, computed, onMounted, watch } from "vue";
import type { CharacterSheet, LearnedItem, Rank, Sex } from "../types";
import {
  poolFromAlloc, halfRoundUp,
  buildText1, buildText2, buildText3,
} from "../lib/rules";

import SharedHud from "./cards/SharedHud.vue";
import SharedGenericCard from "./cards/SharedGenericCard.vue";
import SectionCard from "./cards/SectionCard.vue";
import SingleItemCard from "./cards/SingleItemCard.vue";
import PreviewTabs from "./cards/PreviewTabs.vue";
import Accordion from "./cards/Accordion.vue";

/* 定数 */
const ranks: Rank[] = ["四","三","二","一","特"];
const sexes: Sex[]  = ["男","女","その他"];
const FIXED_ART_NAME = "呪力操作";
const LS_KEY = "jjk-char-maker:v1";

/* 非列挙UID（JSONに混ざらない） */
let uidCounter = 1;
function ensureUid<T extends object>(it: T): T {
  const anyIt = it as any;
  if (anyIt && typeof anyIt === "object" && !Object.prototype.hasOwnProperty.call(anyIt, "__k")) {
    Object.defineProperty(anyIt, "__k", { value: uidCounter++, enumerable: false, writable: false });
  }
  return it;
}

/* 状態 */
const state = reactive({
  poolAlloc: 4,
  hasInnate: false,
  hasTrait: false,
  sheet: {
    name: "", ruby: "", sex: "男" as Sex, age: 0, rank: "四" as Rank, total: 28, bio: "",
    human: { life: 4, str: 4, agi: 4, int: 4, sense: 4 },
    jujutsu: { pool: poolFromAlloc(4), efficiency: 100, maxOutput: 4 },
    innate: [] as LearnedItem[], traits: [] as LearnedItem[],
    generic: { slots: 2, capacity: 4, slotsAdjust: 0, capacityAdjust: 0 },
    body: { slotsMax: 2, slotsUsed: 0, capacity: 2, capacityBase: 2, items: [] as LearnedItem[] },
    arts: { slotsMax: 2, slotsUsed: 0, capacity: 2, capacityBase: 2,
            items: [{ name: FIXED_ART_NAME, research: 1 }] as LearnedItem[] },
  } as CharacterSheet,
});

/* 基準 */
function baseByMax(i:number,s:number){ return halfRoundUp(Math.max(i,s)); }
function genericCapacity(i:number,s:number){ return baseByMax(i,s); }

const poolPreview   = computed(()=> poolFromAlloc(state.poolAlloc));
const totalComputed = computed(()=> state.sheet.human.life + state.sheet.human.str + state.sheet.human.agi +
                                  state.sheet.human.int + state.sheet.human.sense + state.poolAlloc +
                                  state.sheet.jujutsu.maxOutput);

/* 固定技の担保 */
function ensureFixedArt(){
  const exists = state.sheet.arts.items.some(i=>i.name===FIXED_ART_NAME);
  if(!exists) state.sheet.arts.items.unshift({ name: FIXED_ART_NAME, research: 1 });
}

/* 使用量 */
const usedSlotsBody  = computed(()=> state.sheet.body.items.length);
const artsUserItems  = computed(()=> state.sheet.arts.items.filter(i=> i.name!== FIXED_ART_NAME));
const usedSlotsArts  = computed(()=> artsUserItems.value.length);
const usedCapBody    = computed(()=> state.sheet.body.items.reduce((s,i)=> s+Math.max(0,(+i.research||0)-1),0));
const usedCapArts    = computed(()=> artsUserItems.value.reduce((s,i)=> s+Math.max(0,(+i.research||0)-1),0));
const usedSlotsTotal = computed(()=> usedSlotsBody.value + usedSlotsArts.value);
const usedCapTotal   = computed(()=> usedCapBody.value + usedCapArts.value);

const slotsTotal = computed(()=> state.sheet.generic.slots + state.sheet.generic.slotsAdjust);
const capTotal   = computed(()=> state.sheet.generic.capacity + state.sheet.generic.capacityAdjust);
const overSlots  = computed(()=> usedSlotsTotal.value > slotsTotal.value);
const overCap    = computed(()=> usedCapTotal.value   > capTotal.value);

/* 派生同期 */
function syncDerived(){
  state.sheet.jujutsu.pool = poolFromAlloc(state.poolAlloc);

  const b = baseByMax(state.sheet.human.int, state.sheet.human.sense);
  const c = genericCapacity(state.sheet.human.int, state.sheet.human.sense);

  state.sheet.generic.slots    = b;
  state.sheet.generic.capacity = c;

  state.sheet.body.slotsMax     = b;
  state.sheet.body.capacityBase = c;
  state.sheet.body.capacity     = c;

  state.sheet.arts.slotsMax     = b;
  state.sheet.arts.capacityBase = c;
  state.sheet.arts.capacity     = c;

  ensureFixedArt();

  // 1件制限（必ず0か1に正規化）
  if(!state.hasInnate) state.sheet.innate = [];
  else if(state.sheet.innate.length===0) state.sheet.innate=[{name:"",research:1}];
  else state.sheet.innate=[state.sheet.innate[0]!];

  if(!state.hasTrait) state.sheet.traits = [];
  else if(state.sheet.traits.length===0) state.sheet.traits=[{name:"",research:1}];
  else state.sheet.traits=[state.sheet.traits[0]!];
}
syncDerived();

/* CRUD（UID付与） */
function addBodyItem(){ state.sheet.body.items.push(ensureUid({ name:"", research:1 })); }
function removeBodyItem(i:number){ state.sheet.body.items.splice(i,1); }
function updateBodyName(i:number,v:string){
  const it = state.sheet.body.items[i]; if (it) it.name = v;
}
function updateBodyResearch(i:number,v:number){
  const it = state.sheet.body.items[i]; if (it) it.research = v;
}

function addArtsItem(){ state.sheet.arts.items.push(ensureUid({ name:"", research:1 })); }
function removeArtsItem(iUser:number){ state.sheet.arts.items.splice(iUser+1,1); }
function updateArtsName(iUser:number,v:string){
  const idx = iUser + 1;
  const it = state.sheet.arts.items[idx];
  if (it) it.name = v;
}
function updateArtsResearch(iUser:number,v:number){
  const idx = iUser + 1;
  const it = state.sheet.arts.items[idx];
  if (it) it.research = v;
}

/* テキスト */
const text1 = computed(()=> buildText1({ ...state.sheet, total: totalComputed.value }));
const text2 = computed(()=> buildText2({ ...state.sheet, total: totalComputed.value }));
const text3 = computed(()=> buildText3({ ...state.sheet, total: totalComputed.value }));
const tabs  = computed(()=>([
  { id:"t1", label:"登場人物造形", text:text1.value },
  { id:"t2", label:"状態管理",     text:text2.value },
  { id:"t3", label:"成長管理",     text:text3.value },
]));

/* リセット */
function confirmReset(){ if(window.confirm("全リセットします。よろしいですか？")) resetTotal28(); }
function resetTotal28(){
  state.sheet.name=""; state.sheet.ruby=""; state.sheet.bio="";
  state.sheet.sex="男"; state.sheet.age=0; state.sheet.rank="四";
  state.sheet.human={ life:4,str:4,agi:4,int:4,sense:4 };
  state.poolAlloc=4; state.sheet.jujutsu.efficiency=100; state.sheet.jujutsu.maxOutput=4;
  state.hasInnate=false; state.hasTrait=false; state.sheet.innate=[]; state.sheet.traits=[];
  state.sheet.body.items=[]; state.sheet.arts.items=[{ name: FIXED_ART_NAME, research:1 }];
  state.sheet.generic.slotsAdjust=0; state.sheet.generic.capacityAdjust=0;
  syncDerived(); localStorage.removeItem(LS_KEY);
}

/* 起動時：復元＋既存アイテムへUID付与 */
onMounted(()=> {
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){
      const saved = JSON.parse(raw);
      Object.assign(state.sheet, saved.sheet ?? {});
      state.poolAlloc = saved.poolAlloc ?? state.poolAlloc;
      state.hasInnate = Array.isArray(state.sheet.innate)&&state.sheet.innate.length>0;
      state.hasTrait  = Array.isArray(state.sheet.traits)&&state.sheet.traits.length>0;
      ensureFixedArt();
    }
  }catch{}
  // UIDを後付け（非列挙なので保存には出ない）
  state.sheet.body.items = state.sheet.body.items.map(ensureUid);
  state.sheet.arts.items = state.sheet.arts.items.map(it =>
    it.name === FIXED_ART_NAME ? it : ensureUid(it)
  );
  syncDerived();
});

/* watch：計算は狙い撃ち、保存はdeep+debounce */
watch(() => [state.sheet.human.int, state.sheet.human.sense], syncDerived);
watch(() => state.poolAlloc, () => { state.sheet.jujutsu.pool = poolFromAlloc(state.poolAlloc); });
watch(() => [state.hasInnate, state.hasTrait], syncDerived);

let saveT: number | null = null;
watch(state,(v)=>{
  if (saveT) clearTimeout(saveT);
  saveT = window.setTimeout(()=>{
    try{ localStorage.setItem(LS_KEY, JSON.stringify({ poolAlloc:v.poolAlloc, sheet:v.sheet })); }catch{}
  },120);
},{deep:true});
</script>

<template>
  <div class="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">
    <!-- 左列 -->
    <div class="space-y-4">
      <Accordion title="꧁——人物情報——꧂" :defaultOpen="true">
        <div class="relative">
          <button class="btn absolute right-0 -top-1" @click="confirmReset">全リセット</button>
          <div class="grid grid-cols-2 gap-3">
            <label class="field"><span>名前</span><input v-model="state.sheet.name" class="input" /></label>
            <label class="field"><span>よみ（任意）</span><input v-model="state.sheet.ruby" class="input" /></label>
            <label class="field"><span>性別</span>
              <select v-model="state.sheet.sex" class="input">
                <option v-for="s in sexes" :key="s" :value="s">{{ s }}</option>
              </select>
            </label>
            <label class="field"><span>年齢</span><input type="number" v-model.number="state.sheet.age" class="input" /></label>
            <label class="field"><span>階級</span>
              <select v-model="state.sheet.rank" class="input">
                <option v-for="r in ranks" :key="r" :value="r">{{ r }}級</option>
              </select>
            </label>
          </div>
          <label class="flex flex-col gap-1 mt-3">
            <span>人物紹介</span>
            <textarea v-model="state.sheet.bio" rows="4" class="input"></textarea>
          </label>
        </div>
      </Accordion>

      <Accordion title="総合力" :defaultOpen="true">
        <div class="text-xl font-bold">総合力：<span class="tabular-nums">{{ totalComputed }}</span></div>
      </Accordion>

      <Accordion title="꧁——人間強度——꧂" :defaultOpen="true">
        <div class="grid grid-cols-5 gap-3">
          <label class="field"><span>生命</span><input type="number" min="1" v-model.number="state.sheet.human.life" class="input" @change="syncDerived" /></label>
          <label class="field"><span>膂力</span><input type="number" min="1" v-model.number="state.sheet.human.str" class="input" @change="syncDerived" /></label>
          <label class="field"><span>敏捷</span><input type="number" min="1" v-model.number="state.sheet.human.agi" class="input" @change="syncDerived" /></label>
          <label class="field"><span>知性</span><input type="number" min="1" v-model.number="state.sheet.human.int" class="input" @change="syncDerived" /></label>
          <label class="field"><span>六感</span><input type="number" min="1" v-model.number="state.sheet.human.sense" class="input" @change="syncDerived" /></label>
        </div>
      </Accordion>

      <Accordion title="꧁——呪力強度——꧂" :defaultOpen="true">
        <div class="grid grid-cols-3 gap-3">
          <label class="field">
            <span>呪力量</span>
            <input type="number" min="1" v-model.number="state.poolAlloc" class="input" @change="syncDerived" />
            <p class="hint">呪力量実値：{{ poolPreview }}</p>
          </label>
          <label class="field"><span>呪力効率（%）</span><input type="number" min="50" max="100" v-model.number="state.sheet.jujutsu.efficiency" class="input" /></label>
          <label class="field"><span>最大呪力出力</span><input type="number" min="1" v-model.number="state.sheet.jujutsu.maxOutput" class="input" /></label>
        </div>
      </Accordion>

      <!-- 生得術式 -->
      <Accordion title="꧁——生得術式——꧂" :defaultOpen="true">
        <Transition name="skill">
          <div class="w-full" :key="'innate-static'">
            <SingleItemCard
              :enabled="state.hasInnate"
              :item="state.sheet.innate[0] ?? null"
              @update:enabled="(v:boolean)=>{ state.hasInnate=v; syncDerived(); }"
              @update:name   ="(v:string)=>{
                if(!state.sheet.innate.length) state.sheet.innate=[{name:v,research:1}];
                else state.sheet.innate[0]!.name=v;
              }"
              @update:research="(v:number)=>{
                if(!state.sheet.innate.length) state.sheet.innate=[{name:'',research:v}];
                else state.sheet.innate[0]!.research=v;
              }"
            />
          </div>
        </Transition>
      </Accordion>

      <!-- 呪力特性 -->
      <Accordion title="꧁——呪力特性——꧂" :defaultOpen="true">
        <Transition name="skill">
          <div class="w-full" :key="'trait-static'">
            <SingleItemCard
              :enabled="state.hasTrait"
              :item="state.sheet.traits[0] ?? null"
              @update:enabled="(v:boolean)=>{ state.hasTrait=v; syncDerived(); }"
              @update:name   ="(v:string)=>{
                if(!state.sheet.traits.length) state.sheet.traits=[{name:v,research:1}];
                else state.sheet.traits[0]!.name=v;
              }"
              @update:research="(v:number)=>{
                if(!state.sheet.traits.length) state.sheet.traits=[{name:'',research:v}];
                else state.sheet.traits[0]!.research=v;
              }"
            />
          </div>
        </Transition>
      </Accordion>

      <!-- 共有（汎用） -->
      <Accordion title="꧁——汎用（共有）——꧂" :defaultOpen="true">
        <SharedGenericCard
          :base-slots="state.sheet.generic.slots"
          :base-capacity="state.sheet.generic.capacity"
          :slots-adjust="state.sheet.generic.slotsAdjust"
          :capacity-adjust="state.sheet.generic.capacityAdjust"
          @update:slotsAdjust="v=>{ state.sheet.generic.slotsAdjust=v; }"
          @update:capacityAdjust="v=>{ state.sheet.generic.capacityAdjust=v; }"
        />
      </Accordion>

      <!-- 汎用体術 -->
      <Accordion title="꧁——汎用体術——꧂" :defaultOpen="true">
        <SectionCard
          :items="state.sheet.body.items"
          :used-slots="usedSlotsBody"
          :used-cap="usedCapBody"
          :slots-total="slotsTotal"
          :cap-total="capTotal"
          :base-slots="state.sheet.body.slotsMax"
          :base-cap="state.sheet.body.capacityBase"
          @add="addBodyItem"
          @remove="removeBodyItem"
          @update:research="updateBodyResearch"
          @update:name="updateBodyName"
        />
      </Accordion>

      <!-- 汎用呪術 -->
      <Accordion title="꧁——汎用呪術——꧂" :defaultOpen="true">
        <section class="flat-card">
          <div class="flex items-center justify-between mb-3">
            <div class="grid grid-cols-2 gap-3 items-end">
              <div class="field">
                <span>習得枠（使用/合計）</span>
                <div class="badge">{{ usedSlotsArts }} / {{ slotsTotal }}</div>
              </div>
              <div class="field">
                <span>習得力（使用/合計）</span>
                <div class="badge">{{ usedCapArts }} / {{ capTotal }}</div>
              </div>
            </div>
            <button class="btn" @click="addArtsItem">＋</button>
          </div>

          <!-- 固定：呪力操作 -->
          <div class="flex gap-2 opacity-80">
            <input disabled :value="FIXED_ART_NAME" class="input input-fixed flex-1" />
            <input disabled type="number" :value="1" class="input input-fixed w-24" />
            <button disabled class="btn opacity-50 cursor-not-allowed">固定</button>
          </div>

          <!-- 追加分：キーは非列挙UID -->
          <TransitionGroup name="skill" tag="div" class="space-y-2 mt-2">
            <div v-for="(it, i) in artsUserItems" :key="(it as any).__k ?? i" class="flex gap-2">
              <input class="input flex-1" placeholder="名前" :value="it.name"
                     @input="updateArtsName(i, ($event.target as HTMLInputElement).value)" />
              <input class="input w-24" type="number" min="1" :value="it.research"
                     @input="updateArtsResearch(i, Number(($event.target as HTMLInputElement).value))" />
              <button class="btn" @click="removeArtsItem(i)">削除</button>
            </div>
          </TransitionGroup>
        </section>
      </Accordion>
    </div>

    <!-- 右列：テキスト -->
    <div class="space-y-4">
      <PreviewTabs :tabs="tabs" @copy="() => {}" />
    </div>

    <!-- HUD -->
    <SharedHud
      :total="totalComputed"
      :used-slots-total="usedSlotsTotal"
      :used-slots-body="usedSlotsBody"
      :used-slots-arts="usedSlotsArts"
      :slots-total="slotsTotal"
      :used-cap-total="usedCapTotal"
      :cap-total="capTotal"
      :warn="overSlots || overCap"
    />
  </div>
</template>

<style scoped>
.card { @apply bg-zinc-900 rounded-2xl p-4 shadow; }
.flat-card { @apply bg-transparent p-0 shadow-none; }

.field { @apply flex flex-col gap-1; }
.input { @apply px-3 py-2 rounded border bg-zinc-800 border-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition; }
.input-fixed { @apply bg-zinc-950 border-zinc-800 text-zinc-500 italic cursor-not-allowed; }

.btn { @apply px-3 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-sm; }
.badge { @apply inline-flex items-center px-2 py-1 rounded bg-zinc-800 border border-zinc-700; }
.tabular-nums { font-variant-numeric: tabular-nums; }
.hint { @apply text-xs opacity-70; }

.skill-enter-from, .skill-leave-to { opacity: 0; transform: translateY(-6px); }
.skill-enter-active, .skill-leave-active { transition: opacity .18s ease, transform .18s ease; }
.skill-move { transition: transform .18s ease; }
</style>
