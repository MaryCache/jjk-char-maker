export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // フォールバック: 古いブラウザ向け
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const success = document.execCommand("copy");
      document.body.removeChild(ta);
      return success;
    } catch (fallbackError) {
      console.error("クリップボードへのコピーに失敗:", error, fallbackError);
      return false;
    }
  }
}
