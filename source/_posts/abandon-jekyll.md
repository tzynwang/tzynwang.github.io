---
title: 掰jekyll
date: 2021-02-08 20:31:26
categories: hexo
tags: beginner
---

花費一個工作天後決定放棄jekyll。
安裝過程還挺得住，但喜歡的theme不是文件太精簡看不懂，就是不支援github page，難受🤪

內收白天研究jekyll時使用bundle exec的筆記。

<!-- more -->

## 第一次執行jekyll server時為何需要bundle exec？
```
bundle exec jekyll server
```
簡答：`bundle exec`讓環境知道該使用哪些版本的gems

參考資料：[What does bundle exec rake mean?](https://stackoverflow.com/a/16218854/15028185)

You're running `bundle exec` on a program. The program's creators wrote it when **certain versions of gems** were available. The program **Gemfile** specifies the versions of the gems the creators decided to use. That is, the script was made to run correctly against these gem versions.

`bundle exec`讓環境去查詢Gemfile來得知需要**使用哪些gems、並這些gems要固定在哪個版本**來搭配要執行的程式。

所以在環境中第一次執行`jekyll server`要輸入`bundle exec jekyll server`，讓環境根據Gemfile查詢你的程式會用到哪些gems、並這些gems該使用哪些版本。在Gemfile沒有更新的情況下，第二次以後直接在環境輸入`jekyll server`就可以了。

若有修改Gemfile的內容，則須執行`bundle exec jekyll server`。