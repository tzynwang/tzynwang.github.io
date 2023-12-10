---
title: 快速筆記：在 react-router-dom 5 實作條件路由
date: 2023-06-17 12:44:24
tag:
  - [React]
---

## 總結

目前手上有一個專案是使用 react 18 搭配 react-router-dom 5 來進行開發，在實作「條件式路由＋懶載入」的途中，持續遇到「進入不存在的路由時，404 畫面消失，畫面只剩一片空白」的情況。此篇筆記將記錄一下最後能順利作用的程式碼為何。

## 版本與環境

```
react: 18.2.0
react-router-dom: 5.3.4
```

## 筆記

### 需求描述

- 使用 react 的 `lazy` 搭配 `Suspense` 元件
- 根據 `env.isDevelopment` 來決定是否要讓使用者進入 `/something-develop-only` 這個畫面，在非開發環境下，試圖進入 `/something-develop-only` 的使用者會被送到 `/404` 頁
- 暫不考慮使用帳號系統來做權限管理

### 程式碼

重點：

- `React.Suspense` 要包在 `Switch` 外層
- 作為 `React.Suspense` 的 fallback 元件不使用懶載入

```tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Loading from '@Component/Page/Loading';
import env from '@Model/env';
const Landing = lazy(() => import('@Component/Page/Landing'));
const SomePage = lazy(() => import('@Component/Page/SomePage'));
const DevelopmentOnly = lazy(() => import('@Component/Page/DevelopmentOnly'));
const NotFound = lazy(() => import('@Component/Page/NotFound'));

function Router(): React.ReactElement {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" exact>
            <Landing />
          </Route>
          <Route path="/page1">
            <SomePage />
          </Route>
          <Route path="/development-only" exact>
            {env.isDevelopment ? <DevelopmentOnly /> : <Redirect to="/404" />}
          </Route>
          <Route path="/404">
            <NotFound />
          </Route>
          <Route path="*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;
```

備註：以下兩種寫法可以互換，效果相同

寫法ㄧ：根據 `env.isDevelopment` 與否決定顯示 `DevelopmentOnly` 或 `Redirect` 元件

```tsx
<Route path="/develop-only" exact>
  {env.isDevelopment ? <DevelopmentOnly /> : <Redirect to="/404" />}
</Route>
```

寫法二：根據 `env.isDevelopment` 來決定是否要在 `Switch` 元件內顯示 `/develop-only` 這條路由的 `Route` 元件

```tsx
{
  env.isDevelopment && (
    <Route path="/develop-only" exact>
      <DevelopmentOnly />
    </Route>
  );
}
```

## 參考文件

- [stackOverFlow: 404 route issues with React Router and Suspense](https://stackoverflow.com/questions/63534693/404-route-issues-with-react-router-and-suspense)
- [React official doc v1: Route-based code splitting](https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting)
