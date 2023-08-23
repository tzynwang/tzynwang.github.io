---
layout: '@Components/pages/SinglePostLayout.astro'
title: 2022 第32週 學習筆記：在 react app 中實作 event driven pattern
date: 2022-08-11 20:22:06
tag:
  - [Design Patterns]
  - [JavaScript]
  - [React]
  - [TypeScript]
---

## 總結

最近在開發的功能規模不大，適合用 event driven pattern 來實作，此篇筆記記錄一下開發時收到的建議與心得

- 展示頁：[https://tzynwang.github.io/react-event-driven-demo/](https://tzynwang.github.io/react-event-driven-demo/)
- 完整原始碼：[https://github.com/tzynwang/react-event-driven-demo](https://github.com/tzynwang/react-event-driven-demo)

## 筆記

### 建立事件

```ts
interface TokenLoginEvent {
  token: string;
}
```

```ts
enum AUTH_EVENT {
  TOKEN_LOGIN = 'TOKEN_LOGIN',
  LOGOUT = 'LOGOUT',
}
```

```ts
function dispatchTokenLoginEvent(): void {
  const event = new CustomEvent<TokenLoginEvent>(AUTH_EVENT.TOKEN_LOGIN, {
    detail: { token: 'a very long token' },
  });
  document.dispatchEvent(event);
}

function dispatchLogoutEvent(): void {
  const event = new Event(AUTH_EVENT.LOGOUT);
  document.dispatchEvent(event);
}
```

- 需注意傳入 `Event` 或 `CustomEvent` constructor 作為事件名稱的 `type` 在 DOM Level 2 改為大小寫不分；原文：This specification considers the `type` attribute to be case-sensitive, while **DOM Level 2 Events** considers `type` to be **case-insensitive**.
- CustomEvent 可在 constructor 第二個參數傳入要隨事件一併發送的資料，型別為 `{ detail: T = any }`；上述範例中傳入 `TokenLoginEvent` 作為 T
- 在有搭配 TypeScript 開發的情況下，可使用 enum 來管理專案內的所有事件名稱，使用 enum 也能避免打錯事件名稱的意外

### 監聽事件

```ts
function handleLogout(): void {
  // run the logout logic
  console.info('receive logout event.');
}
function handleLoginByToken(e: Event): void {
  // run the logic of login by token
  const event = e as CustomEvent<TokenLoginEvent>;
  console.info(`receive login by token event, token: ${event.detail.token}.`);
}

useEffect(() => {
  document.addEventListener(AUTH_EVENT.LOGOUT, handleLogout);
  document.addEventListener(AUTH_EVENT.TOKEN_LOGIN, handleLoginByToken);
  return () => {
    document.removeEventListener(AUTH_EVENT.LOGOUT, handleLogout);
    document.removeEventListener(AUTH_EVENT.TOKEN_LOGIN, handleLoginByToken);
  };
}, []);
```

在需要取出 CustomEvent 夾帶的 detail 資料時，透過 TypeScript `as` operator 讓 TS 將 event 認定為 `CustomEvent<TokenLoginEvent>` 型別，再從 detail 中取出對應的內容

### 小結

- 使用 event driven 模式的優點：
  - 觸發事件的條件單純時，開發速度很快
  - 將邏輯與介面 (views) 徹底分離，維護元件時不需擔心誤觸程式邏輯，反之更新邏輯時也不會意外影響元件外觀
  - 可將類型一致的邏輯處理集中到單一位置來管理，不會讓程式碼分散在專案各處，維護或除錯時比較不容易有漏網之魚
- 使用 event driven 模式的缺點：
  - 派送的事件數量（或條件）一旦變多，就不容易釐清事件是從哪邊被派送出來，除錯難度上升
  - 某些需求一開始可能單純，但日趨複雜，使用 event driven 不一定能兼顧後續的需求擴增，有打掉重練的可能

## 參考文件

- [MDN: Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events)
- [W3C: 11.1.3. Changes to DOM Level 2 Events interfaces](https://www.w3.org/TR/DOM-Level-3-Events/#changes-DOMLevel2to3Changes)
- [stackOverFlow: What are DOM levels?](https://stackoverflow.com/questions/6629093/what-are-dom-levels)
- [stackOverFlow: Is there a difference between `as` type operator and classical typing in TypeScript?](https://stackoverflow.com/questions/69220403/is-there-a-difference-between-as-type-operator-and-classical-typing-in-typescr)
