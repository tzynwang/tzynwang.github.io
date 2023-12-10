---
title: 「從Callback到Promise」相關筆記
date: 2021-07-19 13:02:58
tag:
  - [JavaScript]
---

## 總結

本篇筆記內容：

- JavaScript 的非同步處理如何從呼叫 Callback function 轉換為 Promise 的形式
- AC 學期 3 的「Promise 包裝作業」思考流程

## 筆記

### Promise

定義：

- [Promises/A+](https://promisesaplus.com/):
  - A promise represents **the eventual result of an asynchronous operation**.
  - The primary way of interacting with a promise is through its `then` method, which registers callbacks to **receive either a promise’s eventual value** or **the reason why the promise cannot be fulfilled**.
- [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):
  - The Promise object represents **the eventual completion (or failure) of an asynchronous operation** and its resulting value.
  - This lets asynchronous methods return values like synchronous methods: instead of immediately returning the final value, the asynchronous method returns a promise to supply the value at some point in the future.
  - `Promise.prototype.then()`, `Promise.prototype.catch()`: As the `then` and `Promise.prototype.catch()` methods return promises, they can be **chained** — an operation called **composition**.
  - `Promise.prototype.finally()`: This provides a way for code to be run **whether the promise was fulfilled successfully or rejected** once the `Promise` has been dealt with.

小結論：

- promise 代表一個非同步功能的最終結果
- async function 最終的結果會是`fulfilled`或`rejected`二選一
- 用`then()`來接`Promise.resolve()`的值、用`catch()`來接`Promise.reject()`，而`finally()`內的 function 則是不論結果為 resolve 或 reject 都會執行

### callback 使用情境

範例：以下程式碼全部借鑑 YouTube 影片[Async JS Crash Course - Callbacks, Promises, Async Await](https://youtu.be/PoRJizFvM7s)

```js
const posts = [
  { title: 'Post 1', content: 'Content post 1' },
  { title: 'Post 2', content: 'Content post 2' }
]

function postToList () {
  setTimeout(() => {
    let content = ''
    posts.forEach(post => {
      content += `<li>${post.title}</li>`
    })
    document.body.innerHTML = content
  }, 1000)
}

postToList()
```

- 模擬情境：
  - 瀏覽器向 server 索取 posts 資料，而 server 過了一秒後回覆
  - 瀏覽器收到 posts 後，將所有的 post.title 渲染為清單並放到畫面上

```js
const posts = [
  { title: 'Post 1', content: 'Content post 1' },
  { title: 'Post 2', content: 'Content post 2' }
]

function postToList () {
  setTimeout(() => {
    let content = ''
    posts.forEach(post => {
      content += `<li>${post.title}</li>`
    })
    document.body.innerHTML = content
  }, 1000) // 延後1秒執行
}

function addPost (post) {
  setTimeout(() => {
    posts.push(post)
  }, 2000) // 延後2秒執行
}

addPost({ title: 'Post 3', content: 'Content post 3' })
postToList()
```

- 模擬情境：
  - 將第三篇 post 新增到 posts 陣列中
  - 瀏覽器向 server 索取 posts 資料，而 server 過了一秒後回覆
  - 瀏覽器收到 posts 後，將所有的 post.title 渲染為清單並放到畫面上
  - 執行結果：畫面上僅會有 post 1 與 post2，因為`addPost()`實際執行的時間點（被`setTimeout()`延後至少 2 秒）比`postToList()`（被`setTimeout()`延後至少 1 秒）晚

```js
const posts = [
  { title: 'Post 1', content: 'Content post 1' },
  { title: 'Post 2', content: 'Content post 2' }
]

function postToList () {
  setTimeout(() => {
    let content = ''
    posts.forEach(post => {
      content += `<li>${post.title}</li>`
    })
    document.body.innerHTML = content
  }, 1000)
}

function addPost (post, callback) {
  setTimeout(() => {
    posts.push(post)
    callback()
  }, 2000)
}

addPost({ title: 'Post 3', content: 'Content post 3' }, postToList)
```

- callback function 登場，將`postToList`作為 callback 傳入`addPost`後，程式碼的行為變成「待`addPost`結束後，再執行`postToList`」
- 執行結果：畫面上會印出 post 1、post2 與 post3

### 將 callback 轉換為 promise 形式

```js
const posts = [
  { title: 'Post 1', content: 'Content post 1' },
  { title: 'Post 2', content: 'Content post 2' }
]

function postToList () {
  setTimeout(() => {
    let content = ''
    posts.forEach(post => {
      content += `<li>${post.title}</li>`
    })
    document.body.innerHTML = content
  }, 1000)
}

function addPost (post) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        const error = false
        if (!error) {
          posts.push(post)
          resolve()
        } else {
          reject('something goes wrong')
        }
      })
    })
}

addPost({ title: 'Post 3', content: 'Content post 3' })
  .then(() => {
    postToList()
  })
  .catch(error => {
    console.error(error)
  })
```

1. 移除`addPost`的 callback 參數
1. 讓`addPost`回傳 Promise 物件，其中`resolve()`沒有包含任何值，而`reject()`提供錯誤訊息「`something goes wrong`」
1. 執行`addPost`後，透過`then`與`catch`來承接`addPost`順利完成（`resolve`）或失敗（`reject`）的情境
1. `addPost`成功時，進行`postToList()`
1. `addPost`出現錯誤時，則`console.error(error)`

### AC 作業應用

原始 callback 版本：

```js
const http = require('http')
const https = require('https')
const imgPath = ''

http.createServer((req, res) => {
  https.get('https://dog.ceo/api/breeds/image/random', (body) => {
    let data = ''

    body.on('data', (chunk) => {
      data += chunk
    })

    body.on('end', () => {
      console.log(JSON.parse(data))
      imgPath = JSON.parse(data).message
      res.end(`<h1>DOG PAGE</h1><img src='${imgPath}' >`)
    })
  }).on('error', (error) => {
    console.error(error)
  })
}).listen(3000)
```

Promise 版起手式：

```js
const http = require('http')
const https = require('https')

const requestData = () => {
  // TODO
}

http.createServer((req, res) => {
  // TODO
  res.end(`<h1>DOG PAGE</h1><img src='${imgPath}' >`)
}).listen(3000)
```

思考過程：

1. 用`resolve()`處理`JSON.parse(data)`，用`reject()`處理`.on('error', (error) => { console.error(error) })`這一段
1. 把整個`https.get(...)`包成 Promise 物件
1. `requestData`順利完成後，用`then()`來接`JSON.parse(data)`；`result`內容為`JSON.parse(data)`，取`result.message`即為圖片網址
1. 用`catch()`來處理錯誤狀態，將`workingURL`替換為變數`errorURL`後，即可在終端看到`error`訊息

改裝完成：

```js
const http = require('http')
const https = require('https')

const workingURL = 'https://dog.ceo/api/breeds/image/random'
const errorURL = 'https://this.will.not/work'

const requestData = () => {
  return new Promise((resolve, reject) => {
    https.get(workingURL, (body) => {
      let data = ''

      body.on('data', (chunk) => {
        data += chunk
      })

      body.on('end', () => {
        console.log(JSON.parse(data))
        resolve(JSON.parse(data))
      })
    }).on('error', (error) => {
      reject(error)
    })
  })
}

http.createServer((req, res) => {
  requestData()
    .then(result => {
      const imgPath = result.message
      res.end(`<h1>DOG PAGE</h1><img src='${imgPath}' >`)
    })
    .catch(error => {
      console.error(error)
      res.end(`<p>Sorry but something goes wrong.</p>`)
    })

}).listen(3000)
```

### 補充：`Promise.all()`

```js
// MDN範例
const promise1 = Promise.resolve('Answer to the Ultimate Question of Life, ')
const promise2 = 'the Universe, and Everything'
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, '42')
});

Promise.all([promise1, promise2, promise3])
  .then((values) => {
    console.log(values)
})
// 輸出結果：
// ["Answer to the Ultimate Question of Life, ", "the Universe, and Everything", "42"]
```

參考[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)：

- It takes **an iterable of promises as an input**, and returns a single Promise that resolves to **an array** of the results of the input promises.
- It **rejects immediately** upon any of the input promises **rejecting** or **non-promises throwing an error**, and will reject with this first rejection message / error.

## 參考文件

- [Promises/A+](https://promisesaplus.com/)
- YouTube
  - [Async JS Crash Course - Callbacks, Promises, Async Await](https://youtu.be/PoRJizFvM7s)
  - [Callbacks, Promises, Async Await | JavaScript Fetch API Explained](https://youtu.be/VmQ6dHvnKIM)
