---
title: 給習慣寫 CSR 服務的 remix 入門注意事項
date: 2024-08-31 21:57:06
tag:
	- [Remix]
banner: /2024/remix-note-for-developer-from-cra/sascha-bosshard-4x_yDlANVhs-unsplash.jpg
summary: 最近用 remix 開發了一個新產品。而因為我到目前為止的前端生涯一直都是在寫 client side render 服務，所以使用 remix 開發時需要克服一些習慣。此篇筆記記錄了一些開發時的心得，如果你也是習慣寫 client side render 的 React app 但想考慮試用 remix，這篇筆記可以提供一些踩坑經驗。
draft: 
---

提示：這不是一篇關於 [remix](https://remix.run/) 的手把手教學筆記，而是一個過去**只寫過 client side render 服務的前端工程師在改用 remix 開發後的心得分享**。如果你完全不知道 remix 是什麼，請先參考此框架的[新手教學](https://remix.run/docs/en/main/start/quickstart)。

## 大前提

推薦使用 remix 的大前提是**你能控制伺服器**，你寫好的服務**可以部署到後端**。如果你的服務只能做成 client side render 的形式，請改用 remix 的 [SPA Mode](https://remix.run/docs/en/main/guides/spa-mode) 開發。

> [via official document](https://remix.run/docs/en/main/guides/spa-mode#spa-mode): from the beginning, Remix's opinion has always been that **you own your server architecture**. While we believe that **having a server provides the best UX/Performance/SEO/etc. for most apps**, it is also undeniable that there exist plenty of valid use cases for a Single Page Application in the real world.

## 套件

如果你需要安裝第三方套件，請確認該套件是否能在對應的環境中執行。舉例：如果你需要在 `loader()`/`action()` 裡呼叫某個套件，該套件就要能在 Node.js 環境中運作。另一方面，任何會用到 `window`/`document` 的套件與功能（比如 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)），請一律在 `React.useEffect` 中執行。

### 關於 GA4

一開始我參考 [google-analytics](https://github.com/remix-run/examples/tree/main/google-analytics) 在 `root.tsx` 的 `Layout()` 設定了 GA4 的 script 標籤，但測試後確定事件都沒有被派送（明明 `window.dataLayer` 跟 `window.gtag` 都不是 `undefined` 🥲）。

目前的解決辦法：在 `React.useEffect` 中透過套件 [react-ga4](https://www.npmjs.com/package/react-ga4) 來啟動 GA4。

## 資料流

> 大原則：從 `loader()` 取資料，在元件（畫面）中使用 `loader()` 提供的資料；觸發 `action()` 後（比如使用者送出訂單），再根據 `action()` 造成的改變更新元件（畫面）。細節可參考[官方文件 Fullstack Data Flow](https://remix.run/docs/en/main/discussion/data-flow)。

所有「取得資料」的工作（呼叫 api/DB 等等）都由 `loader()` 負責，詳細可參考[官方文件 Data Loading](https://remix.run/docs/en/main/guides/data-loading)。

如果需要全域變數，可以從 `root.tsx` 的 `loader()` 傳入，再搭配 `useRouteLoaderData` 於特定部位取用。但要注意 `loader()` 吐出來的資料都是序列化的內容。需要全域功能或任何要「全域共用，但不能被序列化的資料」可以考慮用 [`<Outlet>`](https://remix.run/docs/en/main/components/outlet) 的 `props.context` 搭配 [`useOutletContext`](https://remix.run/docs/en/main/hooks/use-outlet-context) 來實現。

---

環境變數請根據你部署服務的後端來設定，參考 [Environment Variables](https://remix.run/docs/en/main/guides/envvars)。這部分比傳統的 client side render 服務簡單很多。

---

remix 有提供 [meta](https://remix.run/docs/en/main/route/meta) 功能方便開發者設定每一條路由的 `<meta>` 資訊。要注意的是：如果 `meta()` 需要用到 Node.js 環境的資料，要從 `loader()` 餵進去；另外，此功能雖然不在後端，但也無法操作 `window`/`document` 等瀏覽器物件 🌚

## 網路狀態

非常簡單易懂，只有三種：`idle` / `submitting` / `loading`。發生的順序可參考以下整理自 [useNavigation -- navigation.state](https://remix.run/docs/en/main/hooks/use-navigation#navigationstate) 的懶人包：

- HTTP `GET` 與一般瀏覽的狀態切換為 `idle` → `loading` → `idle`
- HTTP `POST`/`PUT`/`PATCH`/`DELETE` 的狀態切換為 `idle` → `submitting` → `loading` → `idle`

以下是自用的 custom hook:

```tsx
import { useNavigation } from '@remix-run/react';
import { useMemo } from 'react';

type NavState = {
  /** Means NO navigation pending */
  isIdle: boolean;
  /** A route action is triggered by <Form> submission using `POST/PUT/PATCH/DELETE` */
  isSubmitting: boolean;
  /** The loaders for the next routes are called, next page is going to be rendered */
  isLoading: boolean;
};

export default function useNavState() {
  const { state } = useNavigation();
  return useMemo<NavState>(
    () => ({
      isIdle: state === 'idle',
      isSubmitting: state === 'submitting',
      isLoading: state === 'loading',
    }),
    [state]
  );
}
```

## 打包

只要你能將服務**部署到後端**上，用 remix 打包就很簡單，直接跑 `remix vite:build` 就好。
