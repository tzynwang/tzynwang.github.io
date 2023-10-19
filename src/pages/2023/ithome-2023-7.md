---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：webpack 5 與環境變數
date: 2023-09-22 08:11:44
tag:
  - [2023鐵人賽]
  - [Frontend Infrastructure]
  - [webpack]
banner: /2023/ithome-2023-7/cookie-the-pom-gySMaocSdqs-unsplash.jpg
summary: 很抱歉吊了幾天的胃口，從今天開始終於要來聊聊 webpack 設定了。首先從處理環境變數開始吧。
draft:
---

接下來幾天會來介紹個人開發時慣用的 webpack 設定。會從零開始撰寫，處理範圍如下：

- `.env` 讀取、驗證、帶入設定
- 處理 `TypeScript` 檔案（包含在 tsconfig.json 設定過的 `paths` 內容）
- 處理靜態資源、樣式（css）內容

那麼以下就來說明個人將 `.env` 導入 webpack 的工作流程 (•ㅂ•)/

## 本文

### 流程說明

大流程如下：

1. 首先透過套件 `dotenv` 來讀取 `process.env` 內容
2. 透過套件 `superstruct` 來驗證 `process.env` 的結構與資料是否符合預期；比如檢查 `APP_PORT` 是否為數字、`APP_API_URL` 是否為有效 url 內容
3. 資料通過驗證後，才將環境變數傳入 `Webpack.DefinePlugin` 讓 React app 能夠取用

而以下是與「處理環境變數」有關的資料夾與其結構：

```bash
./config
├── data
│   ├── env.ts
│   └── types.d.ts
└── webpack.config.development.ts

./tool
├── processEnvValidate.ts
└── urlValidate.ts
```

結合上方關於大流程的說明，資料基本上是這樣跑的：

1. 在 `./config/data/env.ts` 中透過 `dotenv` 讀取 `process.env`
2. 在 `./config/data/env.ts` 引用 `./tool/processEnvValidate.ts` 提供的「驗證資料的功能」，由 `processEnvValidate.ts` 來判斷 `process.env` 的結構與內容是否正確
3. 確定 `process.env` 的通過驗證後，`./config/data/env.ts` 會預設匯出（default export）檢驗過的環境變數資料
4. 開發專用的 webpack 設定檔 `./config/webpack.config.development.ts` 會引用 `./config/data/env.ts` 匯出的環境變數資料，並將之傳遞到 `new Webpack.DefinePlugin()` 中

那麽，接下來會開始示範如何讀取以下的 `.env` 內容：

```bash
# +------------------+
# |Run Time Env Block|
# +------------------+

NODE_ENV=development
BUILD_DESTINATION=build

# +---------+
# |APP Block|
# +---------+

APP_API_URL=https://api.example.com
APP_PORT=3000

```

### 程式碼

#### config/data/env.ts

```ts
/* Packages */
import dotenv from 'dotenv';
import {
  setDevelopmentEnvObject,
  setProductionEnvObject,
  getValidatedDevelopmentEnv,
  getValidatedProductionEnv,
  getEnvsForDefineConfig,
} from '@/tool/processEnvValidate';
import type { GetValidatedProcessEnv } from './types';

/* Functions */
dotenv.config();

function getValidatedProcessEnv() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  if (isDevelopment === isProduction) {
    throw new Error('NODE_ENV should either be development or production');
  }
  if (isDevelopment) {
    const env = setDevelopmentEnvObject(process.env);
    const validatedEnv = getValidatedDevelopmentEnv(env);
    return getEnvsForDefineConfig(validatedEnv);
  }
  // rest: return production evn config
  const env = setProductionEnvObject(process.env);
  const validatedEnv = getValidatedProductionEnv(env);
  return getEnvsForDefineConfig(validatedEnv);
}

/* Main */
const validatedProcessEnv = getValidatedProcessEnv() as GetValidatedProcessEnv;

export default validatedProcessEnv;
```

