---
title: 「Site Isolation、CORB、CORP與COEP」相關筆記
date: 2021-10-26 10:47:48
categories:
- Web security
tags:
---

## 總結
在面試時遇到CORS概念題，故回顧了[年初的筆記](https://tzynwang.github.io/2021/cross-origin-resource-sharing/)，並追加研究了一些CORS fetching相關的知識

本篇會提到的內容：
- CORS快速回顧
- Site Isolation
- CORP, Cross-Origin Resource Policy
- COEP, Cross-Origin-Embedder-Policy
- CORB, Cross-Origin Read Blocking


## 筆記
### CORS
- 首先同源政策（same-origin policy）限制了不同源文件的互動性（出於安全理由，來源B的回應內容無法影響到來源A的內容），而透過CORS則允許了例外。
  - MDN: The same-origin policy is a critical security mechanism that restricts how a document or script **loaded by one origin can interact with a resource from another origin**.
  - MDN: It helps isolate potentially malicious documents, **reducing possible attack vectors**. For example, it prevents a malicious website on the Internet from running JS in a browser to read data from a third-party webmail service (which the user is signed into) or a company intranet (which is protected from direct access by the attacker by not having a public IP address) and relaying that data to the attacker.
  - Wiki: Cross-origin resource sharing is a mechanism that allows restricted resources on a web page **to be requested from another domain** outside the domain from which the first resource was served.
  - Wiki: A web page may **freely embed cross-origin images, stylesheets, scripts, iframes, and videos**. Certain **"cross-domain" requests**, notably **Ajax requests, are forbidden** by default by the same-origin security policy.
  - TechBridge：如果你現在這個網站的跟你要呼叫的API的網站「不同源」的時候，瀏覽器一樣會幫你發Request，但是會把Response給擋下來，不讓你的JavaScript拿到（回應）並且傳回錯誤。注意：「你的**Request還是有發出去的**」，而且**瀏覽器也「確實有收到 Response」**，重點是「瀏覽器**因為同源政策，不把結果傳回給你的 JavaScript**」。如果沒有瀏覽器的話其實就沒有這些問題，你愛發給誰就發給誰，不管怎樣都拿得到Response。
- CORS是HTTP header的一種機制，根據不同的設定可以允許或禁止非同源的資源存取。基本上伺服器要先允許CORS，瀏覽器才可取用非同源的資源。
  - MDN: CORS is an **HTTP-header based mechanism** that allows a server to indicate any origins other than its own from which a browser should **permit loading resources**.
  - MDN: The CORS mechanism **supports secure cross-origin requests** and data transfers between browsers and servers. Modern browsers use CORS in APIs such as `XMLHttpRequest` or `Fetch` to mitigate the risks of cross-origin HTTP requests.
  - MDN: The CORS standard works by **adding new HTTP headers** that **let servers describe which origins are permitted to read that information** from a web browser.
  - Wiki: CORS defines a way in which a **browser and server can interact to determine whether it is safe to allow the cross-origin request**. It allows for more freedom and functionality than purely same-origin requests, but is more secure than simply allowing all cross-origin requests.
- CORS preflight：如果是會影響伺服器資料的request（`GET`與特定MIME types的`POST request`以外），瀏覽器在實際送出request前會先發出preflight，待收到伺服器的允許後，才會真正發出這些request
  - MDN: A CORS preflight request is a CORS request that checks to see if the CORS protocol is understood and a server is aware using specific methods and headers. It is an `OPTIONS` request, using three HTTP request headers: `Access-Control-Request-Method`, `Access-Control-Request-Headers`, and the `Origin` header.


### Site Isolation


### Cross-Origin Resource Policy


### Cross-Origin-Embedder-Policy


### Cross-Origin Read Blocking


## 參考文件
- [Wikipedia: Cross-origin resource sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
- [YouTube: Cross-origin fetches - HTTP 203](https://youtu.be/vfAHa5GBLio)
- [How to win at CORS](https://jakearchibald.com/2021/cors/)
- [Site Isolation for web developers](https://developers.google.com/web/updates/2018/07/site-isolation)
- [Cross-Origin Read Blocking (CORB)](https://chromium.googlesource.com/chromium/src/+/refs/heads/main/services/network/cross_origin_read_blocking_explainer.md)
- [The Chromium Projects: Cross-Origin Read Blocking for Web Developers](https://www.chromium.org/Home/chromium-security/corb-for-developers)
- [MDN: Preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
- [MDN: Cross-Origin Resource Policy (CORP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP))
- [MDN: Cross-Origin-Embedder-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)
- [輕鬆理解 Ajax 與跨來源請求](https://blog.techbridge.cc/2017/05/20/api-ajax-cors-and-jsonp/)