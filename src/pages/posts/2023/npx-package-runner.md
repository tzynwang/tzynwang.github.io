---
layout: '@Components/SinglePostLayout.astro'
title: 透過 npx 在呼叫套件時省略 node_modules/.bin 前綴
date: 2023-02-24 21:03:42
tag:
  - [Package Manager]
---

## 總結

在把專案 `package.json` 中的 `scripts` 內容都移植到 `Makefile` 時，發現在 make 腳本中如果省略 `npx` 或 `yarn` 的話，就無法執行套件，修正完腳本後查了一下 `npx` 到底做了哪些事情，這篇筆記基本上就是圍繞在這個主題上。

## 筆記

### 什麼是 `npx`

可透過 `npx <package-name>` 來執行套件。如果該套件沒有被安裝，則先進行安裝、再啟動套件。功能與 `npm run <command>`（`npm run-script <command>`）相同。

> [npm blog](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner): Have you ever run into a situation where you want to try some CLI tool, but it’s annoying to have to install a global just to run it once? npx is great for that, too. Calling npx `<command>` when `<command>` isn’t already in your `$PATH` will **automatically install a package with that name from the npm registry for you**, and invoke it.

> [npm official doc](https://docs.npmjs.com/cli/v8/commands/npx?v=true#description): `npx` allows you to run an arbitrary command from an npm package (either one installed locally, or fetched remotely), in a similar context as running it via `npm run`.

```shell
# https://docs.npmjs.com/cli/v8/commands/npm-run-script#synopsis

npm run-script <command> [-- <args>]
# aliases: run, rum, urn
```

而當透過 `npm run <command>` 執行腳本時，`npm run` 會幫忙加上路徑前綴 `node_modules/.bin`：

> [npm official doc](https://docs.npmjs.com/cli/v8/commands/npm-run-script#description): In addition to the shell's pre-existing `PATH`, `npm run` adds `node_modules/.bin` to the `PATH` provided to scripts. Any binaries provided by locally-installed dependencies can be used without the `node_modules/.bin` prefix.

### `node_modules` 中的 `.bin` 資料夾

能透過 `npm run <command>` 執行的內容都會放在這裡：

> [npm official doc](https://docs.npmjs.com/cli/v9/configuring-npm/folders#executables): When in local mode, executables are linked into `./node_modules/.bin` so that **they can be made available to scripts run through npm**. (For example, so that a test runner will be in the path when you run `npm test`.)

> [stackOverFlow](https://stackoverflow.com/a/55600104/15028185): As for the `.bin`, this directory stores all the executables of your `node_modules` for which your project is dependent upon to run. **This allows your project to just 'run' the libraries which are necessary**, for your project, without you having to worry about compiling these files yourself.

### 實際運用

總結：在 `Makefile` 中，如果想要在終端直接執行某些套件（比如 `webpack` 或 `next`），需透過 `npx <package-name>` 或手動連結到 `node_modules/.bin` 來呼叫。

以下列出的三種寫法都能執行 `next dev` 功能：

```make
.PHONY: dev
dev:
	node node_modules/.bin/next dev
```

```make
.PHONY: dev
dev:
	npx next dev
```

```make
.PHONY: dev
dev:
  # this is equivalent to `yarn run next dev`, see https://yarnpkg.com/cli/run#examples
  yarn next dev
```

## 參考文件

- [npm Blog: Introducing npx -- an npm package runner](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner)
- [Yarn: Migrating from npm -- CLI commands comparison](https://classic.yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison)
- [stackOverFlow: Difference between npx and npm?](https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm)
- [stackOverFlow: What is the purpose of .bin folder in node_modules?](https://stackoverflow.com/questions/25306168/what-is-the-purpose-of-bin-folder-in-node-modules)
- [Purpose of the .bin directory within node_modules? What are binaries?](https://stackoverflow.com/questions/55600026/purpose-of-the-bin-directory-within-node-modules-what-are-binaries)
