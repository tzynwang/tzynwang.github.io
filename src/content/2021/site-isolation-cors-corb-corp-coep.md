---
title: 「CORP、COEB與CORP以及spectre attack」相關筆記
date: 2021-10-26 10:47:48
tag:
- [Web security]
---

## 總結

在面試時遇到 CORS 概念題，故回顧了[年初的筆記](https://tzynwang.github.io/2021/cross-origin-resource-sharing/)，並追加研究了一些 CORS fetching 相關的知識。
本篇會提到的內容：

- CORS 概念快速回顧
- CORP, Cross-Origin Resource Policy
- COEP, Cross-Origin Embedder Policy
- CORB, Cross-Origin Read Blocking
- Site Isolation
- Meltdown, Spectre attack

結論：以上機制的終極目標都是為了確保資料安全（常見攻擊手法為 Meltdown 與 Spectre）；阻擋可疑請求，但允許合理的非同源存取互動。

## 筆記

### CORS (Cross-Origin Resource Sharing)

> 首先「同源政策（same-origin policy）」限制了不同源文件的互動性（出於安全理由，來源 B 的回應內容無法影響到來源 A 的內容），而 CORS 設定則允許了例外（可取得非同源之資源）。

- MDN: The same-origin policy is a critical security mechanism that restricts how a document or script **loaded by one origin can interact with a resource from another origin**.
- MDN: It helps isolate potentially malicious documents, **reducing possible attack vectors**. For example, it prevents a malicious website on the Internet from running JS in a browser to read data from a third-party webmail service (which the user is signed into) or a company intranet (which is protected from direct access by the attacker by not having a public IP address) and relaying that data to the attacker.
- Wiki: Cross-origin resource sharing is a mechanism that allows restricted resources on a web page **to be requested from another domain** outside the domain from which the first resource was served.
- Wiki: A web page may **freely embed cross-origin images, stylesheets, scripts, iframes, and videos**. Certain **"cross-domain" requests**, notably **Ajax requests, are forbidden** by default by the same-origin security policy.
- TechBridge：如果你現在這個網站的跟你要呼叫的 API 的網站「不同源」的時候，瀏覽器一樣會幫你發 Request，但是會把 Response 給擋下來，不讓你的 JavaScript 拿到（回應）並且傳回錯誤。注意：「你的**Request 還是有發出去的**」，而且**瀏覽器也「確實有收到 Response」**，重點是「瀏覽器**因為同源政策，不把結果傳回給你的 JavaScript**」。如果沒有瀏覽器的話其實就沒有這些問題，你愛發給誰就發給誰，不管怎樣都拿得到 Response。

> CORS 是 HTTP header 的一種機制，根據不同的設定可以允許或禁止非同源的資源存取。基本上伺服器要先允許 CORS，瀏覽器才可取用非同源的資源。

- MDN: CORS is an **HTTP-header based mechanism** that allows a server to indicate any origins other than its own from which a browser should **permit loading resources**.
- MDN: The CORS mechanism **supports secure cross-origin requests** and data transfers between browsers and servers. Modern browsers use CORS in APIs such as `XMLHttpRequest` or `Fetch` to mitigate the risks of cross-origin HTTP requests.
- MDN: The CORS standard works by **adding new HTTP headers** that **let servers describe which origins are permitted to read that information** from a web browser.
- Wiki: CORS defines a way in which a **browser and server can interact to determine whether it is safe to allow the cross-origin request**. It allows for more freedom and functionality than purely same-origin requests, but is more secure than simply allowing all cross-origin requests.

> CORS preflight：如果是會影響伺服器資料的 request（`simple request`以外的 request methods），瀏覽器在實際送出 request 前會先發出 preflight，待收到伺服器的允許後，才會真正發出這些 request。

- MDN: Some requests **don't trigger a CORS preflight**. Those are called **simple requests**.
- MDN: A CORS preflight request is a CORS request that checks to see if the CORS protocol is understood and a server is aware using specific methods and headers. It is an `OPTIONS` request, using three HTTP request headers: `Access-Control-Request-Method`, `Access-Control-Request-Headers`, and the `Origin` header.

### Cross-Origin Resource Policy

> 設定在 response header 上，決定同、不同源的 request 是否能存取資源。

- MDN: a policy set by the `Cross-Origin-Resource-Policy` HTTP header that lets web sites to **protection against certain requests from other origins** (such as those issued with elements like `<script>` and `<img>`), to **mitigate speculative side-channel attacks**, like Spectre, as well as Cross-Site Script Inclusion attacks.
- MDN: CORP is an **additional layer** of protection beyond the default same-origin policy. Cross-Origin Resource Policy complements Cross-Origin Read Blocking (CORB), which is a mechanism to prevent some cross-origin reads by default.
- MDN: Web applications set a Cross-Origin Resource Policy via the `Cross-Origin-Resource-Policy` HTTP **response header**, which accepts one of three values: `same-site`, `same-origin` or `cross-origin`
  - `same-site`: only requests from the same site can read the resource.
  - `same-origin`: only requests from the same origin (i.e. same in scheme + host + port) can read the resource.
  - `cross-origin`: requests from any origin can read the resource. This is useful when COEP is used.
- MDN: As this policy is expressed **via a response header**, the actual **request is not prevented—rather**, the browser prevents the result from being leaked by stripping the response body.

### Cross-Origin-Embedder-Policy

> 設定在 response header 上，避免瀏覽器載入沒有設定為允許 CORS 或設定 CORP 的資源。

- MDN: The HTTP COEP **response header** prevents a document from loading any cross-origin resources that don't explicitly grant the document permission (using CORP or CORS).
- MDN: header syntax as following: `Cross-Origin-Embedder-Policy: unsafe-none | require-corp`
  - `unsafe-none`: default value; **allows** the document to fetch **cross-origin resources without giving explicit permission** through the CORS protocol or the CROP header.
  - `require-corp`: a document can **only load resources from the same origin**, or resources explicitly **marked as loadable** from another origin. If a cross origin resource supports CORS, the `crossorigin` attribute or the CORP header must be used to load it without being blocked by COEP.

### Cross-Origin Read Blocking

> 阻擋那些明顯不合理的請求，比如在`img`或`script`標籤中請求 JSON 資料這種行為。

- WHATWG standard: Cross-origin read blocking, better known as CORB, is an algorithm which **identifies dubious cross-origin resource fetches** (e.g., fetches that would fail anyway like attempts to render JSON inside an `img` element) and **blocks them before they reach a web page**. CORB reduces the risk of leaking sensitive data by keeping it further from cross-origin web pages.
- The Chromium Projects: For example, it will block a cross-origin `text/html` response requested from a `<script>` or `<img>` tag, replacing it with an empty response instead. This is an important part of the protections **included with Site Isolation**.

### Site Isolation

> Chrome 瀏覽器額外實作的安全機制，每個網站有其獨立的 process，降低被攻擊的可能性。

- Site Isolation is **a security feature in Chrome** that offers additional protection against some types of security bugs. It uses Chrome's **sandbox** to make it harder for untrustworthy websites to access or steal information from your accounts on other websites.
- It ensures that pages from different websites are always put into **different processes**, each running in a sandbox that limits what the process is allowed to do. As a result, a malicious website will find it much more difficult to steal data from other sites, even if it can break some of the rules in its own process.
- Cross-site data (such as HTML, XML, JSON, and PDF files) is **not delivered** to a web page's process **unless the server says it should be allowed** (using CORS).

### Meltdown, Spectre attack

> 處理器的安全漏洞，透過破壞應用程式之間的獨立性來推測、竊取內容。

- Meltdown and Spectre exploit **critical vulnerabilities in modern processors**. These hardware vulnerabilities allow programs to **steal data which is currently processed on the computer**. While programs are typically not permitted to read data from other programs, a malicious program can exploit Meltdown and Spectre to get hold of secrets stored in the memory of other running programs.
  - Meltdown: breaks the most fundamental **isolation between user applications** and the operating system. This attack allows a program to access the memory, and thus also the secrets, of other programs and the operating system.
  - Spectre: breaks the **isolation between different applications**. It allows an attacker to **trick error-free programs**, which follow best practices, into leaking their secrets.
- Google web.dev: spectre makes any data that is loaded to the same browsing context group as your code **potentially readable**. By **measuring the time** certain operations take, attackers can guess the **contents** of the CPU caches, and through that, the contents of the process' memory.
- ~~不重要：「007：惡魔四伏」的原文片名就是「Spectre」~~

## 參考文件

- Google:
  - [How to win at CORS](https://jakearchibald.com/2021/cors/)
  - [Site Isolation for web developers](https://developers.google.com/web/updates/2018/07/site-isolation)
  - [Site Isolation](https://www.chromium.org/Home/chromium-security/site-isolation)
  - [Cross-Origin Read Blocking for Web Developers](https://www.chromium.org/Home/chromium-security/corb-for-developers)
  - [Cross-Origin Read Blocking (CORB)](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/services/network/cross_origin_read_blocking_explainer.md)
  - [Making your website "cross-origin isolated" using COOP and COEP](https://web.dev/coop-coep/)
  - [Why you need "cross-origin isolated" for powerful features](https://web.dev/why-coop-coep/)
- MDN:
  - [Preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
  - [Cross-Origin Resource Policy (CORP)](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)>)
  - [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
- 無分類：
  - [WHATWG fetch standard: CORB](https://fetch.spec.whatwg.org/#corb)
  - [Wikipedia: Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
  - [YouTube: Cross-origin fetches - HTTP 203](https://youtu.be/vfAHa5GBLio)
  - [Meltdown and Spectre](https://meltdownattack.com/)
  - [輕鬆理解 Ajax 與跨來源請求](https://blog.techbridge.cc/2017/05/20/api-ajax-cors-and-jsonp/)
