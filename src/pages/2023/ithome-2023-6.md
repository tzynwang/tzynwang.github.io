---
layout: '@Components/pages/SinglePostLayout.astro'
title: 捨棄 create-react-app 之餘還架了個 astro blog 昭告天下：專案腳本
date: 2023-09-21 13:59:08
tag:
	- [2023鐵人賽]
banner: /2023/ithome-2023-6/clique-images-hSB2HmJYaTo-unsplash.jpg
summary: 在風風火火地把最基礎的畫面與功能做完後，現在你需要一點腳本來啟動他。
draft: true
---

畫面與功能做完後，現在需要一些指令來讓專案在跑起來。而如果一個專案沒有在 README 提到任何啟動資訊，通常工程師會往 package.json 中的 `scripts` 欄位尋找相關提示。而今天會分享一些個人設定 `scripts` 的方法。

## 本文

### 在 package.json scripts 設定腳本

在 [鐵人賽第 4 天](/2023/ithome-2023-4) 有提到，個人習慣在專案的根目錄留一個 `./script` 資料夾，目的是負責收納「啟動、打包專案的腳本」。而為了能在終端輸入 `yarn start` 就觸發啟動、打包流程，我的 package.json `script` 欄位會長這樣：

```json
{
  "name": "ithome-2023",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node -r esbuild-runner/register ./script/start.ts"
  }
}
```

