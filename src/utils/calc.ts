/**
 * 経過時間を文字列の形式に変換
 *
 * @param passedTime 経過時間（秒）
 * @returns hh:mm:ss形式の文字列
 */
export const calcTime = (passedTime: number) => {
  const hours = Math.floor(passedTime / (60 * 60));
  const minutes = Math.floor((passedTime - hours * 60 * 60) / 60);
  const seconds = passedTime - hours * 60 * 60 - minutes * 60;

  const h = hours < 100 ? hours.toString().padStart(2, "0") : hours.toString();
  const m = minutes.toString().padStart(2, "0");
  const s = seconds.toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};
