---
title: Chrome Dev Summit 2021 keynote 筆記
date: 2021-11-04 11:13:16
tag:
  - [Browser]
  - [CSS]
---

## 總結

記錄一下 CDS 2021 keynote 提到的一些新東西與自用的延伸閱讀資料

<iframe width="560" height="315" src="https://www.youtube.com/embed/Df2U9-R-OJs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Cross-browser Compatibility

> 簡單總結：這一節大部分是在聊因應武漢肺炎讓遠距辦公以及其對應的視訊會議、線上協作崛起，提升了 cross-browser compatibility 的重要程度（畢竟在遠端工作的情況下，體驗良好的網路協作服務確實會提升工作效率）

### Compat 2021

> 簡單總結：各家瀏覽器在今年致力解決下列五種跨平台相容性問題，分別是 CSS flexbox、CSS grid、CSS transforms、`position: sticky`與`aspect-ratio`；行動統稱為「Compat 2021」。

- Browser venders works together to fix the top five **browser compatibility pain points** for web developers. The areas of focus are CSS flexbox, CSS Grid, `position: sticky`, `aspect-ratio`, and CSS transforms.
- The goal in 2021 is to **eliminate browser compatibility problems** in five key focus areas so developers can confidently build on them as reliable foundations. This effort is called **#Compat 2021**.

### Photoshop's journey to the web

> 簡單總結：除 WebAssembly 外，也因為 file system access handles API 的導入，PS 才有辦法處理「使用者編輯影像時需要將資料從硬碟拉到 memory」這一需求

- The simple power of a URL is that anyone can click it and instantly access it. **All you need is a browser.** There is no need to install an application or worry about what operating system you are running on. For web applications, that means users can have access to the application and their documents and comments. 不再需要額外安裝軟體，打開瀏覽器即可開始工作、協作
- This makes the web the ideal **collaboration platform**, something that is becoming more and more essential to creative and marketing teams.
- Given how large Photoshop documents can be, a critical need for Photoshop is the ability to **dynamically move data from on-disk to in-memory** as the user pans around. On other platforms, this is accomplished usually through memory mapping via `mmap`, but this hasn't been performantly possible on the web—that is until origin private [file system access handles](https://web.dev/file-system-access/#accessing-files-optimized-for-performance-from-the-origin-private-file-system) were developed and implemented as an origin trial!

## Privacy

### Purpose-built API

> 簡單總結：過去通常是透過第三方 cookie 在取得使用者相關資訊，但瀏覽器沒有辦法分別這些資料會被拿來改善使用者體驗，或是拿去執行非預期行為（比如 cross-site tracking），而 purpose-build API 旨在解決上述問題，確保使用者的資料**不會被應用在非預期的場合**

- (04:50) What we mean by building **purpose-build APIs**? Many of the use cases (advertising, fraud detection, identity or customized content) were never really build into the web platform but layered over it using general purposed technologies like third-party cookies. The browser has no way to tell whether you're using third-party cookies for something helpful, like providing a customized experience or keeping a user logged in, or for cross-site tracking. By **designing APIs for each specific use case**, we can **ensure appropriate privacy protections**, give people more useful controls, and ideally, make each API better at what it does over time.
- Develop replacement solutions to support web use cases and business models **without enabling users to be tracked across sites**, and avoiding cross-site tracking users aren't aware of. 合法地取用使用者的資料，避免使用者資料被濫用、惡意使用
- Phase out support for third-party cookies when new solutions are in place.

### "User-Agent Reduction" origin trial

> 簡單總結：User-Agent Reduction 此概念（以及實作上使用 User-Agent Client Hints 此技術）旨在解決過去 User-Agent string「提供了太多使用者瀏覽環境相關資訊、且這些資料基本上沒有隱私性」的問題

- User-Agent Reduction is an effort to **reduce passive fingerprinting surfaces** by reducing the information in the User-Agent (UA) string to only the browser's brand and significant version, its desktop or mobile distinction, and the platform it's running on.
- Currently, the UA string is **shared on every HTTP request** and **exposed in JavaScript to all resources loaded by the browser**. It contains significant information on the browser, the platform it's running on, and its capabilities.
- User-Agent Client Hints (UA-CH) can provide the same information as the full UA string, while allowing sites to **only request the UA information that they need**.

## Core Web Vitals

> 簡單總結：CWV 除了過去的金三角（Loading Performance、input responsiveness 與 visual stability）以外，預計導入兩組新的 vitals，「overall responsiveness」與「smoothness」

- Overall responsiveness: with this new metric we plan to expand that to capture the **full event duration**, from initial user input until the next frame is painted after all the event handlers have run. 過去只有記錄「網頁載入後，使用者可以開始與網頁進行互動的第一個時間點」，而 overall responsiveness 則是會觀測「網頁對使用者一連串互動的反應時間」（從點狀變成帶狀觀測）
- smoothness: you've probably experienced pages that **"stutter" or "freeze" during scrolling or animations**. We like to say that these experiences are **not smooth**. To address these types of issues, the Chrome team has been working on adding more support to our lab tooling for animation detection, as well as making steady improvements to the rendering pipeline diagnostics within Chromium. 預計導入「網頁動畫與捲動時畫面的流暢程度」作為 CWV 的新檢查要素

