---
title: 葫蘆裡的 React：關於渲染（render）與確認（commit）
date: 2024-03-10 15:16:05
tag:
  - [React]
banner: /2024/react-under-the-hood-render-and-commit/theme-photos-Cl-OpYWFFm0-unsplash.jpg
summary: 此篇是關於新 React 官方文件對於 render 與 commit 解說的筆記。同時也整理了組件在掛載、更新與移除時的活動時間軸。
draft:
---

## 總結

- React 的渲染（render）**不是**瀏覽器的畫面繪製階段
- 當組件（component）的 `props` 或狀態（state）有變時，React 會先渲染（render）再確認（commit）要呈現的內容——接著才由瀏覽器進行畫面繪製

## 何謂渲染（render）

> 即 React 要求組件（component）根據它當下的 `props` 與狀態（state）回傳它「應該呈現在畫面上的內容」

以下兩種情境都會觸發渲染：

1. 首次渲染（initial render）
2. 一個組件（或其親組件）的狀態改變時

---

渲染時，React 會遍歷所有組件，直到一個組件回傳的是 HTML 元素（host element）為止。在遍歷過程中，React 會記錄所有組件回傳的內容，並比對新、舊元素樹的差異，並整理出「需要修改的內容」——接著交給「確認（commit）階段」來修改 DOM。

## 何謂確認（commit）

> 即「更新 DOM 的階段」

- 在首次渲染（initial render）時，React 會呼叫 `appendChild()` 來產生 DOM
- 在後續透過「狀態變化」觸發重渲染時，React 會最小幅度地修改 DOM，使其符合最終要呈現的內容

在 React 處理完 DOM 之後，才輪到瀏覽器來更新畫面（browser rendering）。

## 活動時間軸

### 掛載（mount）

在渲染階段：

1. 建立局部狀態的值
2. 初次呼叫 `useEffect` 以外的 hooks 們
3. 根據 `props` 與狀態回傳（return）組件當下要顯示的內容

在確認階段：

1. 根據渲染階段產生的結果建立 DOM 節點
2. 將組件的 `ref` 與 DOM 關聯起來
3. 由瀏覽器執行繪製
4. 執行 `useEffect`

### 更新（update）

在渲染階段：

1. 呼叫 `useEffect` 以外，且「依賴陣列（dependency array）內容有變」或「沒有依賴陣列」的 hooks 們
2. 根據 `props` 與狀態回傳（return）組件當下要顯示的內容

在確認階段：

1. 更新 DOM 節點
2. 由瀏覽器執行繪製
3. 執行「依賴陣列（dependency array）內容有變」或「沒有依賴陣列」的 `useEffect` clean up 內容
4. 執行「依賴陣列（dependency array）內容有變」或「沒有依賴陣列」的 `useEffect` 的 set up 內容

可參考以下範例來理解 set up 與 clean up 的範圍：

```jsx
useEffect(() => {
  // here's the set up part

  return () => {
    // here's the clean up function
  };
}, [someValue]);
```

### 解除掛載（unmount）

1. 將組件的 `ref` 設定為 `null`
2. 移除該 DOM 節點
3. 執行 `useEffect` 的 clean up 內容

## 參考文件

- [official doc 2.0: Render and Commit](https://react.dev/learn/render-and-commit)
- [Timeline of a React Component With Hooks](https://julesblom.com/writing/react-hook-component-timeline)
