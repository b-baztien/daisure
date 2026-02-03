export default function (
  number: number | string,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  },
) {
  return Number(number).toLocaleString("th-TH", options);
}
