export function roundToNearestDecimal(num) {
  const mb = num / 1000000;
  return Math.round(mb * 10) / 10;
}