### Audit User Flows in DevTools

> 簡單總結：DevTools 開始支援記錄使用者一連串的網頁操作行為了

- (32:57) In the past, we could **only measure the performance of each page separately**, but think about how much more we could learn about the overall user experience by measuring every action and navigation in between. We're glad to announce we've rolled out **support for user flows in Lighthouse**, which will only make it easier to diagnose performance issues within a user journey and get suggestions for how to improve.

## New Responsive

### Container query

> 根據親代容器（而非整個 viewport）的寬度來進行樣式響應

- Container queries provide a much more dynamic approach to responsive design. This means that if you put this card component in a sidebar or hero section or within a grid inside of the main body of a page, **the component itself owns its responsive information** and sizes according to the container, not the viewport.
- This requires the `@container` at-rule This works in a similar way to a media query with `@media`, but instead, `@container` **queries the parent container** for information rather than the viewport and user agent.

  ```css
  .card {
    contain: size layout;
  }

  @container (max-width: 850px) {
    .links {
      display: none;
    }

    .time {
      font-size: 1.25rem;
    }

    /* ... */
  }
  ```

### Scroll-timeline

> 簡單總結：未來有機會透過原生 CSS 來根據捲動行為設定動畫表現

- [CSS Working Group Editor Drafts](https://drafts.csswg.org/scroll-animations-1/): A scroll timeline is an `AnimationTimeline` whose time values are determined not by wall-clock time, but **by the progress of scrolling** in a scroll container.

### Size-adjust property

> 簡單總結：讓不同字型之間的最後表現出來的高度維持一致

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="WNpzRKd" data-preview="true" data-user="web-dot-dev" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/web-dot-dev/pen/WNpzRKd">
  64px font picker</a> by web.dev (<a href="https://codepen.io/web-dot-dev">@web-dot-dev</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

- As a web font loads, you can now adjust its scale, to normalize the document font sizes and **prevent layout shift when switching between fonts**.
- To improve font rendering, a great technique is font swapping. Render a quick-loading system font to show the content first, then swap that with a web font when the web font finishes loading. This gives you the best of both worlds: the content is visible as soon as possible, and you get a nicely styled page without sacrificing your user's time to content. The problem however, is that sometimes when the web font loads, it shifts the entire page around since it presents at a **slightly different box height size**. 不同的字型儘管設定了一樣的表現尺寸，但他們最後呈現在畫面上的高度依舊各有差距；在使用 font swapping 加快內容載入的情況下，有個問題就是「先使用預設字型顯示內容，待自訂的字體載入完畢後再換成該字體，但在切換字體的過程中因為各字型的高度不同造成 layout shift（而`size-adjust`就是為了要解決這個問題）

### Accent-color

> 簡單總結：讓瀏覽器自動處理 checkbox、radio input 的核取/背景對比色

![accent color](/2021/cds-2021-note/accent-color.png)

- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color): The `accent-color` CSS property **sets the color of the elements accent**. An accent appears in elements such as `<input>` of `type="checkbox"`, or `type="radio"`.
- [MDN](https://developer.mozilla.org/en-US/docs/Glossary/accent): An accent is a **typically bright color** that contrasts with the more utilitarian background and foreground colors within a color scheme. These are present in the visual style of many platforms (though not all). On the web, an accent is sometimes used in `<input>` elements for the active portion of the control, for instance **the background of a checked checkbox**.

## 參考文件

- [Compat 2021: Eliminating five top compatibility pain points on the web](https://web.dev/compat2021/)
- [Compat 2021 Dashboard](https://wpt.fyi/compat2021)
- [Photoshop's journey to the web](https://web.dev/ps-on-the-web/)
- [The Privacy Sandbox (Official Site)](https://privacysandbox.com/)
- [What is the Privacy Sandbox?](https://developer.chrome.com/docs/privacy-sandbox/overview/)
- [User-Agent Reduction origin trial](https://developer.chrome.com/blog/user-agent-reduction-origin-trial/)
- [An experimental responsiveness metric](https://web.dev/responsiveness/)
- [Towards an animation smoothness metric](https://web.dev/smoothness/)
- [Record, replay and measure user flows](https://developer.chrome.com/docs/devtools/recorder/)
- [Responsive to the container](https://web.dev/new-responsive/#responsive-to-the-container)
- [CSS size-adjust for @font-face](https://web.dev/css-size-adjust/)
- [CSS accent-color](https://web.dev/accent-color/)
- [Chrome Dev Summit 2021: Moving toward a more powerful and private web](https://blog.chromium.org/2021/11/chrome-dev-summit-2021-moving-toward.html)
