const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export const parseByteVo = (num?: number | string, suffix = "") => {
  if (typeof num === "string") {
    num = Number(num);
  }
  if (typeof num !== "number" || isNaN(num)) return ["NaN", ""];
  if (num < 1000) return [`${Math.round(num)}`, "B" + suffix];
  const exp = Math.min(Math.floor(Math.log2(num) / 10), UNITS.length - 1);
  const dat = num / Math.pow(1024, exp);
  const ret = dat >= 1000 ? dat.toFixed(0) : dat.toPrecision(3);
  const unit = UNITS[exp] + suffix;

  return [ret, unit];
};
