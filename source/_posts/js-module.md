---
title: 在前端 React APP 專案中混用 ESM 與 CommonJS
date: 2022-03-30 20:16:11
categories:
  - [webpack]
tags:
---

## 總結

記錄一下如何設定 webpack 才能允許在專案中混用 EMS 與 CommonJS 的模組匯入、匯出語法
錯誤訊息：`Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'`

## 版本與環境
```
webpack: 5.64.4
```

## 筆記
### ESM, CommonJS (Node.js)

<script src="https://gist.github.com/tzynwang/1993d3b58216f442cfeea059bf5a5ef1.js"></script>

- ESM: `import`, `export`
- CommonJS (Node.js): `require`, `module.exports`
- ES6 modules are **automatically strict-mode** code, even if you don’t write `"use strict";` in them. 模組內的程式碼一律預設為 strict mode

### webpack 處理方式

<script src="https://gist.github.com/tzynwang/be7ff3ea4f3bf4b6beeacbc8acc90385.js"></script>

- 第19行：追加 `sourceType: "unambiguous",`


## 參考文件
- [webpack: import + module.exports in the same module caused error](https://stackoverflow.com/questions/42449999/webpack-import-module-exports-in-the-same-module-caused-error)
- [babel: Misc options/sourceType](https://babeljs.io/docs/en/options)
- [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ES6 In Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
- [v8 dev: JavaScript modules](https://v8.dev/features/modules)