先透過 `dotenv.config();` 來讀取 `.env` 內容（需要更多說明可參考 `dotenv` 套件的[官方文件](https://www.npmjs.com/package/dotenv)）。接著，檢查 `NODE_ENV` 是否有被設定，若無則拋錯（`throw new Error('NODE_ENV should either be development or production');`）。

在這個階段直接拋錯停止，是因為接下來的驗證流程完全取決於「環境是哪一套」。在最基本的條件都不成立的情況下，我認為拋錯、停止執行是比較合理的決定。

在能確認環境的情況下，如果處在開發模式（`isDevelopment`），就透過 `setDevelopmentEnvObject` / `getValidatedDevelopmentEnv` 來取得、驗證 `process.env` 資料；而如果是在正式環境，則進入註解 `// rest: return production evn config` 後的流程。

最後，這個檔案會預設匯出（default export）已經驗證、確保正確性的環境變數資料。

#### config/data/types.d.ts

```ts
import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as WebPackDevServerConfiguration } from 'webpack-dev-server';
import type { EnvForStartApp, EnvForBuildApp } from '@/tool/processEnvValidate';

export type GetValidatedProcessEnv = {
  'process.env': EnvForStartApp | EnvForBuildApp;
};

export type {
  WebpackConfiguration,
  WebPackDevServerConfiguration,
  EnvForStartApp,
  EnvForBuildApp,
};
```

這個檔案收納了與 webpack 有關的型別定義。型別 `EnvForStartApp` 與 `EnvForBuildApp` 分別定義了「開發」與「正式環境」用的環境變數。

特別拆成兩份是因為「不一定每一個變數都會通用到開發/正式環境」上。比如只有在開發模式時，我才需要取得 `process.env.APP_PORT` 來啟動本機伺服器；也只有在正式環境時，我才需要 `process.env.BUILD_DESTINATION` 來設定打包檔的輸出目的地。

#### tool/processEnvValidate.ts

這個檔案的核心任務即是「檢驗 `process.env` 內容」，大方向如下：

1. 透過 `setDevelopmentEnvObject` / `setProductionEnvObject` 將 `process.env` 帶入物件中
2. 透過套件 [superstruct](https://www.npmjs.com/package/superstruct) 檢查開發、正式環境各自的環境變數物件內容是否符合預期
3. 最後，透過 `getEnvsForDefineConfig` 將驗證過的環境變數資料以 `{ "process.env": { [env.key]: [env.value] } }` 的格式回傳出去

```ts
/* Packages */
import { enums, nonempty, string, object, assert, Infer } from 'superstruct';
import url from '@/tool/urlValidate';
import type { StructError } from 'superstruct';

/* Data */
type RawEnv = {
  [key in string]?: string;
};

/** 已被 `superstruct` 檢驗，但為避免在 `getValidatedProcessEnv` 中 reduce `envsForReactApp` 時產生型別衝突，先使用相對寬鬆的型別定義 */
export type ValidatedEnv = Required<RawEnv>;

/** 於本地開發專案時使用的環境變數型別 */
export type EnvForStartApp = Infer<typeof SUPERSTRUCT_VALIDATION_DEV>;

/** 打包專案時使用的環境變數型別 */
export type EnvForBuildApp = Infer<typeof SUPERSTRUCT_VALIDATION_PROD>;

const SUPERSTRUCT_VALIDATION_DEV = object({
  NODE_ENV: enums(['development', 'production']),
  APP_API_URL: url(),
  APP_PORT: nonempty(string()),
});

const SUPERSTRUCT_VALIDATION_PROD = object({
  NODE_ENV: enums(['development', 'production']),
  APP_API_URL: url(),
  BUILD_DESTINATION: nonempty(string()),
});

/* Functions */
function getStructError(error: unknown) {
  const structError = error as StructError;
  const failureArray = structError.failures();
  if (failureArray.length) {
    const failEnvs = failureArray
      .map((failure) => `${failure.key}: ${failure.message}`)
      .join(', ');
    return new Error(`invalid process.env: ${failEnvs}`);
  } else {
    return error;
  }
}

export function getValidatedDevelopmentEnv(envsObject: RawEnv): ValidatedEnv {
  try {
    assert(envsObject, SUPERSTRUCT_VALIDATION_DEV);
    return envsObject;
  } catch (error: unknown) {
    throw getStructError(error);
  }
}

export function getValidatedProductionEnv(envsObject: RawEnv): ValidatedEnv {
  try {
    assert(envsObject, SUPERSTRUCT_VALIDATION_PROD);
    return envsObject;
  } catch (error: unknown) {
    throw getStructError(error);
  }
}

export function setDevelopmentEnvObject(processEnv: RawEnv): RawEnv {
  return {
    NODE_ENV: processEnv.NODE_ENV,
    APP_API_URL: processEnv.APP_API_URL,
    APP_PORT: processEnv.APP_PORT,
  };
}

export function setProductionEnvObject(processEnv: RawEnv): RawEnv {
  return {
    NODE_ENV: processEnv.NODE_ENV,
    APP_API_URL: processEnv.APP_API_URL,
    BUILD_DESTINATION: processEnv.BUILD_DESTINATION,
  };
}

export function getEnvsForDefineConfig(envs: ValidatedEnv) {
  return {
    'process.env': Object.keys(envs).reduce((env: ValidatedEnv, key) => {
      env[key] = JSON.stringify(envs[key]);
      return env;
    }, {}),
  };
}
```

以下為細節補充：

`SUPERSTRUCT_VALIDATION_DEV` 與 `SUPERSTRUCT_VALIDATION_PROD` 分別代表開發及正式環境應該要有的「環境變數鍵」與「值」，即 `NODE_ENV` 只能會是 `development` / `production` 二選一、`APP_API_URL` 必須是有效的 url 內容。而 `PORT` 必須為數字，`BUILD_DESTINATION` 不能為空字串。

執行 `getValidatedDevelopmentEnv` / `getValidatedProductionEnv` 時，會透過 `superstruct` 提供的 [assert()](https://docs.superstructjs.org/api-reference/core#assert) 來檢驗資料內容。此功能會在檢驗失敗時拋出一個 `StructError` 錯誤。而 `getStructError` 的任務就是將錯誤訊息輸出到終端，幫助開發者確認在檢驗過程中「是哪一些資料驗證失敗」。

---

superstruct 有提供[自訂驗證格式](https://docs.superstructjs.org/guides/02-validating-data#custom-values)的功能，而 `./tool/urlValidate` 的任務就是負責「檢查傳入的值是否為有效的 url 格式」：

```ts
import { Struct, define } from 'superstruct';

export function isUrl(value: unknown) {
  if (typeof value !== 'string' && !(value instanceof URL)) {
    return false;
  }
  try {
    return !!new URL(value);
  } catch (e) {
    return false;
  }
}

const urlSuperstructValidate = (): Struct<string, null> =>
  define<string>('url', (value: unknown) => isUrl(value));

export default urlSuperstructValidate;
```

先透過 `isUrl` 來檢查傳入的值究竟是否為 url 類型的資料，再使用 superstruct 提供的 `define()` 來產生此套件可使用的自訂驗證結構（custom validation struct）。

---

最後，當環境變數通過檢驗時，再透過 `getEnvsForDefineConfig` 將資料字串化（`JSON.stringify()`）、打包為如下格式，方便 `Webpack.DefinePlugin` 使用：

```js
{
  'process.env': {
    NODE_ENV: '"development"',
    APP_API_URL: '"https://api.example.com"',
    APP_PORT: '"3000"'
  }
}
```

需要過一道 `JSON.stringify()` 是為了配合官方需求：

> [DefinePlugin](https://webpack.js.org/plugins/define-plugin/): Note that because the plugin does a direct text replacement, the value given to it **must include actual quotes inside of the string itself**. Typically, this is done either with alternate quotes, such as `'"production"'`, or by using `JSON.stringify('production')`.

---

以上就是個人平常在使用的環境變數完整驗證功能，現在來回頭看看 `config/webpack.config.development.ts` 該怎麼使用這包處理好的資料。

### webpack 設定內容

```ts
/* Packages */
import Webpack from 'webpack';

/* Data */
import env from './data/env';
import type {
  WebPackDevServerConfiguration,
  WebpackConfiguration,
  EnvForStartApp,
} from './data/types';

const envForStartApp = env['process.env'] as EnvForStartApp;
const port = +JSON.parse(envForStartApp.APP_PORT);

/* Main */
const webpackDevelopmentConfig: WebpackConfiguration = {
  plugins: [new Webpack.DefinePlugin({ ...env })],
};

export const webpackDevServerConfig: WebPackDevServerConfiguration = {
  port,
  // 設定為 true 代表自動在瀏覽器中開啟本機伺服器
  open: true,
  // 當 webpack 找不到路由對應的資源時，回傳 index.html 檔案；開發 single page application 多半需要開啟此設定
  historyApiFallback: true,
};

export default webpackDevelopmentConfig;
```

以 `APP_PORT` 為例：

從 `./config/data/env.ts` 取出驗證後的環境變數資料 `env` 後，因為我們目前是在開發用的 webpack 設定中，所以先透過型別 `EnvForStartApp` 來描述環境變數的結構。

接著，再透過 [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) 與 [+](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Unary_plus) 將 `envForStartApp.APP_PORT` 轉回數字型別資料。最後，把 `port` 傳入 `webpackDevServerConfig` 中，讓我們透過 `webpack-dev-server` 啟動本機伺服器時，可以透過 `localhost:3000` 來查看專案內容。

至於那個熱騰騰的 `env` ，就把它丟進 `plugins: [new Webpack.DefinePlugin({ ...env })]` 裡面吧，這樣我們就能在 React app 內透過 `process.env.[VARIABLE_NAME]` 直取驗證完畢的環境變數資料了。

### env.d.ts

這真的是最後一步了。還記得那個躺在 `./src` 中的 `.env.d.ts` 嗎？請在這份檔案裡面補上以下內容：

```ts
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly APP_API_URL: string;
    readonly APP_PORT: string;
  }
}
```

這樣就能讓型別資訊支援到 `process.env`。比如當你輸入 `process.env.NODE_ENV` 時，IDE（至少 vs code 有支援）會提示你這個值只有可能是 `development` 或 `production`。

## 總結

雖然前置作業有點長，但好處是這樣嚴格把關 `.env` 內容能確保開發、打包時很難在環境變數這一個環節上出包（忘記餵變數、餵錯資料等等）。

加一點保險，晚上會睡得比較安穩 (っ ´ω`c)
