---
title: 開發筆記：設定 dayjs timezone
date: 2023-05-13 14:55:02
categories:
  - [JavaScript]
---

## 總結

在本機執行單元測試時，搭配 dayjs 且有使用到 `.toISOString()` 的功能都是表現正常。但把程式碼推到 gitLab 跑 deploy ci 後，卻發現測試變紅燈，檢查後發現是時區問題。

這篇筆記會說明如何設定 dayjs 的時區資訊，以及如何查詢時區名稱。

## 版本與環境

```plaintext
dayjs: 1.11.7
```

## 筆記

### 程式碼

範例如下：

```ts
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const LOCAL_TIME_ZONE = 'Asia/Taipei';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(LOCAL_TIME_ZONE); // 指定預設時區為 Asia/Taipei

const t1 = dayjs('2023-5-13 22:07').toISOString();
// 2023-05-13T14:07:00.000Z
const t2 = dayjs('2023-5-13').toISOString();
// 2023-05-12T16:00:00.000Z
```

注意事項：

1. 使用 `timezone` plugin 一定要引入 `dayjs/plugin/utc` 與 `dayjs/plugin/timezone`，缺一不可
2. 在每一個需要呼叫 `dayjs.tz()` 與 `dayjs.utc()` 的檔案內都要進行 `dayjs.extend(utc)` 與 `dayjs.extend(timezone)`

### 關於時區名稱

可在 [IANA: Time Zone Database](https://www.iana.org/time-zones) 下載。以檔案 `tzdata2023c.tar.gz` 為例，將下載回來的檔案解壓縮後，透過 chrome 開啟 `zone.tab` 即可瀏覽完整的時區資料。

### 補充：JavaScript Date 提供的字串輸出比較

```ts
const event = new Date();

console.log(event.toUTCString());
// "Sat, 13 May 2023 07:39:44 GMT"

console.log(event.toISOString());
// "2023-05-13T07:39:44.987Z"

console.log(event.toString());
// "Sat May 13 2023 15:39:44 GMT+0800 (Taipei Standard Time)"
```

- `.toUTCString()`: 回傳 UTC 字串，功能與 `toGMTString()` 一致
- `.toISOString()`: 回傳 ISO 8601 格式的字串，使用的時區為 UTC 0
- `.toString()`: 回傳本地時間字串

## 參考文件

- [Day.js Plugins > Timezone](https://day.js.org/docs/en/plugin/timezone)
- [IANA: Time Zone Database](https://www.iana.org/time-zones)
- [stackOverFlow: How to get list of all timezones in javascript](https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript)
