---
title: Alpha Camp結業專案「Simple Twitter」開發記錄
date: 2021-10-03 13:31:43
tag:
  - [Vue]
---

## 總結

本篇記錄了 Alpha Camp 學期三 8 月班「Simple Twitter」前後端分離協作專案的相關工作心得
個人負責的是前端相關的工作

- 專案本體：[https://tzynwang.github.io/simple-twitter-frontend/](https://tzynwang.github.io/simple-twitter-frontend/)
  - 測試帳號（五選一）：`user1`、`user2`、`user3`、`user4`、`user5`
  - 密碼：一律為`12345678`
- 專案 repo（前端）：[https://github.com/tzynwang/simple-twitter-frontend](https://github.com/tzynwang/simple-twitter-frontend)
- 專案 repo（後端）：[https://github.com/JHIH-LEI/twitter-api-2020](https://github.com/JHIH-LEI/twitter-api-2020)

![專案畫面預覽](/2021/simple-twitter-development-note/project-screenshot.png)

## 介紹

- 「Simple Twitter」前後分離專案的組成為兩位前端與兩位後端開發者，於兩週內進行合作、完成專案
- 專案規格書與測試檔案由 Alpha Camp 提供
- 開發小組需於前 12 天內完成指定規格
- 開發小組可自行決定是否在兩週內的最後兩天挑戰加碼功能

### 指定規格

- 畫面需 100%還原設計稿外觀
- 專案使用者有兩種身分：一般使用者（以下簡稱使用者）與管理者
- 使用者需進行註冊才可進入專案首頁瀏覽推文，首頁會出現「全部的推文」（不問追蹤條件）
- 使用者可新增推文；而僅有管理者可以刪除推文
- 使用者可回應推文、對推文按讚（成為「喜歡的推文」），也可跟隨其他使用者
- 使用者可瀏覽任意使用者的活動記錄（包含該使用者所有發過的推文、回應過的推文與喜歡的推文）
- 使用者可修改自身名稱、封面圖片、大頭照、自我介紹，以及帳號相關設定

### 加碼功能

- 公開聊天室：使用者可在同一畫面進行即時聊天
- 私人訊息：使用者可與特定使用者進行一對一聊天
- 訂閱：一旦訂閱某使用者，在該使用者新增、回應、按讚與進行追蹤動作時皆會收到通知

## 開發之旅

### 組隊

- 協作專案於學期三第六週正式開始，而學期三開始後沒多久就收到前端隊友發來組隊邀約，覺得先定下來也沒什麼不妥，故答應邀請
- 後端隊友則是有先在學生 workshop 以「活動主持人與分享者」的模式下合作過，決定主動發送邀請是因為有個能融洽相處的隊友在合作上會愉快很多，故選擇邀約比較熟稔的同學，而幸運地對方也答應了 ◟(∗ ˊωˋ ∗)◞

### 關於遠端協作

- 若是報告進度、或進行比較小規模的功能討論，小組通常在 slack 上透過文字頻道進行交流（舉例如下）；一旦有結論後就各自回頭完成任務
  - 為了滿足畫面規格，前端請求後端於 response.body 中新增指定資料
  - 前後端相互通知目前的開發狀況，若開發停滯則同時會補充暫停原因，比如等待後端路由推上測試環境、或前端已經完成邏輯但尚在處理 CSS 細節
- 若組員皆還未對問題本身有任何共識、或是遭遇問題起因不明確的 bug，則在 gather 上先進行口頭討論會，待認知一致後再進行開發
  - 在排除加碼功能出現的 bug 時，開發小組基本上會直接在 gather 上透過口說溝通讓彼此儘快了解「現在的問題」以及「我們要解決什麼問題」

### 個人負責任務

- 專案元件拆分規劃
- 專案 RWD 規劃與實作
- 完成下列路由之功能與外觀
  - 使用者註冊：/register
  - 登入：/login
  - 專案首頁：/home
  - 個別推文瀏覽頁：/<@userId>/<@tweetId>
  - 使用者資料頁：/<@userId>
  - \*使用者回覆過的全部內容：/<@userId>/replies
  - \*使用者喜歡的全部推文：/<@userId>/likes
  - 帳號設定：/settings
  - 後台登入：/admin/login

### 實際開發記錄

- 在解析設計稿時發現按鈕與元件之間的 margin 並無明顯規則，可能在部分畫面中的尺寸是 xx、但在其他畫面的尺寸又微調為 yy，為了確定這些不同的尺寸是否為不可變更的設計內容、或開放開發者自行判斷，前後與設計師來回溝通了三四趟，確認開發時有哪些部分開放開發者因地制宜
- 設計稿並未提供小版面設計，故花了四個小時參考正版推特，補完手機與平板裝置的畫面設計
- 個人感受：Alpha Camp 學期三 8 月前端班的 Vue 教材基本上涵蓋了 Simple Twitter 專案指定規格絕大多數的解決方式，在實作指定規格時並未遭遇太多問題
- 幾個印象比較深刻的問題都是在強化使用者體驗以及操作 vuex 中發生，以下列出各點分別說明
  （註：專案開始前就收到學姊建議若有空可先研究 vue-router 與 vuex，故個人對 vuex 的理解與知識基本上都出自 vuex 官方文件、YouTube 教學影片以及 stackOverFlow 討論串，較少使用到 Alpha Camp 提到的技巧）

#### 實作首頁推文懶載入

需求：後端組員提到想看看前端是否能做出「捲動畫面後載入更多推文」的畫面，覺得這需求確實可以提升使用者在操作專案時的好感，故在完成所有功能測試後，開始研究如何實作
思考梳理：

- 要實現的事情：「捲動到畫面底部後，載入更多資料」
- 要透過程式碼處理的工作：「偵測一個元素是否已經被 scroll 到底部」、「前述事件發生後，載入資料」
- 邏輯確認後，開始下關鍵字來尋找如何透過程式碼來實現上述需求；本次使用的關鍵字是`(js) detect scroll to bottom`
  - 參考討論串如下：
  - [Javascript: How to detect if browser window is scrolled to bottom?](https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom)
  - [How to Detect Scroll End with JavaScript?](https://thewebdev.info/2021/06/27/how-to-detect-scroll-end-with-javascript/)
- 在 codePen 中快速實驗討論串提供的程式碼，確認理解沒有出錯後，便開始在專案中實作功能

實作：

- 於元件`data()`中設定每一批載入的推文的數量，本專案設定為一次 10 筆推文
- 從後端收到推文內容後，先保存至 vuex 中，並使用`array.slice`切出第一批推文渲染到畫面上
- 使用`$refs`搭配`scroll`監聽推文容器的滑鼠滾輪事件，一旦推文容器捲到底部，載入下一批推文

其他：

- 實際上只是畫面上有做出懶載入效果，並沒有真的有與後端搭配資料分頁
- 「與後端合作一起處理懶載入」這個想法在規劃需求時不知為何就是沒有出現在腦海中，而在聽到講師點評後才後知後覺意識到前後端合作實際上可以做出「真的」懶載入 ⋯⋯ 感覺自己現階段的想法廣度還是不太夠，需要多跳離問題本身來進行更高層次的觀察

#### 聊天室自動捲至畫面底部

需求：使用者於聊天室發言後，畫面應自動捲至底部讓使用者可以直接看到方才送出的發言
思考梳理：

- 事件發生的時間點是使用者送出聊天內容後，一旦確認訊息發送成功，就將該發言追加到聊天室容器內，並容器捲到底
- 新發出的聊天訊息會被儲存在元件的`data()`中，亦即在 vue lifecycle hook 的`updated()`階段做出捲動行為即可

實作時並沒有遇到什麼困難，且被大量文章提醒需要搭配`this.$nextTick`來確保捲動行為要在資料更新**並且**在 DOM 渲染後才執行，感謝巨人們
參考文章：

- [Vue.nextTick( [callback, context] )](https://vuejs.org/v2/api/#Vue-nextTick)
- [[Day 19] Vue nextTick 處理完成後就換我!](https://ithelp.ithome.com.tw/articles/10240669)

#### vue-router 與 vuex actions

需求：需要在資料夾 router 中的 index.js 檔案執行 vuex module 中的 action，將使用者資料儲存在 vuex module 中
問題：在元件內可以使用`mapActions`來呼叫 vuex action，但在元件以外的場合呢？
關鍵字：`vue router vuex action`

參考了兩篇 vue forum 的討論串，最終使用以下寫法：

```js
// 在src\router\index.js執行import store
import store from '@/store';

// 然後直接呼叫modules中的actions名稱即可
store.dispatch('setUser', data, { root: true });

// 也可採用以下寫法
store.dispatch('authorization/setUser', data);
```

- [How to use Vuex Namespaced Module from router.js?](https://forum.vuejs.org/t/how-to-use-vuex-namespaced-module-from-router-js/59155)
- [Fetching data in beforeRouteEnter with a vuex action](https://forum.vuejs.org/t/vue-2-0-fetching-data-in-beforerouteenter-with-a-vuex-action/1191)

## 反省會

- 在進行元件拆分時尚未充分意識到元件應該主要根據**資料**、而非畫面來進行分拆
  - 錯誤示範：本次專案將導覽列分拆為手機、平板與桌機三種尺寸的版本（導覽列本身就有三種元件）
  - 但事實上既然這個元件要滿足的是「導覽」的功能，那麼要做的事情其實是「透過 props 或純 CSS 搭配 media query 來控制在不同的尺寸下應該顯示哪一種導覽列」，而不是「在不同的畫面尺寸下使用不同的元件」，作三套功能幾乎一致而只有外觀不同的元件並沒有達到 DRY 原則
- 開發第三天進入工作模式後沒有先去看分工表，僅憑印象「這好像是我的？」做掉了兩條本該由前端隊友負責的內容（`/<@userId>/replies`與`/<@userId>/likes`）
  - 教訓：Always read the doc first.
  - 不要過度相信自己的記憶力，文件存在的意義就是為了保存那些討論過的事情
- vuex 太氾濫了，很多時候使用元件內的`data()`搭配`props`與`emit`就可以達成目的；如果沒有在平行元件之間傳遞資料的需求、或是沒有多個元件必須共用同一組資料的前提，那麼基本上就不需要請出 vuex
- CSS 的 utils 還不夠徹底，雖然有達成跨元件樣式共用，但樣式命名應該再更 utils；收到非常寶貴的反饋：「可研究看看 Tailwind 是怎麼解決這個問題的」
  - 錯誤示範：在設計稿中「推文」的樣式基本上在首頁、單一推文頁與個人資料頁都是一致的，但開發時我採用`.icon-text-wrapper`作為樣式名稱，但既然想要讓樣式共用的話，在命名上就應該更有辨識度，比如改為`.avatar-round`、`.ml-15`與`.mt-10`等組合

## 專案結業收穫

- 並不是寫了 media query 就代表做好 RWD，即使是在同一個 break point 下，前端工程師依舊需要考慮在該 break point 下的畫面尺寸的變動（桌機也會有桌機自己的 RWD）
- 可研究看看「virtual scrollbar」，在可視區範圍以外的資料是可以不用保留的
- 很慶幸在正式開始工作前就能得到珍貴的前後分離且從零開始開發的經驗，實際動手做了一次才知道哪邊有坑、下一個專案在哪些部分可以更好 ٩(ˊᗜˋ\*)و

## 同組成員心得

- [（後端隊友）Alicia: Twitter 專案回顧](https://alicialin2020.medium.com/twitter%E5%B0%88%E6%A1%88%E5%9B%9E%E9%A1%A7-c1aec47f0afa)
- [（前端隊友）Raven: Simple Twitter 專案反思](https://ravenera0317.medium.com/simple-twitter-%E5%B0%88%E6%A1%88%E5%8F%8D%E6%80%9D-c798eb8db8af)
