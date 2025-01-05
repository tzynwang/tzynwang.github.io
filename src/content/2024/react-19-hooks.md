---
title: React 19 筆記：hooks 篇
date: 2024-05-05 19:37:19
tag:
- [React]
banner: /2024/react-19-hooks/anne-nygard-viq9Ztqi3Vc-unsplash.jpg
summary: 這週花了一些時間在了解 React 19 Beta 預定要帶來的新功能與改動，此篇旨在記錄新 hooks 的用途與使用方式。
draft: 
---

提醒：這篇筆記是我在讀完 [React 19 Beta](https://react.dev/blog/2024/04/25/react-19) 後，參考官方文件對於各 hook 的說明整理出來的東西。這不是一篇把每個 hook 從頭講解到尾的文章，我只記錄自認重要的部分。如果你需要知道 React 19 預定帶來的新功能與每個 hook 的詳細解說，請務必閱讀官方文件。

## useTransition

目的：避免繁重計算阻擋使用者與畫面互動。

使用範例：

```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

回傳內容：

- `isPending` 讓使用者判斷現在是否在執行變遷（Transition）
- `startTransition` 將使用者傳入的狀態變更（set）功能標記為變遷（Transition）

搭配上方範例，我們在做的事情就是「將 `setTab` 標記為變遷」。在執行變遷時，畫面（UI）不會凍結。可以透過[官方範例](https://react.dev/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)體驗一下「有無變遷」如何影響使用者與 App 互動的體驗。

而參數 `isPending` 則是能讓使用者不必透過 `Suspense` 來控制畫面，可參考[官方範例](https://react.dev/reference/react/useTransition#preventing-unwanted-loading-indicators)來體驗局部 UI 變更的效果。

注意事項：

- 無法將 input 的狀態變更標記為變遷
- 被標記為變遷的狀態變更，會被其他的狀態變更打斷——比如我將狀態Ａ標記為變遷，並且在狀態Ａ重渲染到一半（in the middle of a re-render）時，跑去變更狀態Ｂ，此時 React 會停止更新狀態Ａ，並於狀態Ｂ完成更新後，再處理狀態Ａ的渲染（restart the rendering work for state A after handling state B）
- React 目前會批次執行變遷（for multiple ongoing Transitions, React currently batches them together）
- `startTransition` 僅支援同步功能
- 可以[直接從 `react` 中取用 `startTransition`](https://react.dev/reference/react/startTransition#starttransitionscope)

## useDeferredValue

目的：在新結果計算完畢前，不更新畫面，而是顯示上一次的計算結果。與 `useTransition` 有點類似，這個 hook 的目的也是避免讓繁重的計算影響到使用者與 App 的互動體驗。

使用範例：

```jsx
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

接收參數：

- `value` 任何原始型別（primitive type）的資料，或是「不是在渲染中產生的物件資料」
- `initialValue` 會讓元件在第一次渲染（initial render）時進行比對，目前只能在 React 19 測試

回傳內容：在第一次渲染時，會回傳使用者傳入的值（上述 `value`）。在重渲染時，React 會先回傳舊值，再回傳新值。搭配[官方範例](https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui)比較能體會這個「新舊值切換」到底在解決什麼問題。

注意事項：

- 此 hook 使用 `Object.is` 來比對新舊值的差異。這也是為什麼在打算「傳入物件作為參數」時，物件「不能是在每一次渲染中產生的資料」——因為每次比對都會判斷成「有差異」，導致不必要的額外工作（it will be different on every render, causing unnecessary background re-renders）
- 在判斷新舊值「有差異」後，React 會安排背景渲染工作（it schedules a re-render in the background with the new value），這個背景渲染工作在每次值發生變化時，都會被打斷、重新開始，是優先度低的工作
- 注意此 hook 僅針對畫面渲染，根據值進行的 api 呼叫等等工作並不會跟著優化（only displaying results are deferred, not the network requests themselves）
- 如果狀態變更被標記為變遷（Transition，參考上方 useTransition 筆記說明），那 useDeferredValue 必定會回傳新值（always returns the new `value` and does not spawn a deferred render, since the update is already deferred）

## useOptimistic

目的：在新結果計算完畢前，先用 `optimisticState` 更新畫面。

接收參數：

- `state`
- `updateFn(currentState, optimisticValue)`

回傳結果

- `optimisticState` 通常等於 `state`。不過如果有執行到一半的 action，則值會是 `updateFn(currentState, optimisticValue)` 回傳的內容
- `addOptimistic` 接受一個參數 `optimisticValue`，並執行 action

整理了一版改編自官方的[使用範例](https://stackblitz.com/edit/vitejs-vite-dclgdx?file=src%2FApp.tsx)，以下是此範例的詳細行為說明：

1. `App` 的 `sendMessage` 功能接收 `msg: string` 作為參數，並以此值呼叫 api，最後再透過 `setMessages` 將 api 回傳的結果更新回本地狀態
2. 使用者對 `Thread` 元件送出表單後，從表單取得 `message` 欄位的值（`msg`），並將此值傳給 `addOptimistic`（即 `addOptimisticMsg`）開始執行 action。接著清空表單內容，並呼叫 `sendMessage(msg)`
3. 執行 `addOptimisticMsg` 時會發生的事情請參考範例第 14 到 21 行，我們將使用者輸入到表單的值（`msg`）加入 `optimisticState`（即 `optimisticMsg`）中，並設定 key sending 為 `true`
4. 而因為我們使用 `optimisticState`（即 `optimisticMsg`）來渲染畫面，所以在 api 回傳實際結果前，會看到畫面上出現 `(Sending...)` 字樣
5. 在 api 回傳結果後，回到步驟一，我們透過 `setMessages` 將 key sending 設定為 `false`，畫面上的 `(Sending...)` 消失

## useActionState

目的：根據 form action 的結果來更新局部狀態。可參考[官方範例](https://react.dev/reference/react/useActionState#using-information-returned-by-a-form-action)感受其作用。

使用範例：

```jsx
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

接收參數：

- 第一個參數 `fn` 是在送出表單（when the form is submitted or button pressed）時，要執行的功能。此功能會收到兩個參數 `prevState` 與 `formData`
- 第二個參數 `initialState` 如其名，是局部狀態的初始值，只會在這個 hook 第一次被呼叫時取用

回傳內容：

- `state` 在初次渲染時，回傳 `initialState`，而在執行過 `fn` 後，會回傳對應的內容
- `formAction` 是提供給表單使用的功能

## useFormStatus

目的：取得送出表單時的狀態。需注意此 hook 只能在表單的子元件中使用。

回傳內容可解構為以下四項資訊：

- `pending` 負責提示表單是否正在送出資料的途中
- `data` 可取得表單資訊
- `method` 負責提示該表單使用 `GET` 或 `POST` 哪一個 HTTP method 執行送出
- `action` 會連結到該表單的 action 功能

## 參考文件

- [React 19 Beta](https://react.dev/blog/2024/04/25/react-19)
- [useTransition](https://react.dev/reference/react/useTransition)
- [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [useActionState](https://react.dev/reference/react/useActionState)
- [useFormStatus](https://react.dev/reference/react-dom/hooks/useFormStatus)
