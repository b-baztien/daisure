import type { DateLike } from "@vueuse/core";

export default function (
  date: globalThis.MaybeRefOrGetter<DateLike>,
  formatStr?: MaybeRefOrGetter<string>,
) {
  return useDateFormat(date, formatStr, {
    locales: "th-TH",
  });
}
