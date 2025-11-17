import type { CharacterSheet, HumanStats, JujutsuStats } from "../types";
import { FIXED_ART_NAME } from "./constants";

/** 1/2を切り上げ（下限1） */
export const halfRoundUp = (v: number) => Math.max(1, Math.ceil(v / 2));

/** 呪力量（実値）= 割り振り値 * 5 */
export const poolFromAlloc = (alloc: number) => Math.max(1, alloc) * 5;

/** 探査プレビュー算出 */
export function explorationScores(h: HumanStats) {
  const zanEiOrVisual = (h.int + h.sense) * 5;
  const chase = h.agi * 10;
  const consider = h.int * 10;
  const intuition = h.sense * 10;
  const conceal = (h.int + h.agi) * 5;
  return { zanEi: zanEiOrVisual, chase, consider, intuition, conceal };
}

/** 成長上限（通常6ステ） */
function capBasic(initial: number) {
  if (initial <= 2) return initial + 4;
  if (initial <= 8) return initial + 6;
  return initial + 8;
}

/** 呪力量の上限（実値） */
function capPool(initial: number) {
  if (initial <= 10) return initial + 60;
  if (initial <= 40) return initial + 80;
  return initial + 100;
}

/** 成長上限まとめ */
export function growthCaps(h: HumanStats, j: JujutsuStats) {
  return {
    life: capBasic(h.life),
    str: capBasic(h.str),
    agi: capBasic(h.agi),
    int: capBasic(h.int),
    sense: capBasic(h.sense),
    pool: capPool(j.pool),
    maxOutput: capBasic(j.maxOutput),
  };
}

/* ──────────────────────────────────────────────────────────
 * ユーティリティ：UIと同じ使用量の算出
 *   - 体術: 使った枠＝items.length
 *           使った習得力＝Σ max(0, research-1)
 *   - 呪術: 『呪力操作』は枠/習得力を消費しない
 * ────────────────────────────────────────────────────────── */

const BRK = "``````"; // セクション区切り（6バッククォート）

function usageFromSheet(c: CharacterSheet) {
  const bodyItems = c.body?.items ?? [];
  const artsAll = c.arts?.items ?? [];
  const artsUser = artsAll.filter(i => i.name !== FIXED_ART_NAME);

  const usedSlotsBody = bodyItems.length;
  const usedCapBody = bodyItems.reduce((s, i) => s + Math.max(0, (Number(i.research) || 0) - 1), 0);

  const usedSlotsArts = artsUser.length;
  const usedCapArts = artsUser.reduce((s, i) => s + Math.max(0, (Number(i.research) || 0) - 1), 0);

  const usedSlotsTotal = usedSlotsBody + usedSlotsArts;

  const slotsTotal =
    (c.generic?.slots ?? 0) + (c.generic?.slotsAdjust ?? 0);
  const capTotal =
    (c.generic?.capacity ?? 0) + (c.generic?.capacityAdjust ?? 0);

  const usedCapTotal = usedCapBody + usedCapArts;

  return {
    bodyItems,
    artsAll,
    artsUser,

    usedSlotsBody,
    usedCapBody,

    usedSlotsArts,
    usedCapArts,

    usedSlotsTotal,
    usedCapTotal,

    slotsTotal,
    capTotal,
  };
}

