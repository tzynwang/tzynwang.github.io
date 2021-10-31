---
title: JSDC 2021 議程筆記
date: 2021-10-30 12:27:13
categories:
- JavaScript
tags:
---

## 總結
此篇整理了2021 JSDC 議程之相關筆記與自用的延伸閱讀資料，包含：
- The Future of React: 18 and Beyond
- 前端工程師也能搞得懂的區塊鏈
- JS在生成式、演算藝術與NFT的應用
- 窮途末路的SPA，堅持CSR到放棄
- 為什麼許多公司都願意導入Next.js
- JavaScript 模組進化論 - 模組化的演進與實戰
- Memory Leak與你的距離


## The Future of React: 18 and Beyond
### Suspense

> Suspense解決的問題：告訴react要等一個元件**準備好**之後再渲染

```jsx
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

REACT官方文件：[Suspense for Data Fetching (Experimental)](https://reactjs.org/docs/concurrent-mode-suspense.html)

- Suspense lets your components “wait” for something before they can render.
- It's a mechanism for data fetching libraries to **communicate to React** that the data a component is reading is **not ready yet**. 包在<Suspense>元件裡面的目標元件，會在其**準備好之後**才被渲染；參考上方範例，fallback內可以帶入「在目標元件準備好之前」先渲染在畫面上的替代方案（`<h1>Loading profile...</h1>`）
- In the long term, we intend **Suspense to become the primary way to read asynchronous data from components** — no matter where that data is coming from.

```jsx
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```
```jsx
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```
- With Suspense, handling fetching errors works the same way as handling rendering errors — you can **render an error boundary anywhere to “catch” errors** in components below. 可透過error boundary來捕捉錯誤情形，概念類似try catch中的catch(error)
- 關於Error boundaries：可參考REACT官方文件「[Error Boundaries](https://reactjs.org/docs/error-boundaries.html)」
  A class component becomes an error boundary if it **defines either (or both) of the lifecycle methods static `getDerivedStateFromError()` or `componentDidCatch()`**.


### Streaming Suspense SSR

> 解決的問題：改善過去一定要一次到位的SSR（全部都要準備好才會送到前端，快的要等慢的），開始支援Suspense

官方說明：[New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)

- React 18 lets you use <Suspense> to break down your app **into smaller independent units** which will go through SSR steps independently from each other and **won’t block the rest of the app**.
- As a result, your app’s users will **see the content sooner** and be able to **start interacting with it much faster**. The slowest part of your app won’t drag down the parts that are fast. These improvements are automatic, and you don’t need to write any special coordination code for them to work.


### Selective Hydration

> 解決的問題：讓hydration支援Suspense

- Hydration：「REACT掌握那些透過SSR送到前端的HTML內容」←這個過程
  - `hydrate()`: **render a React element** (whose HTML contents were rendered by `ReactDOMServer`)(SSR) **into the DOM** in the supplied container and **return a reference to the component** (or returns null for stateless components).
  - [官方文件](https://reactjs.org/docs/react-dom.html#hydrate)
- Selective Hydration: You **no longer have to wait for all the code to load in order to start hydrating**. React can **hydrate parts** as they’re being loaded. 現在連hydration都可以搭配Suspense


### 從Concurrent Mode到Concurrent Features

> 解決的問題：比起過去，在REACT 18中可以更簡單地測試Concurrent Features

- If you’ve been following our research into the future of React, you might have heard of something called “concurrent mode” or that it might break your app. In response to this feedback from the community, we’ve **redesigned the upgrade strategy for gradual adoption**. Instead of an all-or-nothing “mode”, concurrent rendering will only be enabled for updates triggered by one of the new features. In practice, this means you will be able to adopt React 18 **without rewrites and try the new features at your own pace**.
- 官方說明：[The Plan for React 18](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html)


### useTransition
#### startTransition

> 可將較不重要的state update任務設定交給startTransition處理

{% figure figure--center 2021/jsdc-2021-note/startTransition.png "''" %}

```jsx
import { startTransition } from 'react';

highPriorityTask();

startTransition(() => {
  lowPriorityTask();
})
```


#### isPending

> 回傳的是布林值，其中一種應用方式為搭配控制spinner元件的顯示與否

```jsx
import { useTransition } from 'react';

