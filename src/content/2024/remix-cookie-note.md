---
title: 快速筆記：如何對 remix 的 cookie 功能加上一點 TypeScript
date: 2024-10-02 18:43:54
tag:
  - [Remix]
banner: /2024/remix-cookie-note/caglar-araz-CggwlFAw8Kw-unsplash.jpg
summary: 為了避免打錯字誤事，我寫了兩個簡單的 TypeScript 小功能幫忙在 remix 中處理 cookie 的取值、賦值工作。
draft:
---

## 筆記

### 如何對 remix cookie 加上一點 TypeScript

根據 remix 官方的[Cookie 範例](https://remix.run/docs/en/main/utils/cookies)，透過 `createCookie` 建立 `cookieHelper` 後，執行 `cookieHelper.parse()` 得到的回傳內容，其型別會是 `any`。但我想要在設定 request headers `Set-Cookie` 和取得 response headers `Cookie` 時借助一點 TypeScript 的力量，於是有了以下兩個功能 `get` 和 `setAndSerialize`：

```ts
import { createCookie } from "@remix-run/node";

export const cookieHelper = createCookie("remixCookieJar");

const validKeys = ["bravoToken", "superToken"] as const;

type CookieKey = (typeof validKeys)[number];

export const get = async (key: CookieKey, cookies: string | null) => {
  const jar = await cookieHelper.parse(cookies);
  if (!jar) return "";
  return (jar[key] as string) || "";
};

export const setAndSerialize = async (
  key: CookieKey,
  value: string,
  cookies: string | null,
) => {
  const jar = await cookieHelper.parse(cookies);
  if (!jar) return "";
  jar[key] = value;
  return await cookieHelper.serialize(jar);
};
```

說明：

- `get`: 目的是確保使用者從 cookie 取值時不會打錯字，比如目前只開放取用陣列 `const validKeys = ['bravoToken', 'superToken'] as const;` 提到的兩種鍵
- `setAndSerialize`: 目的是確保使用者不會在對 cookie 賦值時打錯字，並順便回傳序列化後的資料

操作示範如下。首先在 remix `action` 使用 `setAndSerialize` 對 cookie 設定登入後回傳的 auth token，並透過 [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) 加進 response header 中：

```tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { setAndSerialize } from "my-remix-app/app/cookies.server.ts";

export default function LoginPage() {
  return (
    <Form method="post">
      <button type="submit">Submit</button>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  // do some login work...
  const authToken = "...";
  // assign auth token to cookie
  const headers = {
    "Set-Cookie": await setAndSerialize(
      "superToken",
      authToken,
      request.headers.get("Cookie"),
    ),
  };
  return redirect("/result", { headers });
}
```

而當我需要取得 auth token 時，就在 remix `loader` 使用 `get` 來取得 cookie 中的對應內容，並回傳的資料型別必定為字串，不需要再進行額外的型別驗證。可參考下方範例：

```tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { get } from "my-remix-app/app/cookies.server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const superToken = await get("superToken", request.headers.get("Cookie"));
  return json({ superToken });
}

export default function ResultPage() {
  const { superToken } = useLoaderData<typeof loader>();
  return <p>{superToken ? superToken : "no super token"}</p>;
}
```

省事 🌚 害怕打錯字就是督促我多寫點抽象層的原動力。

### 如何在 remix 中操作第三方 cookie

最近在弄的專案會需要和同 domain 的不同產品共用 cookie，非 remix 建立的 cookie 就沒辦法透過 `createCookie` 的 `.get()` / `.set()` 操作了。需要另覓他法。而考量到我需要在 remix loader 內（後端）處理 cookie，故選擇使用支援 Node.Js 環境的 [`cookie`](https://www.npmjs.com/package/cookie) 套件。包一層抽象的程式碼如下：

```ts
import cookie from "cookie";

export const get3rdPartyCookie = async (
  key: string,
  cookies: string | null,
) => {
  const jar = cookie.parse(cookies || "");
  return jar[key] || "";
};
```

實際使用範例如下：

```ts
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { get3rdPartyCookie } from "my-remix-app/app/cookies.server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const otherCookie = await get3rdPartyCookie(
    "notRemixCookieJar",
    request.headers.get("Cookie"),
  );
  return json({ otherCookie });
}
```

## 參考文件

- [Remix Cookies](https://remix.run/docs/en/main/utils/cookies)
- [mdn HTTP Headers Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
