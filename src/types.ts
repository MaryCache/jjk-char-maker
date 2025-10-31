export type Rank = "四" | "三" | "二" | "一" | "特";
export type Sex = "男" | "女" | "その他";

export interface LearnedItem {
  name: string;
  research: number; // 探究の値（1以上）
}

export interface GenericGroup {
  slotsMax: number;      // セクションの基準枠（最大参照）
  slotsUsed: number;     // セクションで使用している枠（= items.length）
  capacity: number;      // セクションの表示用（基準値）
  capacityBase: number;  // セクションの基準（最大参照）
  items: LearnedItem[];  // 技リスト
}

export interface HumanStats {
  life: number;
  str: number;
  agi: number;
  int: number;
  sense: number;
}

export interface JujutsuStats {
  pool: number;       // 呪力量（実値）
  efficiency: number; // %
  maxOutput: number;
}

export interface CharacterSheet {
  name: string;
  ruby?: string;
  sex: Sex;
  age: number;
  rank: Rank;
  total: number; // 表示用（自動算出を受け取る想定）
  bio: string;

  human: HumanStats;
  jujutsu: JujutsuStats;

  // 生得術式/呪力特性（0 or 1）
  innate: LearnedItem[];
  traits: LearnedItem[];

  // 共有プール（汎用）— 基準 + 共有補正
  generic: {
    slots: number;          // 共有：汎用枠（基準）
    capacity: number;       // 共有：汎用習得力（基準）
    slotsAdjust: number;    // 共有：枠 補正（±） → y に加算
    capacityAdjust: number; // 共有：習得力 補正（±） → y に加算
  };

  // セクション（体術/呪術）
  body: GenericGroup;
  arts: GenericGroup;
}
