---
title: 如何在 Remix 讀取、下載 json 檔
date: 2025-01-04 10:20:19
tag:
  - [Remix]
banner: /2025/remix-how-to-read-download-json/food-photographer-jennifer-pallian-dcPNZeSY3yk-unsplash.jpg
summary: 如題，新的一年就從分享在 Remix 裡面處理「讀取 .json 檔內容」和「將特定內容下載為 .json 檔」的程式碼開始。新年快樂 🍾
draft:
---

## 讀取 json

### 讀取靜態檔案中的 json

流程：

1. 使用 `node:fs/promises` 的 `readFile` 從指定路徑讀取檔案內容
2. 使用 `JSON.parse()` 將字串化的檔案內容解析成物件，接著就可以透過 `useLoaderData` 隨意使用了

```tsx
import { readFile } from "node:fs/promises";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const fileContent = await readFile("path/to/file.json");
  return JSON.parse(fileContent.toString());
}

export default function ReadJson() {
  const data = useLoaderData<typeof loader>();
}
```

### 讀取使用者上傳的 json

重點：

- remix 的 `Form` 元件 `encType` 要設定為 `"multipart/form-data"`，參考 [TypeError: Could not parse content as FormData](https://github.com/remix-run/remix/issues/3238#issuecomment-1150493008)
- 透過 `await new Response(file).text();` 即可取得純文字版的 .json 檔內容，加上 `JSON.parse(text);` 就可得到 JS 物件

```tsx
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

// https://remix.run/docs/en/main/guides/file-uploads
// https://remix.run/docs/en/main/utils/unstable-create-memory-upload-handler
export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler();
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );
  const file = formData.get("file");
  const text = await new Response(file).text();
  return JSON.parse(text);
}

export default function Index() {
  const data = useActionData<typeof action>(); // do whatever you need
  return (
    <Form method="post" encType="multipart/form-data">
      <input type="file" name="file" accept="application/json" />
      <button type="submit">上傳</button>
    </Form>
  );
}
```

## 下載為 json

提醒：我的需求是「把使用者填寫到表單（`Form`）中的內容下載為 .json 檔」。如果你會自行處理要被下載的內容，那直接從 [downloadJson](#function-downloadjson) 這段開始看就好。

### 使用 qs 處理表單內容

流程：

1. 使用者送出（`submit`）表單後，先透過 npm 套件 qs 處理表單內容
2. 透過 `useActionData` 取出 qs 處理好的內容，再搭配 `downloadJson`（詳細請參考下一大段）執行檔案下載

```tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { downloadJson } from "~util";
import qs from "qs";
import { useEffect } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const text = await request.text();
  return qs.parse(text);
}

export default function SomeForm() {
  /* data */
  const data = useActionData();
  /* hook */
  useEffect(() => {
    downloadJson(data);
  }, []);
  /* main */
  return (
    <Form method="post">
      {/* many inputs... */}
      <button type="submit">download as .json</button>
    </Form>
  );
}
```

### function downloadJson

流程：

1. 由 `JsonHandler` 的 `createUrl` 將內容加工成 .json 檔，並取得可下載的路由和下載檔案名稱
2. 由 `DownloadHandler` 負責處理下載行為

```tsx
export function downloadJson(input: any) {
  const jsonHandler = new JsonHandler();
  const url = jsonHandler.createUrl(input);
  const fileName = jsonHandler.createFileNameDateIso();
  const downloadHandler = new DownloadHandler({ url, fileName });
  downloadHandler.exec();
}
```

### class JsonHandler

```tsx
export class JsonHandler {
  /**
   * Creates a URL for downloading a JSON object.
   *
   * @param input - The JSON object to be downloaded.
   * @param overwriteFormatter - An optional function that formats the JSON object before downloading.
   * @returns A URL that can be used to download the JSON object.
   */
  createUrl(input: any, overwriteFormatter?: (...args: unknown[]) => string) {
    const formatted = overwriteFormatter
      ? overwriteFormatter(input)
      : JSON.stringify(input, null, 2);
    const blob = new Blob([formatted], { type: "application/json" });
    return window.URL.createObjectURL(blob);
  }

  createFileNameDateIso() {
    return `${new Date().toISOString()}.json`;
  }
}
```

### class DownloadHandler

```tsx
type DownloadHandlerArgs = {
  url: string;
  fileName: string;
};

export class DownloadHandler {
  #url: string;

  #fileName: string;

  constructor(args: DownloadHandlerArgs) {
    this.#url = args.url;
    this.#fileName = args.fileName;
  }

  createDownloadAnchor(href: string, fileName: string) {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    return link;
  }

  exec() {
    const el = this.createDownloadAnchor(this.#url, this.#fileName);
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
    window.URL.revokeObjectURL(this.#url);
  }
}
```

## 其他下載方式

### 下載為純文字檔

出自 Remix 的 issue [How to download a file in Remix?](https://github.com/remix-run/remix/discussions/5533)：

```ts
export function action() {
  const content = "some text content...";
  return new Response(content, {
    status: 200,
    headers: {
      "Content-Disposition": 'attachment; filename="some.txt"',
      "Content-Type": "plain/text",
    },
  });
}
```

### 下載為 .md 檔

出自 stack overflow [Remix: file download](https://stackoverflow.com/questions/75526237/remix-file-download)：

```ts
import { Readable } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";

export const loader = async () => {
  const file = createReadableStreamFromReadable(
    Readable.from(["Hello, World!"]),
  );

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="hello.md"',
      "Content-Type": "text/markdown",
    },
  });
};
```

## 參考文件

讀取 json 檔：

- [Remix: File Uploads](https://remix.run/docs/en/main/guides/file-uploads)
- [Remix: unstable_createMemoryUploadHandler](https://remix.run/docs/en/main/utils/unstable-create-memory-upload-handler)
- [MDN: Blob > Extracting data from a blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob#extracting_data_from_a_blob)

下載為 json 檔：

- [npm: qs](https://www.npmjs.com/package/qs)
- [MDN: URL > createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)
