import dayJS from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone';

dayJS.extend(utc);
dayJS.extend(timezone);

export function dateFormatter(d: Date) {
  // 使用 +0 UTC 是因為 Astro 讀到日期時會自動轉成 ISO 日期
  // 比如台灣本地時間 2023-08-09 19:52:24 直接變成 2023-08-09T19:52:24.000Z
  // 只好設定時區為 UTC
  return dayJS(d).tz('UTC').format('YYYY-MM-DD HH:mm');
}