function myComponent() {
  const [isPending, startTransition] = useTransition();
  // ...
  return (
    <div>
      { isPending && <Spinner />}
    </div>
  )
}
```


### SuspenseList

> 應用情境：畫面上有許多使用者卡片元件需要等待資料載入後才顯示照片，但使用者資料不一定會依照順序備妥（所以圖片顯示的順序也會不同）；但如果將這些使用者卡片元件包在<SuspenseList>裡面，就可以透過修改SuspenseList的參數來控制內部元件的顯示順序（與方式）

```jsx
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

- When multiple components need to fetch data, this data may **arrive in an unpredictable order**. However, if you wrap these items in a SuspenseList, React will not show an item in the list **until previous items have been displayed** (this behavior is adjustable).
- SuspenseList takes two props:
  - `revealOrder` (forwards, backwards, together) defines the **order** in which the SuspenseList children should be revealed. `together` **reveals all of them when they’re ready** instead of one by one. 這個參數決定「揭露」的順序
  - `tail` (collapsed, hidden) dictates **how unloaded items in a SuspenseList is shown**. By **default**, SuspenseList will **show all fallbacks** in the list. `collapsed` **shows only the next fallback** in the list. `hidden` **show no unloaded items**. 這個參數可以設定「是否顯示複數個還沒載入的內容」


### Server Components

優點：
- 減少bundle size，一個需求如果在server side做完，那麼client side component就不需要再載入那些已經在server side做完的任務的套件
- 因為是在server side運行，所以可以運用File system或database等等server環境限定的東西
- code splitting優化

缺點（注意事項）：
- 非同步須遵循REACT的寫法


## 前端工程師也能搞得懂的區塊鏈
### 區塊鏈可以是什麼？
- 虛擬貨幣，比特幣、狗狗幣等等
- 產銷履歷追蹤、帳本（因其不可竄改性）
- 銀行間彼此互相清算

> 但以上提到的這些常見應用，其實各自的技術底層都不相同

{% figure figure--center 2021/jsdc-2021-note/block-chain.png "'不同的技術應用會有對應的BC類型'" %}

分歧點：
- 帳本副本的數量
- 有修改帳本資料權限的人數
- 參與驗證者的對象（完全公開或僅限特定族群）

### 所以（比特幣這類型的）區塊鏈的技術究竟是什麼？
- 本質是P2P網路，並提供了data storage與computing engine（雲端運算能力）；但讓區塊鏈之所以特別的地方在於他還包含以下特性：
  - 去中心化（decentralized）
  - 不可偽造（un-forged）
  - 無法竄改（immutable）
- 綜合以上三點，區塊鏈的特性可總結為「有力、公正、可相信」


> 如何做到「去中心化」
- 透過「Kademlia」這個演算法讓機器之間可以找到彼此、並同步資料
- 透過POW、POS或PBFT等**共識演算法**（Consensus algorithm）來排除想要散播惡意資料的機器


