import type { DateLike } from "@vueuse/core";

export default function (
  date: MaybeRefOrGetter<DateLike>,
  formatStr: MaybeRefOrGetter<string> = "DD/MM/YYYY HH:mm:ss",
) {
  return useDateFormat(date, formatStr, {
    locales: "th-TH",
  });
}
