---
title: 2021 第51週 學習記錄：實作複數條件搜尋
date: 2021-12-25 16:01:08
tag:
  - [React]
---

## 總結

![multiple condition search](/2021/work-log-w51/multiple-condition-search.png)

本週筆記內容：使用物件結構來處理有複數種搜尋條件，而且須允許 debounce 的情境
完整程式碼：[https://github.com/tzynwang/react-mui/tree/feature/object-state](https://github.com/tzynwang/react-mui/tree/feature/object-state)

## 情境描述

- 測試用 API 支援以下三種有效搜尋條件：每一頁的顯示數量（results）、國籍（nat）與性別（gender）
- 需使用 `debounce` 來避免搜尋連打的情境發生

## 實作筆記

### 保存搜尋條件的資料結構

```ts
const TABS: Gender[] = ["female", "male"];
const DEFAULT_PAGE = 5;
const DATA_PER_PAGE = [5, 7, 10];
const CONDITION: QueryCondition = {
  global: {
    results: DEFAULT_PAGE,
    gender: TABS[0],
    nat: "",
  },
  local: {
    nat: "",
  },
};
```

- 分割成 `global` 與 `local` 兩種狀態，在 `muiTextField` 觸發 `onChange` 事件時僅會修改 `local` 部分的資料
- 當使用者點擊不同 `MuiTab` 或修改每一頁顯示的資料數量時，直接修改 `global` 部分的資料

### debounce 化

```ts
const handleSearch = () => {
  setQueryCondition((prev) => ({
    ...prev,
    global: {
      results: prev.global.results,
      gender: prev.global.gender,
      nat: queryCondition.local.nat,
    },
  }));
};
const debouncedHandleSearch = debounce(handleSearch, 400);
```

- 上述原始碼白話文：只有要準備執行搜尋的時候，才將 `local.nat` 的值更新到 `global.nat` 上
- 綁在搜尋按鈕 `onClick` 與 muiTextFiled `onKeyDown` 上的是 `debouncedHandleSearch`

### 打 API 的時間點

```ts
useEffect(() => {
  async function fetchUser() {
    const params = { ...queryCondition.global };
    const res = await axios.get<undefined, AxiosResponse<FetchUserListRes>>(
      "https://randomuser.me/api/",
      { params },
    );
    setUserList(res.data.results);
  }
  fetchUser();
}, [queryCondition.global]);
```

- 訂閱的是 `queryCondition.global` 的變化狀態
- 因為使用者點擊搜尋按鈕或對 `muiTextField` 按下 `Enter` 的 `handleFunctions` 皆有進行過 debounce 處理，故可避免搜尋連打的情況出現
- 可以在維持 `nat` 搜尋條件下進行性別或每頁資料數量的調整

## 參考文件

- [demo: debounce, throttle](http://demo.nimius.net/debounce_throttle/)