`node -r esbuild-runner/register` 代表「在 node 環境註冊 `esbuild-runner/register` 套件」，然後再執行 `./script/start.ts`。更多關於 esbuild-runner 的說明可參考 [官方 README](https://github.com/folke/esbuild-runner#readme) 內容。基本上，這就是一個幫忙把 `.ts` 檔轉成 `.js`，好讓 Node.js 環境可以順利執行 `.ts` 檔的轉譯工具。

而 `script/start.ts` 的內容如下：

```ts
/* Packages */
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

/* Data */
import devConfig, {
  devServerConfig,
} from './config/webpack.config.development';

/* Functions */
async function runApp() {
  const compiler = webpack(devConfig);
  const devServer = new WebpackDevServer(devServerConfig, compiler);
  await devServer.start();
}

/* Main */
runApp();
```

參考 [webpack-dev-server API](https://webpack.js.org/api/webpack-dev-server/) 以及 [Compiler Instance](https://webpack.js.org/api/node/#compiler-instance) 可得知：沒有餵 callback 給 `webpack` function 時，此功能會回傳一個 `webpack.Compiler` 實例（即上方程式碼中的 `compiler`）。

> If you don’t pass the `webpack` runner function a callback, it will return a webpack `Compiler` instance.

將此實例與 `webpack-dev-server` 專用的 `devServerConfig` 設定檔做為參數來建構一個 `WebpackDevServer` 實例後，得到的 `devServer` 即可透過 `.start()` 來啟動本機伺服器、預覽專案內容。

`script/start.ts` 的任務非常單純，他負責的事情只是「根據開發者餵進來的 webpack 設定」來啟動一個本機伺服器。至於這個本機伺服器「會有哪些行為」，則是透過 `./src/config` 的設定決定。

### 透過 Makefile 設定腳本

除了將腳本寫在 package.json `scripts` 中，還有另外一種選擇，那就是透過 `make` 與 `Makefile`。`make` 是一種[組建自動化工具](https://zh.wikipedia.org/zh-tw/%E7%B5%84%E5%BB%BA%E8%87%AA%E5%8B%95%E5%8C%96)（build automation tool），搭配 `Makefile` 後，開發者可在終端輸入 `make $(target)` 來執行各種已經在 `Makefile` 內設定好的腳本。

以上方的 `yarn start` 為例，其 `Makefile` 版本如下：

```bash
# 開啟本機伺服器來運行此前端專案
.PHONY: start
start:
	node -r esbuild-runner/register ./script/start.ts
```

`.PHONY: start` 代表偵測到 `make start` 指令時，要執行下方的 `node -r esbuild-runner/register ./script/start.ts` 內容。使用 `.PHONY` 能優化效能、也能避免執行 `make` 腳本時撞名（比如資料夾中真的有一個叫做 `start` 的檔案，如果沒有 `.PHONY: start` 的話，就會變成該 `start` 檔案被執行）。

> [gnu.org > 4.6 Phony Targets](https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html): A phony target is one that is not really the name of a file; rather it is **just a name for a recipe to be executed when you make an explicit request**. There are two reasons to use a phony target: to **avoid a conflict with a file of the same name**, and to **improve performance**.

---

個人愛用的安裝腳本如下，先移除既有的 node_modules 資料夾後，再以「不更動 yarn.lock 內容」為前提進行套件安裝。並透過 `--production=false` 確保 `devDependencies` 套件不會被漏掉。

```bash
.PHONY: i
i:
	rm -rf node_modules && \
	yarn install --frozen-lockfile --production=false
```

以上腳本還可改寫為：

```bash
# 移除 node_modules 資料夾
.PHONY: delete-node-modules
delete-node-modules:
	rm -rf node_modules

# 在不更動 yarn.lock 內容的情況下，安裝全部的專案套件
.PHONY: i
i: delete-node-modules
	yarn install --frozen-lockfile --production=false
```

`i: delete-node-modules` 代表「執行 target `i` 之前，先執行 target `delete-node-modules` 的內容」。更多關於 target dependency 的內容可以參考 [Makefile Cheat Sheet](https://bytes.usc.edu/cs104/wiki/makefile/)。

提示：透過 `#` 字開頭的內容都會被視為註解。

> [gnu.org > 3.1 What Makefiles Contain](https://www.gnu.org/software/make/manual/html_node/Makefile-Contents.html): ‘#’ in a line of a makefile **starts a comment**. It and the rest of the line are ignored, except that a trailing backslash not escaped by another backslash will continue the comment across multiple lines.

---

有時候，你可能需要在執行腳本時引用 `.env` 檔案內的變數。先假設 `.env` 內容為：

```bash
# 指定打包後輸出的目的地資料夾
BUILD_DESTINATION=build
```

那麽在 `Makefile` 中，只要加上以下內容就能直接透過 `$(BUILD_DESTINATION)` 來取得 `.env` 中的變數內容（即 `build`）：

```bash
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# 移除打包檔案
.PHONY: remove-build
remove-build:
	rm -f -r $(BUILD_DESTINATION)
```

`ifneq (,$(wildcard ./.env))` 代表「`wildcard ./.env` 回傳的內容是否為空字串」，如果「不是空字串」，則透過 `include .env` / `export` 來「引入、並將其中的變數匯出」，於是開發者可以透過 `$(BUILD_DESTINATION)` 來取得 `.env` 中的內容了。

完整的 syntax 說明可參考官方文件：

- `ifneq` 可查看 [7.2 Syntax of Conditionals](https://www.gnu.org/software/make/manual/html_node/Conditional-Syntax.html)
- `wildcard` 可查看 [4.4.3 The Function wildcard](https://www.gnu.org/software/make/manual/html_node/Wildcard-Function.html)

---

不過，如果想要透過 `Makefile` 來執行 `jest -u`（更新 `snapshots` 內容） 或 `jest path/to/specific/file.test.ts`（指定測試特定檔案）這類需要傳入 command line flag 的腳本時，個人認為 `make` 就比較不直覺了：

```bash
# 執行單元測試
.PHONY: test
test:
	yarn jest $(option)
```

此時需要在終端輸入 `make test option=-u` 或 `make test option=path/to/specific/file.test.ts` 才能滿足效果。

提示：關鍵字 `option` 可換成任意單字，這邊僅是透過 `option` 一詞來將終端機取得的內容轉交給 `make` 而已。

## 結論

使用 `Makefile` 的好處是：能寫註解、可對腳本進行換行排版、簡單幾行 code 就能引用 `.env` 檔的內容。缺點是在執行 `jest` 這類經常搭配 command line flag 的套件時，需要額外透過自訂關鍵字來取得 flag 資料。

大原則是將腳本集中一處管理，選定使用 `scripts` 或 `Makefile` 後，就盡量把專案中所有的腳本都收納在選好的地方、不要再到處散落了。

以上就是個人對 package.json `scripts` 與 `make` / `Makefile` 的經驗分享，感謝你的閱讀 ( •̀ω•́)
