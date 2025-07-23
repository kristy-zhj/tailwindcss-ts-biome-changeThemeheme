export const Numerical = (
  val: null | undefined | string | number,
  bit = 3, //小数位数
  elseReplace = "-", //替换值
  unit?: string, //单位
) => {
  if (val === 0) {
    return 0 + (unit ? unit : "")
  } else if (val) {
    const v = typeof val === "string" ? Number(parseFloat(val)) : val
    const num = 10 ** bit
    const result =
      Math.sign(v as number) > 0 ? Math.round(v * num) / num : -Math.round(Math.abs(v) * num) / num
    return !isNaN(result) ? result.toFixed(bit) + (unit ? unit : "") : elseReplace
  } else {
    return elseReplace
  }
}
