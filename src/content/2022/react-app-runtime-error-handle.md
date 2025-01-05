---
title: 2022 第24週 學習筆記：在 React App 中處理錯誤情境
date: 2022-06-18 10:00:44
tag:
- [JavaScript]
- [React]
---

## 總結

記錄一下在與同事討論中歸納出 React App 三種層次的錯誤，並這三種錯誤分別有哪些可對應的手段

## 筆記

### 錯誤的層次

![level of error](/2022/react-app-runtime-error-handle/errors-in-three-phase.png)

- API
  - 不論是 4xx 或是 5xx 類型的錯誤，都可以在 React App 中透過 try catch 的形式來對應
  - 有捕捉到的話，基本上不會（也不應）造成整個 React App 掛掉
- React APP
  - 以公司專案來舉例：因有在 React App 中額外嵌入第三方客服服務的內容，這個服務本身也可以當做是一種提示；假設在使用者嘗試打開專案看到畫面一片空白，但第三方客服對話框有出現在畫面角落時，就代表全部的 scripts 已經載入＋解析完成 --> 客戶端有拿到整個 html 檔案，但 React App 並沒有成功被啟動
  - 上述 React App 沒有成功被啟動的常見原因：更版，但客戶端仍然吃到快取中的內容導致 React App 死去；解決方案就是清掉快取、或是用無痕模式開啟 React App
  - 補充：雖然在透過 webpack 打包時可以對檔案名稱加上 hash 來避免吃到快取，但 index.html 很難透過 hash name 來迴避快取陷阱
- scripts 以上
  - 網路環境太糟，導致檔案載入不完全：工程師沒辦法幫上太多的忙，請客戶換個環境再重整一次試試
  - 客戶端的瀏覽器版本沒有即時更新，導致測試時雖然一切暢通，但仍然有可能在客戶端出現問題；一樣，工程師對此類錯誤沒辦法幫上太多的忙 (›´ω`‹ )

### 對應手段

- 使用 React Error Boundaries 來捕捉整個 React App 中出現的錯誤
  - 可在 Error Boundaries 中選擇將錯誤訊息顯示在畫面上，這樣只要看到畫面就可以分辨是哪一個層次的錯誤
- 除了透過 try catch 直接捕捉之外，也可在 catch block 將錯誤訊息送至收集錯誤用的 API ，或觸發 GA 事件
  - 此方法可以捕捉到「還未被人發現，但已經潛伏在 App 中的錯誤」（或許是還沒有被觸發，但這個錯誤已經存在了）
  - 承上，除了直接一個一個修改現行程式碼中的 try catch 內容，也可以透過 decorator 的形式來追加 error handling 用的補丁內容
- 使用獨立的頁面來觀測 React App 的存活狀態
- 使用 `GlobalEventHandlers.onerror` 搭配 `location.reload()` 達成「監聽到錯誤時，直接重新整理整個畫面」 ~~F5 治百病~~

## 參考文件

- [When does parsing HTML DOM tree happen?](https://stackoverflow.com/questions/34269416/when-does-parsing-html-dom-tree-happen)
- [The Chromium Projects: The Rendering Critical Path](https://www.chromium.org/developers/the-rendering-critical-path/)
- [MDN: GlobalEventHandlers.onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)
- [MDN: location.reload()](https://developer.mozilla.org/en-US/docs/Web/API/Location/reload)
- [Understanding JavaScript decorators](https://blog.logrocket.com/understanding-javascript-decorators/)
