---
title: 如何指南：在 React Router v7 Framework 模式下，設定 Google Analytics (gtag)
date: 2025-08-17 10:32:30
tag:
  - [React Router v7]
  - [Remix]
banner: /2025/remix-google-analytics/it-works-why.jpg
summary: 早點想到用 import.meta.env 帶入環境變數，事情應該就不會那麼複雜了吧 😶‍🌫️
draft:
---

[時隔一年後](/2024/remix-note-for-developer-from-cra#關於-ga4)再度嘗試，發現可以在 **React Router v7 的 Framework 模式**順利以原生 script 標籤啟動 Google Analytics (gtag) 了 ~~去年到底是發生了什麼呢~~。總之紀錄並分享一下做法。

順帶確認了可以在 `clientAction` 中派送 GA 事件——終於，我們可以優雅地滿足那些「我需要在購買成功、api 呼叫成功後派送 XX 成功的 GA 事件 🥺」需求了。

## 安裝方式

步驟：

1. 以環境變數 `VITE_GA_TRACKING_ID` 傳遞 GA 的啟動碼
2. 開啟 `<你的專案>/app/root.tsx` 並在 `function Layout` 貼上 [gtag.js 提供的範例（如下）](https://developers.google.com/tag-platform/gtagjs)；我追加了一行官方文件沒有列出的參數 `debug_mode`（開啟後，可以在 GA 後台透過 Admin > DebugView 即時查看被派送的事件）

```tsx
<>
  <script
    async
    src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`}
  />
  <script
    async
    dangerouslySetInnerHTML={{
      __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${import.meta.env.VITE_GA_TRACKING_ID}', {
                  debug_mode: ${import.meta.env.DEV ? "true" : "false"},
                });
              `,
    }}
  />
</>
```

新增 script 後的 `function Layout` 會長得像這樣：

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-1">
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`}
        />
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${import.meta.env.VITE_GA_TRACKING_ID}', {
                  debug_mode: ${import.meta.env.DEV ? "true" : "false"},
                });
              `,
          }}
        />
      </body>
    </html>
  );
}
```

完成。就這樣。你可以在整個 React Router v7 app 中透過 `gtag('event', '<event_name>', {<event_params>})` 派送 GA 事件了。

## 在 clientAction 派送 GA 事件

在 `clientAction` 派送事件的話，可以避免重整畫面造成的重複派送，也能運用 `action` 回傳的資料。可參考以下範例。

```ts
import { type ActionFunctionArgs, type ClientActionFunctionArgs, Form, redirect } from 'react-router';

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const test = form.get('test') as string;
  // do something...
  const result = await db.doSomething({ ...test });
  return { test, result };
}

export async function clientAction({ serverAction }: ClientActionFunctionArgs) {
  const data = await serverAction<typeof action>();
  window.gtag('event', 'some_ga_event', { ...data });
  return redirect('/test-b');
}

export default function TestA() {
  return (
    <Form method="post">
      <input type="text" name="test" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

這段程式碼在做的事情是：

1. 當使用者送出表單後，在 `action` 階段進行一些處理
2. 接下來，透過 `clientAction` 的 `serverAction` 參數取得 `action` 階段取得的資料——這些資料會成為 GA 事件的參數
3. 透過 `window.gtag('event', 'some_ga_event', { ...data })` 派送事件
4. 將使用者導向路由 `/test-b`

## 參考文件

- [Tag Platform: Add the Google tag to your website](https://developers.google.com/tag-platform/gtagjs#add_the_google_tag_to_your_website)
- [Google tag API reference](https://developers.google.com/tag-platform/gtagjs/reference)
