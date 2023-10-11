export const formatNumber = (config: { number: number; isPercent?: true }) => {
  if (config?.number == undefined) return '--';
  const { number, isPercent = true } = config;
  if (number == 0) return 0;
  if (!number) return '--';
  if (isPercent) {
    const haveDecimal = /\./.test((number * 100).toString());
    return haveDecimal ? (Number(number) * 100).toFixed(2) : number * 100;
  }
  const haveDecimal = /\./.test(number.toString());
  return haveDecimal ? Number(number).toFixed(2) : number;
};