> 如何做到「不可偽造」
- 使用數位簽章（非對稱加密），只有本人可修改
  - 中文維基百科描述[數位簽章（Digital Signature）](https://zh.wikipedia.org/wiki/%E6%95%B8%E4%BD%8D%E7%B0%BD%E7%AB%A0)：又稱公鑰數位簽章，使用了公鑰加密領域的技術，以用於鑑別數位訊息的方法。
  - [Microsoft](https://support.microsoft.com/zh-tw/office/%E6%95%B8%E4%BD%8D%E7%B0%BD%E7%AB%A0%E8%88%87%E6%86%91%E8%AD%89-8186cd15-e7ac-4a16-8597-22bd163e8e96)：數位簽章是一種電子加密驗證圖章，可用於電子郵件、巨集或電子文件等數位資訊。 簽章可以**確認資訊來自簽章者，且未遭到更改**。

> 如何做到「不可被篡改」
- 使用Block Hash Chain來實現：Block與Block之間用Hash fingerprint串接，而fingerprint會包含前一個Block的資訊；所以一旦有人試圖修改，後面的整串Block都會一起掛掉，會被揪出來是在哪一個Block出現修改行動


### 區塊鏈與computing engine
- 因為**公開**與**不可篡改**的技術特徵，故也有了「抗審查」的能力
- 時事題：這也可以幫助確保虛擬寶物的掉寶率真的與營運公告的數據一樣
- 計價邏輯並非過去以使用的VM或container的「數量」來計算，而是改為根據「計算消耗的**時間**」來收費


### 前端工程師與區塊鏈
- 事實上前端開發非常重要，因區塊鏈本身的複雜，故需要前端開發者提供一個相對友善的介面來幫助使用者進行操作
- 區塊鏈的運算還是昂貴的，那麼那些比較沒有那麼重要的運算邏輯，就需要前端工程來介入、協助處理，降低後端的loading


## JS在生成式、演算藝術與NFT的應用
### 名詞解釋（非議程內容）
- 生成式、演算藝術（Generative art）
  - [Wiki](https://en.wikipedia.org/wiki/Generative_art): Generative art refers to art that in whole or in part has been created **with the use of an autonomous system**. An autonomous system in this context is generally one that is **non-human and can independently determine features of an artwork** that would otherwise require decisions made directly by the artist.
- NFT
  - [Wiki](https://en.wikipedia.org/wiki/Non-fungible_token): An NFT is **a unit of data** stored on a digital ledger, called a blockchain, which **can be sold and traded** on digital markets. The NFT can be associated with a particular digital or physical asset (such as a file or a physical object) and a license to use the asset for a specified purpose.
  - [BBC](https://www.bbc.com/news/technology-56371912): NFTs are "one-of-a-kind" assets in the digital world that can **be bought and sold like any other piece of property**, but which have no tangible form of their own. The digital tokens can be thought of as **certificates of ownership** for virtual or physical assets.

### 生成式藝術與互動的常用工具
- 可使用[p5.js](https://p5js.org/)，可搭配[OpenProcessing](https://openprocessing.org/)這個線上IDE進行創作
- p5.js在撰寫上比Canvas API簡單，寫出來的程式碼閱讀性不錯

<iframe src="https://openprocessing.org/sketch/1247384/embed/" width="400" height="400"></iframe>

- [Three.js](https://threejs.org/)：專長3D
- [Pixi.js](https://pixijs.com/)：圖像處理、像素等級的特效效果
- [Paper.js](http://paperjs.org/)：向量操作
- [Phaser.js](https://phaser.io/)：捲軸、小型物理模擬遊戲的製作框架

### 區塊鏈與生成藝術的整合
- [art blocks](https://www.artblocks.io/)，販賣生成式藝術NFT的平台


### 聊天室問答

> 好奇使用程式碼創作藝術時，是如何構思作品主題的，與傳統藝術的創作有哪些異同之處？

- 跟傳統的方式蠻像的，設定初始的主題（e.g. 魚）＋創作手法（e.g.遞迴、材質、粒子模擬）
- 你也可以使用生成式藝術手法思考跟拆解傳統藝術的手段，比如印象派的畫就是：取像像素顏色 → 繪製隨機方向的筆觸 → 在繪製時有一定機率微調色相
- 傳統藝術家創作手法其實就是制定創作系統，但創作系統需要人力重複執行

> 想問哲宇和其他講者怎麼找到最一手的學習資源的，有具體的建議嗎？

- 主要透過Project Base或**黑客松**設定目標後尋找適合的框架，可以追蹤一些國外的主流函式庫的Twitter或電子報、YouTube
- 前往紐約後，也剛好跟很多框架的原始開發者交流，比較容易接觸到第一手資訊

### 個人心得
JSDC 2021最精實的20分鐘，聽完這個議程真的會想要掏錢買講者開的課程

{% figure figure--center 2021/jsdc-2021-note/meet-god.jpeg "''" %}

- [墨雨設計](https://monoame.com/)
- [Hahow上的動態網頁、程式藝術課程](https://hahow.in/@majer?tr=majer)
- [Creative Coding 台灣站](https://creativecoding.in/)
- [YouTube頻道：老闆來點寇汀吧](https://www.youtube.com/c/老闆來點寇汀吧-BossCODINGplease)
- [講者個人平台](https://cheyuwu.com/about)


## 窮途末路的SPA，堅持CSR到放棄

> CSR與SSR不一定壁壘分明，一個網站可以是混合式的rendering

舉例：使用者會頻繁存取到的首頁（或任何熱門功能）就可以透過SSR來處理，而（比如）使用者資料修改、或是使用者在拜訪網站時不會在第一時間去操作的功能，就可以透過CSR配合lazy loading處理

### CSR無法應付的問題
- 首先以SEO角度來看，不是每個搜尋引擎都像Google可以去爬JS生成的內容
- 再來，假設今天我把一篇部落格文章透過FB或LINE分享出去（使用的是Open Graph protocol），而Open Graph protocol抓的是meta data，他不會等JS把網站的內容渲染完畢才去抓資料，那你分享的那個網站連結可能就無法顯示縮圖與內容預覽
  - [The Open Graph protocol](https://ogp.me/): this is a protocol that **enables any web page to become a rich object in a social graph**. For instance, this is used on Facebook to allow any web page to have the same functionality as any other object on Facebook.

### 解決純CSR問題的工具
- Pre-build tool [react-snap](https://github.com/stereobooster/react-snap#readme): enables SEO (Google, DuckDuckGo...) and SMO (Twitter, Facebook...) for SPAs.
- Pre-render tool [netfily](https://docs.netlify.com/), [prerender.io](https://prerender.io/)
  - cache時間的彈性不佳：比如想針對特定內容縮短（或增加）cache時間，但第三方服務對此需求的支援性就沒有那麼好
  - 都不是open source solution，需要花錢
- Hybrid solution: next.js, gatsby.js, express.js
  - express.js是指可以自己架server來處理SSR
  - 「混合要注意的一個地方就是你必須注意現在在寫的是server side component或是client side component」（不明白這句話的脈絡，不曉得該「注意」什麼）
  - 與友討論後補充：next.js是2016年才誕生的解決方案，還有很多地方未臻成熟，使用express.js自己寫一個後端確實是一種處理方式


### 個人心得
整個議程聽起來有點像是一開始在選技術的時候沒有透徹研究CSR的優缺點（以及公司是否能接受這些缺點），比較多是前端開發不想碰後端相關內容所以選了CSR技術，但之後為了處理CSR技術做不到的事情所以開始SSR，血淋淋的教訓 🤔


## 為什麼許多公司都願意導入Next.js

> 關鍵字：大企業會在他們專案的「一部份」頁面導入Next.js，但並非「一整個專案」都會透過Next.js處理

### Next.js解決了CSR的什麼問題
- Google事實上已經可以爬蟲到CSR網站的內容，參考下圖：
  {% figure figure--center 2021/jsdc-2021-note/second-wave-index.png "''" %}
- 但部分網站的內容變化速度非常快，為了確保這些內容可以被爬蟲爬到，還是需要引入SSR
  {% figure figure--center 2021/jsdc-2021-note/csr-ssr.png "''" %}
- Next.js可以針對不同頁面設定不同的render方式
  {% figure figure--center 2021/jsdc-2021-note/hybrid-render.png "''" %}
  而incremental static regeneration此一技術實現了「動態檔案生成」，解決的問題是「避免在每一次bundle時產生過多檔案」
  {% figure figure--center 2021/jsdc-2021-note/incremental-static-regeneration.png "''" %}
- File-based routing：根據資料夾來決定路由，讓code與routing的邏輯不會混在一起


### 圖片優化：使用Next.js的Image元件
- 在各個裝置載入合適尺寸的圖片，比如在行動裝置上，就沒有必要載入2000*2000px的大圖
- 使用WebP或AVIF等壓縮效率更高的編碼來儲存圖片（已經被大部分桌面瀏覽器支援）
- 圖片「預載入」與「延遲載入」：確認哪些圖片先行載入會提升使用者體驗，並反過來說，如果是一開始並非位在viewport中的圖片，就沒有必要馬上載入
- 設置圖片的width與height預留空間，避免過大的reflow
  - 這也會影響到core web vital中cumulative layout shift的數值，若位移的程度越大，使用者體驗的分數就會下滑
  - 如果有設定width與height的話，就會預先將圖片需要的空間保留下來


### webP（非議程內容）
- WebP is **a modern image format** that provides superior lossless and lossy compression for images on the web.
- WebP **lossless** images are **26% smaller** in size compared to PNGs. WebP **lossy images** are **25-34% smaller** than comparable JPEG images at equivalent SSIM quality index.
- 官方文件：https://developers.google.com/speed/webp


### Next.js適合拿來當全端框架嗎？
- 有其風險，需仔細考慮：Next.js是較新的框架，還有他不成熟的部分，API routes的資源較少
- 如果已經有後端服務，可能沒有migrate的必要
- 或許比較適合新開始的中小型專案

### 團隊在引入Next.js前可以考慮的問題
- 原本的SEO不夠用了嗎？
- 真的需要SSR嗎？pre-rendering是否已經足夠？
- 導入Next.js後是否會影響原本的服務（比如影響到原本的商業策略）


## JavaScript 模組進化論 - 模組化的演進與實戰
### 模組化之前遭遇的問題
- 所有的code共用同一個scope，容易意外（被）複寫
- script標籤**引入檔案的順序**就變得非常重要

> 為了解決以上煩惱，IIFE這個概念誕生了

- 透過IIFE實現模組化的概念
- 把scope分開，讓code不會互相影響

> 但IIFE無法解決「引入檔案順序」的問題

- commonJS規範於2009年被提出，最初出現於node.js環境，有達成module export與import的功能
- 可commonJS無法於瀏覽器環境運行，且其「載入」為同步行為，所以還是得確保模組已經「被載入完畢」才可正常運行

### ESM: ECMAScript Module

> 解決了CommonJS與IFEE未處理掉的問題

{% figure figure--center 2021/jsdc-2021-note/module-compare.png "''" %}

- 可實現非同步載入
- 在真正開始執行前會先被解析，會有tree shaking優化


## Memory Leak與你的距離
- 在今天這個議程的情境中，memory指的是負責儲存變數資料的Heap memory
- [Memory Leak](https://en.wikipedia.org/wiki/Memory_leak): In computer science, a memory leak is a type of resource leak that occurs when a computer program incorrectly manages memory allocations in a way that **memory which is no longer needed is not released**. 那些不再使用的資料沒有被好好回收處理掉


### v8執行Garbage Collection的三個階段
- 標記（Mark）：標註哪些記憶體不再被使用
- 清理（Sweep）：釋放那些標記為不再使用的記憶體空間
- 整理（Defragment）：類似Windows的硬碟重組工具，把清出來的空間整理起來，而不是讓那些空間散落在記憶體的各處；但做這件事情的成本非常高，故並不會常常執行（除非空間真的太零碎了）
- v8有兩套GC機制，Major GC負責整個Heap的GC、Minor GC（Scavenge）負責Yong Generation的GC


### The generational hypothesis

> 理論重點：如果一個物件沒有馬上被GC機制從記憶體中回收掉，那麼它就有可能存活很長一段時間

{% figure figure--center 2021/jsdc-2021-note/object-age-based-on-GC-generation-generational-hypothesis.png "'圖片來源：Plumbr'" %}

### Semi-space Design與Minor GC（Scavenge）

{% figure figure--center 2021/jsdc-2021-note/semi-space-design.png "''" %}

- v8引擎將Heap分成兩個區塊：Yong Generation與Old Generation
- 負責Yong Generation的Minor GC將其為兩個部分「From Space」與「To Space」
- 資料都會先堆積在From Space中，而如果有新的資料要加入但From Space空間不夠，v8會掃描From Space裡面所有的內容，把「還有被reference到的資料（reachable）」複製一份到To Space中，並把新資料加入To Space
- v8更新reference資訊，因為那些reachable的內容被複製到To Space中了，需改為ref到To Space的資料
- v8完全清空From Space中的資料，並交換From Space與To Space的順序，意即剛才裝了「被複製一份」以及「新加入的資料」的To Space現在變成From Space了


### 延伸閱讀
- [Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk)
- [V8 Garbage Collector](https://github.com/thlorenz/v8-perf/blob/master/gc.md)
- [Fix memory problems](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Garbage collection in V8, an illustrated guide](https://github.com/lrlna/sketchin/blob/master/guides/garbage-collection-in-v8.md#-sourcesjs)
- [YouTube: Debugging memory leaks - HTTP 203](https://youtu.be/YDU_3WdfkxA)
- [Memory Management Reference](https://www.memorymanagement.org/)


## 鳴謝
{% figure figure--center 2021/jsdc-2021-note/ac-logo.png "''" %}
特別感謝 [Alpha Camp](https://tw.alphacamp.co/) 全額贊助本次JSDC活動之門票 🙏