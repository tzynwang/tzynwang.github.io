export function dateFormatter(d: Date) {
  return d.toLocaleString(
    "sv-SE", // Swedish (Sweden) for YYYY-MM-DD
    {
      hour12: false,
      timeZone: "UTC", // 因為 `2023-08-09 19:52:24` 讀進來會邊成 `2023-08-09T19:52:24.000Z` 故指定時區為 UTC 補回時差
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}
