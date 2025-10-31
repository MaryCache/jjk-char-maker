export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const percent = (v: number) => `${v}%`;
export const copyBlock = (s: string) => s.replace(/\n{3,}/g, "\n\n").trimEnd();
