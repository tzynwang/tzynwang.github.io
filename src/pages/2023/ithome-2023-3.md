---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：安裝套件
date: 2023-09-18 08:11:49
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-3/rizki-rama28-cXrVvHZO7Lo-unsplash.jpg
summary: 分享個人如何決定套件的安裝版本。以及當安裝套件時的 warning 噴滿整個終端時，除了無視、還可以透過 overrides/resolutions 來嘗試解決掉這些警告。
draft:
---

環境已經確保，可以來~~做點比較像樣的事情~~安裝套件了。

## 本文

### 安裝套件

安裝時，建議根據套件在專案中發揮的功能來決定要分發到 `dependencies` 或是 `devDependencies` 欄。

對於前端 react 專案來說不可或缺的套件（比如 `react` `webpack` 等）會使用 `npm install react` `yarn add react` 來將其歸納到 `dependencies` 中。而輔助類型的套件（比如 `@types/react` `jest` 等）則透過 `npm install @types/react -D` `yarn add @types/react -D` 把套件放到 `devDependencies` 下。

提醒：歸類在 `devDependencies` 下的套件在終端環境設定為 `--production=true` 時，不會被安裝。比如對以下 package.json 設定執行 `yarn --production=true` 時，專案的 `node_modules` 中不會有 `@types` `typescript` 這兩個套件的內容。

```json
{
  "name": "ithome-2023",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.21",
    "typescript": "^5.2.2"
  }
}
```

補充：個人安裝套件的原則是「遇到需求再裝」，比如在專案最初期（連開發畫面都還沒有）時，package.json 中只會有 `react` `react-dom` `@types/*` 這些東西。到了有畫面的階段，才會來安裝 `webpack` `webpack-cli` `webpack-dev-server` 等套件來跑本機伺服器來查看開發結果。理由是「確保每一次都是在安裝專案真正用得到的套件」，避免冗余。

### yarn? npm?

過去在處理 monorepo 類型專案時，曾經因為 `npm` 在路徑解析上踩到坑所以改用 `yarn` 來進行套件管理。且因為 `yarn` 支援平行安裝（parallel installation）的緣故，在安裝套件時的速度表現會比 `npm` 好。故個人目前在開啟新專案時，會偏向使用 `yarn` 來管理套件。

關於 `npm` 與 `yarn` 的比較討論可參考 [Stack Overflow: What is main difference between yarn and npm? [closed]](https://stackoverflow.com/questions/50278553/what-is-main-difference-between-yarn-and-npm)

### 如何決定套件版本

如果是 side project 則根據當下需求選擇最新、或是想要研究的套件版本即可。但在開啟一個全新的公司專案時，個人會考慮以下事項：

- 主幹套件盡量與公司的其他前端專案一致，讓工程師在維護不同專案時，不需要再花時間研究套件在不同版本之間的功能與 syntax 差異
- 除非有強烈理由（例：套件嚴重漏洞、或使用套件的專案本身也準備進行 breaking change），否則在升級套件時，會避免升級到含有 breaking change 的版本
- 升級套件前，盡量找機會閱讀人家的 changelog，確認目前有使用到的功能是否會被升級影響（使用方式、syntax 都算）
- 如果還有餘裕，翻一下套件的 GitHub issue 看看該版本是否有非預期災情、或是若該套件本身就有提供 CodeSandbox 等線上試玩時，先去試玩區點點看平常在用的功能是否一切安好

### 處理 incorrect peer dependency 警告訊息

當套件越裝越多、彼此間的依賴越來越錯綜複雜時，有可能會在安裝新套件時時看到以下警告訊息：

```bash
warning " > package-A@1.0.0" has incorrect peer dependency "package-B@2.0.0".
```

意即 `package-A@1.0.0` 依賴的 `package-B` 版本與現行指定安裝的版本有所出入。此 `package-B` 可能沒有直接出現在目前專案的 package.json 的 `dependencies` 或 `devDependencies` 中，但可能被 `dependencies` 或 `devDependencies` 囊括的套件依賴。

因為只是警告而非錯誤，所以專案還是可以繼續開發、運行（可參考 [Stack Overflow: When installing packages with Yarn, what does "incorrect peer dependency" mean?](https://stackoverflow.com/questions/42361942/when-installing-packages-with-yarn-what-does-incorrect-peer-dependency-mean)）。但如果想要處理掉這些警告的話，可以在 package.json 中透過 (npm) `overrides` (yarn) `resolutions` 欄位來指定特定套件的版本。比如：

```json
{
  "name": "ithome-2023",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "package-A": "1.0.0",
    "package-C": "1.2.0"
  },
  "resolutions": {
    "package-B": "1.0.0"
  }
}
```

(使用 npm 的朋友請將上方 `resolutions` 換成 `overrides`)

透過 `resolutions` `overrides` 指定特定套件的版本後，再執行 `yarn` / `npm i` 即可。

更多應用可參考官方文件：

- [yarn: Selective dependency resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/)
- [npm Docs: overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json?v=true#overrides)

## 總結

本日完成內容：根據套件功能將其安排至 `dependencies` 或 `devDependencies` 中，並知道可以透過 `resolutions` `overrides` 來指定依賴套件之版本。
