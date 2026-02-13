---
title: 影片筆記：Managing React State -- 10 Years of Lessons Learned
date: 2024-02-27 20:32:49
tag:
  - [React]
banner: /2024/react-how-to-state/aveedibya-dey-nfzdRKD0Zkg-unsplash.jpg
summary: 這部影片非常簡潔地介紹了一些 React 本地狀態的反模式，以及可以透過哪些作法來化解這些不良設計
draft:
---

## 筆記

單圖精華：

![8 ways to handle state in react app](/2024/react-how-to-state/8-ways-to-handle-state-in-react-app.png)

### 提升內聚性

如果狀態彼此之間帶有強烈關聯，使用一個 useState 變數集中管理即可。比如下列的「信用卡號」「卡片有效日期」「持卡人姓名」其實可以集中到「付款資訊」一個變數中：

```js
// don't
const [cardNo, setCardNo] = useState("");
const [cardExpDate, setCardExpDate] = useState("");
const [cardHolderName, setCardHolderName] = useState("");

// do
const [cardInfo, setCardInfo] = useState({
  no: "",
  expDate: "",
  holderName: "",
});
```

如果不確定狀態們是否「有關」，可以根據「這些資料是否會包成一個 request body 送到後端」來判斷。

---

當你發現自己經常「同時執行多組 state set」時，可考慮是否該將這些狀態包在一起（參考上述），或是改用 useReducer 來管理：

```js
// don't
setUser(user);
setIsLoading(false);

// do: update multiple states in one dispatch
dispatch({ type: "save-user", payload: user });
```

### 偏好推導

在透過 `useEffect` 監聽前兩組狀態變數，以計算第三個狀態變數時，請確認「第三個變數」是否真的需要被 useState 管理：

```js
// don't
useEffect(() => {
  setFullName(`${firstName}, ${LastName}`);
}, [firstName, lastName]);

// do
const fullName = `${firstName}, ${LastName}`;
```

多使用推導（derive）來計算值，有時候你不需要這麼多組 useEffect / useState 😇

### 避免在 useEffect 中呼叫 api

影片看法：避免在 useEffect 中呼叫 api 來取得資料，請考慮使用 custom hook 或現成的第三方套件（[React Query](https://tanstack.com/query/latest/), [SWR](https://swr.vercel.app/) 等）來處理 api 互動。

[react 官方文件](https://react.dev/reference/react/useEffect#fetching-data-with-effects)的看法：直接在 useEffect 裡面呼叫 api 不是不行，但要記得處理 race condition 以及元件卸載（unmount）時清空本地狀態。

## 參考資料

- [(YouTube) Managing React State: 10 Years of Lessons Learned - Cory House, React Day Berlin 2023](https://youtu.be/-IqIqJxC-wo?si=2T-BrEYK5VCiBpN6)
- [(twitter) 10 lessons I've learned about handling React state over the last 7 years...](https://x.com/housecor/status/1437765667906854915?s=20)
