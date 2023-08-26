---
layout: '@Components/pages/SinglePostLayout.astro'
title: 鐵人賽 Modern Web 組「捨棄 create-react-app 之餘還架了個 astro blog 昭告天下」第 5 天
date: 2023-08-26 13:37:48
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-5/jan-antonin-kolar-lRoX0shwjUQ-unsplash.jpg
summary: 昨天說明了整包專案的資料夾結構規劃方式，今天來聊聊個人通常會根據哪些規則來分類 React 元件。
draft: true
---

昨天說明了整包專案的資料夾結構規劃方式，今天來聊聊個人通常會根據哪些規則來分類 React 元件。

## src/component 內容

以一個包含「landing page、全產品一覽、單一產品詳細頁」這三個畫面的 React app 專案來說，我規劃的 `src/component` 結構大致上會長這樣：

```bash
src/component
├── AppEntryPoint
│   └── index.tsx
├── Common
│   ├── ListItem
│   ├── SideBar
│   ├── SearchBar
│   └── TopNav
├── Layer
│   ├── AppRoutes
│   ├── Dialog
│   ├── GA4
│   ├── MuiThemeInject
│   └── ReduxProvider
├── Layout
│   └── Main
└── Page
    ├── LandingPage
		├── Products
    ├── SingleProduct
    └── NotFound
```

而以下會依照元件粒度從大到小，依序介紹個人的分類規則。

### AppEntryPoint

這個資料夾內只會有一個元件，即整個 React app 的入口。

這個元件唯一的任務，就是引用整個專案中會使用到的其他元件與資料層，個人不會在這裡執行任何額外的邏輯運算任務了。

```tsx
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from '@Component/Layer/AppRoutes';
import Dialog from '@Component/Layer/Dialog';
import GA4 from '@Component/Layer/GA4';
import MuiThemeInject from '@Component/Layer/MuiThemeInject';
import ReduxProvider from '@Component/Layer/ReduxProvider';
import '@Style/css/global.css';
import '@Tool/dayjsGlobalSetting';

function AppEntryPoint(): React.ReactElement {
  return (
    <HelmetProvider>
      <MuiThemeInject>
        <ReduxProvider>
          <AppRoutes />
          <Dialog />
          <GA4 />
        </ReduxProvider>
      </MuiThemeInject>
    </HelmetProvider>
  );
}

export default AppEntryPoint;
```

### Page

`Page` 中的每一個檔案都會對應到一條 url end point。假設一個專案總計有三條路由 `/` / `/products` / `/product/:id`，那麽路由與元件的對應會如以下安排：

- `/` 對應元件 `src/component/Page/LandingPage`
- `/products` 對應元件 `src/component/Page/Products`
- `/product/:id` 對應元件 `src/component/Page/SingleProduct`

作為獨立畫面的 404 頁也會被我歸納在 `src/component/Page` 資料夾中。

---

在畫面大致上已經確定、並且也規劃好路由後，個人就會開始開發 `Page` 元件。比較簡單的做法是一股腦把該路由所有的邏輯與視覺內容都寫到一個 `Page` 元件中，然後再根據資料流向、元件複用性來決定是否有可以拆進 `src/component/Layout` / `src/component/Common` 中的內容。

提醒：如果拆分出去的 `Layout` / `Common` 元件需要透過大量的 props（個人認為超過 5 個就算大量了）才能順利運作，這可能代表元件的拆分規模不恰當、或是有些資料需要透過 [React context](https://react.dev/reference/react/useContext) / [Redux store](https://redux.js.org/api/store) 來直取會比較方便。一個元件需要太多 props 會有股[高耦合性](<https://zh.wikipedia.org/zh-tw/%E8%80%A6%E5%90%88%E6%80%A7_(%E8%A8%88%E7%AE%97%E6%A9%9F%E7%A7%91%E5%AD%B8)>)的 code smell (´・ω・`)...

### Layer

如果一個元件帶有以下屬性，通常會被我歸類到 `src/component/Layer` 資料夾：

- 只有功能、沒有畫面的元件；比如 `GA4` / `MuiThemeInject` / `ReduxProvider`
- 整個 React app 都會用到的全域元件，比如 `AppRoutes` 或 `Dialog`

此類元件通常不需要透過 props 來接收資料。在真的有讀取資料的需求時（比如 `Dialog` 元件需要動態地控制對話框內文），基本上也是透過 Redux store 來取得資料。

### Layout

這個資料夾負責收納無功能邏輯、僅有排版作用的元件。假設一個 React app 專案大部分的畫面都包含「一個 TopNav 搭配下方的內容區塊」，那麽 `src/component/Layout` 中大概就會有一個叫做 `MainLayout` 的檔案：

```tsx
import React, { memo, PropsWithChildren } from 'react';
import TopNav from '@Component/Common/TopNav';
import moduleStyle from './index.module.css';

function MainLayout({ children }: PropsWithChildren): React.ReactElement {
  return (
    <div className={moduleStyle.container}>
      <ContractPageNav />
      <div className={moduleStyle.main_wrapper}>{children}</div>
    </div>
  );
}

export default memo(MainLayout);
```

現在所有外觀是「一個 TopNav 搭配下方的內容區塊」的元件就可以直接複用 `MainLayout` 的排版了。

### Common

只要觀察到一段程式碼（不論是邏輯或是樣式設定）在專案各處重複出現，這時就可以考慮把該段內容整理進 `src/component/Common` 中了。

舉例：假設在 `Page/LandingPage` 與 `Page/Products` 都有「展示產品的元件」，此時就可以考慮將相關程式碼抽出、獨立到 `src/component/Common/ListItem` 中。

原則是放在 `Common` 資料夾內的元件其[內聚性](https://zh.wikipedia.org/zh-tw/%E5%85%A7%E8%81%9A%E6%80%A7)越高、耦合度（必要的 props）越低越好。

另外，雖然程式碼的長度並不完全等同程式碼的品質，但個人會盡量讓放在 `Common` 內的元件不要超過 200 行。太長的程式碼除了讀起來很辛苦以外，也可能代表這個「單一元件」事實上還是同時做了太多事情，可以研究看看是否還能將這個元件的粒度繼續細化。

## 總結

以上就是個人目前分類元件的規則，如果喜歡歡迎你借用。當然，如果覺得我的規則根本不講理，也歡迎留言交流想法唷 ε≡ ﾍ( ´∀`)ﾉ
