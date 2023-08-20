---
layout: '@Components/pages/SinglePostLayout.astro'
title: 「電影清單（Vue版本）」技術記錄
date: 2021-06-17 14:13:19
tag:
  - [Vue]
  - [JavaScript]
  - [CSS]
---

## 總結

專案網址：[https://tzynwang.github.io/vue-movie-list/](https://tzynwang.github.io/vue-movie-list/)
根據[白板 JavaScript 版本的電影清單](https://tzynwang.github.io/ac_practice_2-2_movie_list/)，以 Vue 框架重現外觀、分頁與搜尋功能（本篇筆記發布時尚未實作出切換顯示模式與根據電影主題進行篩選的功能）

## 環境

```
Vue.js: 2.6.14
os: Windows_NT 10.0.18363 win32 x64
```

## 筆記

### HTML 部分

<script src="https://gist.github.com/tzynwang/a7bb3f86e1283060074132e1415dbd66.js"></script>

- `<a class="nav-link" @click="updateAppState(page)" :href="`#/${page}`">{{ page }}</a>`

  > Alpha Camp：在 HTML 裡面，本來就可以用#針對同一頁面的區部內容下錨點，以前你可能只看過#all 這樣的寫法，但**在前端框架裡有特殊的路由設計**，會**加上斜線寫成#/all**，可以再搭配**前端路由**去做變化。之後講到前端路由時會進一步說明，這邊請你先跟著做。

  搜尋課程內容後看來`#/${page}`似乎要搭配 Vue Router 才能發揮完整功能，本次練習中先照抄

- `<input type="text" id="userInput" @change="getRawInput()" @keyup.enter="updateAppState('search')">`
  `@change="getRawInput()`：在 change Event 發生時觸發 Vue methods `getRawInput()`；而根據[MDN 說明](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)，對`<input type="text">`來說，change Event 會在元素失去焦點的時候觸發（MDN: **When the element loses focus after its value was changed**, but not committed (e.g., after editing the value of `<textarea>` or `<input type="text">`)）
  `@keyup.enter="updateAppState('search')`：在放開 Enter 鍵後觸發 Vue methods `updateAppState('search')`
- `<div class="card" :style="{ backgroundImage: 'url(' + movie.image + ')' }">`：直接將電影海報設定為`<div>`背景，搭配 CSS 的:hover pseudo-class 做出移動後放大的效果
- `<input type="checkbox" class="hide-input" :id="movie.id" @change="addFavorite(movie.id)" :checked="movie.favorite">`與`<label :for="movie.id"><i class="bi" :class="{ 'bi-star-fill': movie.favorite, 'bi-star': !movie.favorite }"></i></label>`：使用`<input type="checkbox">`搭配 change Event 觸發「將電影加入最愛清單」的功能；並根據 movie.favorite 狀態控制 CSS class，決定顯示空心或實心的星星圖示
- pagination 部分：直接透過`:class="{ active: page === currentPage }"`控制要帶有 active class 的分頁`<li>`

### JavaScript 部分

<script src="https://gist.github.com/tzynwang/ca8dc67f61b1f807aaeac29cff836a7c.js"></script>

#### main.js

- `async created()`：在 Vue instance 的`created`階段從 localStorage 撈取 movies 資料／若無則進行 fetch 後建立 movies 資料；需要加上 async/await 確保 fetch 流程結束，再進行 localStorage 相關的操作
- `updateAppState()`：`this.currentPage = 1`是為了確保在 home/favorite 之間切換時不會造成無法顯示內容的問題（例：於 home 第 7 頁進入 favorite，若 currentPage 沒有重置的話，computed 中的`moviesByPage()`撈取 favorite 為 true 的電影陣列不一定有到 7 頁長，故無法正確顯示 favorite 頁面）
- `paginationArray()`：使用`Math.ceil()`進行無條件進位
  補充：本次練習沒有用到，不過處理無條件捨去的`Math.floor()`可為`~~`替代
  [What is the “double tilde” (~~) operator in JavaScript?](https://stackoverflow.com/questions/5971645/what-is-the-double-tilde-operator-in-javascript)
  [What does ~~ (“double tilde”) do in Javascript?](https://stackoverflow.com/questions/4055633/what-does-double-tilde-do-in-javascript)
- `watch: movies`：監控 this.movies 資料的變化，資料變化後需更新 localStorage 中儲存的 movies 資料

#### config.js 衍伸筆記

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="Charlie7779" data-slug-hash="YzZdmWE" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="object undefined this">
  <span>See the Pen <a href="https://codepen.io/Charlie7779/pen/YzZdmWE">
  object undefined this</a> by Charlie (<a href="https://codepen.io/Charlie7779">@Charlie7779</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

1. 問：在呼叫`URL2.INDEX_URL`與`URL2.POSTER_URL`的時候，得到的內容分別是`undefined/api/v1/movies/`與`undefined/posters/`，為何`this.BASE_URL`的值會是`undefined`，而不是定義好的`https://movie-list.alphacamp.io`？
   答：沒有在 function 內呼叫`this`的話，`this`會是目前執行環境的`ThisBinding`，（若是在瀏覽器環境的話）`this`就會是`window`；而`window`中沒有`BASE_URL`，自然會回傳`undefined`

1. 問：第三個 function `POSTER_URL()`沒有`get`關鍵字，在呼叫的時候會直接回傳`POSTER_URL() { return this.BASE_URL + "/posters/"; }`，可為什麼會是回傳一整串字串，而不是只有`return`後的內容`this.BASE_URL + "/posters/"`？
   答：`POSTER_URL()`只是一個普通的 function，寫成`document.querySelector("#URL1 .POSTER_URL").innerHTML = URL1.POSTER_URL`並沒有執行它，改成`document.querySelector("#URL1 .POSTER_URL").innerHTML = URL1.POSTER_URL()`就正常了；只有`URL1.POSTER_URL`的話就跟`POSTER_URL.valueOf()`的結果一樣

1. 問：get 的用意？
   答：getter 其實就相當於`POSTER_URL()`，就是你 read 此 property 時，會執行此 function
   [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get): The `get` syntax binds an object property to a function that will be called when that property is looked up.

```js
// 使用getter
const obj = {
  log: ['a', 'b', 'c'],
  get latest() {
    if (this.log.length === 0) {
      return undefined
    }
    return this.log[this.log.length - 1]
  }
};

console.log(obj.latest) // expected output: "c"
```

```js
// 不使用getter，直接執行obj.latest()
// 注意與上方的程式碼差在latest後有無()
const obj = {
  log: ['a', 'b', 'c'],
  latest() {
    if (this.log.length === 0) {
      return undefined
    }
    return this.log[this.log.length - 1]
  }
};

console.log(obj.latest()) // expected output: "c"
```

### CSS 部分

<script src="https://gist.github.com/tzynwang/8081cf997807c7bbca6e0fb292c299a7.js"></script>

- 需注意的部分：若要做出滑鼠 hover 後背景圖片放大的效果，就不可使用`background-size: container;`或`background-size: cover;`，必須使用百分比來控制背景圖片尺寸；參考討論串：
  [Transition on background-size doesn't work](https://stackoverflow.com/questions/31718598/transition-on-background-size-doesnt-work)
  [Background-size transition not work in Chrome](https://stackoverflow.com/questions/37879221/background-size-transition-not-work-in-chrome)
  > The reason why this is not working is that background-size is not animatable (or at least shouldn't be) when using a keyword such as `cover`, `contain` or `auto`. Keyword values are not animatable.

## 補充參考文件

- [error Unnecessary use of boolean literals in conditional expression no-unneeded-ternary](https://stackoverflow.com/questions/42705930/error-unnecessary-use-of-boolean-literals-in-conditional-expression-no-unneeded)
- [電影清單（Vue 版本）專案原始碼](https://github.com/tzynwang/vue-movie-list)