/** テキスト１：登場人物造形 */
export function buildText1(c: CharacterSheet) {
  const u = usageFromSheet(c);
  const lines: string[] = [];

  lines.push("```");
  // 人物情報
  lines.push("꧁——人物情報——꧂");
  lines.push(`名前：${c.name ?? ""}${c.ruby ? `（${c.ruby}）` : ""}`);
  lines.push(`性別：${c.sex ?? ""}`);
  lines.push(`年齢：${c.age ?? 0}`);
  lines.push(`階級：${c.rank ? `${c.rank}級` : ""}`);
  lines.push(`総合力：${c.total ?? 0}`);
  lines.push("꧁——人物紹介——꧂");
  lines.push((c.bio && c.bio.trim()) ? c.bio.trim() : "（未記入）");
  lines.push(BRK);

  // 人間強度
  lines.push("꧁——人間強度——꧂");
  lines.push(`生命：${c.human.life}`);
  lines.push(`膂力：${c.human.str}`);
  lines.push(`敏捷：${c.human.agi}`);
  lines.push(`知性：${c.human.int}`);
  lines.push(`六感：${c.human.sense}`);
  lines.push(BRK);

  // 呪力強度
  lines.push("꧁——呪力強度——꧂");
  lines.push(`呪力量：${c.jujutsu.pool}`);
  lines.push(`呪力効率：${c.jujutsu.efficiency}%`);
  lines.push(`最大呪力出力：${c.jujutsu.maxOutput}`);
  lines.push(BRK);

  // 生得術式
  lines.push("꧁——生得術式——꧂");
  lines.push(
    c.innate.length
      ? c.innate.map(i => `『${i.name}』【${i.research ?? 1}】`).join("\n")
      : "『なし』"
  );
  lines.push(BRK);

  // 呪力特性
  lines.push("꧁——呪力特性——꧂");
  lines.push(
    c.traits.length
      ? c.traits.map(i => `『${i.name}』【${i.research ?? 1}】`).join("\n")
      : "『なし』"
  );
  lines.push(BRK);

  // 汎用 合算
  lines.push("꧁——汎用——꧂");
  lines.push(`習得枠：${u.usedSlotsTotal}/${u.slotsTotal}`);
  lines.push(`習得力：${u.usedCapTotal}/${u.capTotal}`);

  // 体術 内訳（使用値のみ表示）
  lines.push("꧁——汎用体術——꧂");
  lines.push(`習得枠：${u.usedSlotsBody}`);
  lines.push(`習得力：${u.usedCapBody}`);
  if (u.bodyItems.length) {
    u.bodyItems.forEach(i => lines.push(`『${i.name}』【${i.research ?? 1}】`));
  }

  // 呪術 内訳（固定の呪力操作は表示はするが消費は0）
  lines.push("꧁——汎用呪術——꧂");
  lines.push(`習得枠：${u.usedSlotsArts}`);
  lines.push(`習得力：${u.usedCapArts}`);
  if (u.artsAll.length) {
    u.artsAll.forEach(i => lines.push(`『${i.name}』【${i.research ?? 1}】`));
  }

  lines.push("```");
  return lines.join("\n").trim();
}

/** テキスト２：状態管理 */
export function buildText2(c: CharacterSheet) {
  const e = explorationScores(c.human);
  // 探査値をLv表記に変換（÷10して四捨五入）
  const toLv = (v: number) => Math.round(v / 10);
  
  const lines: string[] = [];
  lines.push("```");
  lines.push(`${c.name ?? ""}${c.ruby ? `（${c.ruby}）` : ""}`);
  lines.push("꧁——強度——꧂");
  lines.push(`生命：${c.human.life}/${c.human.life}`);
  lines.push(`呪力量：${c.jujutsu.pool}/${c.jujutsu.pool}`);
  lines.push(`膂力：${c.human.str}`);
  lines.push(`敏捷：${c.human.agi}`);
  lines.push(`知性：${c.human.int}`);
  lines.push(`六感：${c.human.sense}`);
  lines.push(`呪力効率：${c.jujutsu.efficiency}%`);
  lines.push(`最大呪力出力：${c.jujutsu.maxOutput}`);
  lines.push("꧁——探査——꧂");
  lines.push(`【残穢/目視】Lv.${toLv(e.zanEi)}`);
  lines.push(`【追跡】Lv.${toLv(e.chase)}`);
  lines.push(`【考察】Lv.${toLv(e.consider)}`);
  lines.push(`【直感】Lv.${toLv(e.intuition)}`);
  lines.push(`【隠匿】Lv.${toLv(e.conceal)}`);
  lines.push("꧁——状態——꧂");
  lines.push("『』累積：");
  lines.push("꧁——永続——꧂");
  lines.push("```");
  return lines.join("\n").trim();
}

/** テキスト３：成長管理 */
export function buildText3(c: CharacterSheet) {
  const caps = growthCaps(c.human, c.jujutsu);
  const lines: string[] = [];
  lines.push("```");
  lines.push(`${c.name ?? ""}${c.ruby ? `（${c.ruby}）` : ""}`);
  lines.push("꧁——初期値——꧂");
  lines.push(`総合力：${c.total ?? 0}`);
  lines.push(`生命：${c.human.life}`);
  lines.push(`膂力：${c.human.str}`);
  lines.push(`敏捷：${c.human.agi}`);
  lines.push(`知性：${c.human.int}`);
  lines.push(`六感：${c.human.sense}`);
  lines.push(`呪力量：${c.jujutsu.pool}`);
  lines.push(`最大呪力出力：${c.jujutsu.maxOutput}`);
  lines.push("꧁——成長限界——꧂");
  lines.push(`生命：${caps.life}`);
  lines.push(`膂力：${caps.str}`);
  lines.push(`敏捷：${caps.agi}`);
  lines.push(`知性：${caps.int}`);
  lines.push(`六感：${caps.sense}`);
  lines.push(`呪力量：${caps.pool}`);
  lines.push(`最大呪力出力：${caps.maxOutput}`);
  lines.push("꧁——成長軌跡——꧂");
  lines.push("獲得報酬点：0");
  lines.push("使用報酬点/貢献点：0");
  lines.push("使用総合力：+0");
  lines.push("使用習得力：+0");
  lines.push("使用探求力：+0");
  lines.push("```");
  return lines.join("\n").trim();
}
