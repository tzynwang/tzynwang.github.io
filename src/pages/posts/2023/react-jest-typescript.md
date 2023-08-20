---
layout: '@Components/SinglePostLayout.astro'
title: 在不使用 create-react-app 的情況下為 TypeScript React 專案設定 jest
date: 2023-04-23 20:11:02
tag:
  - [React]
  - [Test]
---

## 總結

如題，記錄一下在沒有使用 `create-react-app` 建立 React 專案時，應如何安裝、設定 `jest` 來測試使用 TypeScript 的 React 專案。

## 筆記

### 套件

安裝清單如下：

- `@types/jest`: 此套件為第三方維護，jest 版的 Type Definitions 套件為 `@jest/globals`，詳細差異說明可參考 [官方文件](https://jestjs.io/docs/getting-started#type-definitions)
- `jest`
- `jest-environment-jsdom`: 為了要在 jest 跑測試時可以使用瀏覽器環境獨有的 API，需安裝此套件
- `ts-jest`: 因為本專案沒有使用 `babel`，那麼另外一個選項就是 `ts-jest` 了
- `ts-node`

指令懶人包：

- npm: `npm install --save-dev @types/jest jest jest-environment-jsdom ts-jest ts-node`
- yarn: `yarn add --dev @types/jest jest jest-environment-jsdom ts-jest ts-node`

### jest.config.ts

在終端執行 `jest --init` 建立設定檔：

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // 下面這行設定代表各測試檔案中的路徑 @/jest.config 會指向根目錄的 jest.config.ts 檔案
    '@/jest.config': '<rootDir>/jest.config.ts',
  },
  transform: {
    // 下面的設定讓 jest 能支援測試 .tsx 與 .ts 類型的檔案
    '^.+\\.tsx?$': ['ts-jest', {}],
    '^.+\\.ts?$': ['ts-jest', {}],
  },
  globals: {
    SOME_GLOBAL_VARIABLE:
      '可以在 jest.config.ts 中的 config.globals 設定全域變數',
  },
};

export default config;
```

接著就可在各處測試檔案中引用 `jestConfig` 了：

```ts
import jestConfig from '@/jest.config';

describe('Some unit tests for a function', () => {
  test('to test...', () => {
    const GLOBAL_VARIABLE = jestConfig.globals?.SOME_GLOBAL_VARIABLE as string;
    // do the test...
  });
});
```

### 指令

本專案使用 `Makefile` 管理腳本，執行 jest 測試時的指令如下：

```bash
.PHONY: test
test:
  npx jest --config=jest.config.ts
```

在終端輸入 `make test` 就能透過 jest 執行測試了。

## 參考文件

- [JEST: Using TypeScript via `ts-jest`](https://jestjs.io/docs/getting-started#via-ts-jest)
- [JEST: Configuring Jest](https://jestjs.io/docs/configuration)
