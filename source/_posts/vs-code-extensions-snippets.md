---
title: VSCode擴充套件（Extensions）與自訂snippets
date: 2021-03-04 09:27:50
categories:
- VSCode
tags:
---

## 總結
記錄一些目前有在使用的VSCode擴充套件，與自訂snippets的步驟筆記。


## 版本與環境
```
VSCode: 1.53.2 (user setup)
os: Windows_NT 10.0.18363 win32 x64
```


## 擴充套件（Extensions）
### Bracket Pair Colorizer 2
套件網址：https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2
幫成對的括號套用相同的顏色，方便辨識。
根據[官方Q&A](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2#faq)的內容，2代改善了執行速度與正確性，其餘設定與1代看起來沒什麼差異。

如果要修改套件設定的話，可參考以下gif：
{% figure figure--center 2021/vs-code-extensions-snippets/extension-setting.gif %}

### indent-rainbow
套件網址：https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow
幫縮排區域套上顏色，縮排尺寸不正確時顯示為紅色，如下圖。
{% figure figure--center 2021/vs-code-extensions-snippets/incorrect-space.png %}

### Lorem Picsum photos snippets
套件網址：https://marketplace.visualstudio.com/items?itemName=huang-an-sheng.lorem-picsum-photos-snippets
練習切版時直接在html檔案中輸入`picsum`即可帶出有假圖的`<img>`標籤。
{% figure figure--center 2021/vs-code-extensions-snippets/lorem-piscum.gif %}
- 輸入`picsum`後直接按下`tab`會產生帶一張固定id假圖的標籤`<img src="https://picsum.photos/id/684/600/400" alt="">`
    - 需要隨機圖片的話，把圖片網址改為`https://picsum.photos/{width}/{height}?random={seed}`
    - `{width}`代表圖片寬度（單位px），`{height}`代表圖片高度（單位px），`{seed}`為正整數
    - 假圖網址加上不同的`{seed}`會讓每一組網址產生不同的圖片，參考下圖：
    {% figure figure--center 2021/vs-code-extensions-snippets/lorem-picsum.png %}
    - 第一列圖片的網址由左至右分別是`https://picsum.photos/600/400?random=1`、`https://picsum.photos/600/400?random=2`、`https://picsum.photos/600/400?random=3`、`https://picsum.photos/600/400?random=4`，第二列圖片的網址統一使用`https://picsum.photos/600/400?random`
    - 第二列的圖片在每次重新整理網頁時都會更新，但會是四張一樣的圖
- `picsum-grayscale`：灰階假圖
- `picsum-blur`：有模糊效果的假圖
- `picsum-square`：正方形假圖
- `picsum-grayscale-blur`：灰階加模糊效果
- 其餘預設效果可參考套件的說明內容

### Live Server
套件網址：https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
安裝完畢後，VSCode右下角會出現Go Live按鈕，點下啟動Live Server。
預設可以在`localhost:5500`即時看到VSCode的檔案（修改檔案內容後，存檔、重新整理`localhost:5500`上的頁面，才會看到修改內容）。

### Code Spell Checker
套件網址：https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker
支援CamelCase，並且偵測到拼寫不正確的單字時，會提供建議用字，如下圖：
{% figure figure--center 2021/vs-code-extensions-snippets/code-spell-checker.gif %}


## 自訂snippets
自訂了一個帶有bootstrap5 CSS與JS CDN連結的html樣板。
1. 從[bootstrap5官方文件](https://getbootstrap.com/docs/5.0/getting-started/introduction/#starter-template)複製html樣板內容
1. 開啟VSCode，按下F1，輸入「snippets」，選擇「Preferences: Configure User Snippets」
{% figure figure--center 2021/vs-code-extensions-snippets/snippets-edit-0.png %}
1. 因為要建立的是html樣板，故輸入html，意即建立給html文件使用的snippets
{% figure figure--center 2021/vs-code-extensions-snippets/snippets-edit-1.png %}
1. 另外一個開啟html.json的方式是依序點選「畫面右上角的File（Mac版為Code） >> Preferences >> User Snippets」後，輸入html開啟html.json
{% figure figure--center 2021/vs-code-extensions-snippets/snippets-edit-another-path.png %}
1. 在html.json檔案中貼上bootstrap5的html樣板內容
{% figure figure--center 2021/vs-code-extensions-snippets/snippets-edit-content.png %}
    - 圖中第16行`bootstrap5 template`代表snippets名稱
    - 第17行`prefix`的值代表呼叫snippets的快速鍵，為了避免跟VSCode預設的html樣板起衝突，設定為`!!`
    - 第18至35行`body`的值代表snippets的內容，每一行後面須加上半形逗號`,`分隔內容
    - 第36行`description`是輸入快速鍵時出現在snippets選單的說明內容，請參考下圖
    {% figure figure--center 2021/vs-code-extensions-snippets/snippets-enter-hotkey.png %}
    原始碼如下：
    ```JSON
"bootstrap5 template": {
    "prefix": "!!",
    "body": [
        "<!doctype html>",
        "<html lang=\"en\">",
        "    <head>",
        "        <meta charset=\"utf-8\">",
        "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
        "",
        "        <!-- Bootstrap CSS -->",
        "        <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl\" crossorigin=\"anonymous\">",
        "",
        "        <title>Hello, world!</title>",
        "    </head>",
        "    <body>",
        "        <!-- Option 1: Bootstrap Bundle with Popper -->",
        "        <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0\" crossorigin=\"anonymous\"></script>",
        "    </body>",
        "</html>"
    ],
    "description": "bootstrap5 template"
}
    ```
1. 以上內容輸入完畢後，存檔，之後即可在html格式的檔案中輸入快速鍵`!!`並按下`tab`來套用剛才自訂的snippets內容
{% figure figure--center 2021/vs-code-extensions-snippets/snippets-done.png %}


## 參考文件
- [12 個前端愛用的 VSCode 擴充套件](https://wcc723.github.io/development/2020/12/13/vscode-extension/)
- [VSCode快速安裝教學，推薦常用外掛擴充套件](https://tw.alphacamp.co/blog/visual-studio-code-editor-tutorial-and-extensions)
- [How do you format code in Visual Studio Code (VSCode)](https://stackoverflow.com/a/29973358/15028185)
- [Visual Studio Code: Create your own snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets)