---
title: 掰jekyll
date: 2021-02-08 20:31:26
categories:
- jekyll
tags:
- bundle exec
---

花費一個工作天後決定放棄jekyll。
安裝過程還挺得住，但喜歡的theme不是文件太精簡看不懂，就是不支援github page，難受🤪

研究途中發現第一次在terminal執行jekyll server時需要`bundle exec jekyll server`

提問：為何需要`bundle exec`？
簡答：`bundle exec`讓環境知道該使用哪些版本的gems
詳細：`bundle exec`讓環境去查詢Gemfile來得知需要**使用哪些gems、並這些gems要固定在哪個版本**來搭配要執行的程式。

其他筆記與資料來源內收。

<!-- more -->

在環境（註）中第一次執行`jekyll server`要輸入`bundle exec jekyll server`，讓環境根據Gemfile查詢你的程式會用到哪些gems、並這些gems該使用哪些版本。在Gemfile沒有更新的情況下，第二次以後直接在環境輸入`jekyll server`就可以了。

若有修改Gemfile的內容，則須重新執行`bundle exec jekyll server`。

註：
「環境」在這個上下文脈絡中指的是Windows的cmd.exe，我透過cmd.exe這個[Command-line interface（CLI）](https://en.wikipedia.org/wiki/Command-line_interface)來執行hexo相關的操作。

參考資料：
[What does bundle exec rake mean?](https://stackoverflow.com/a/16218854/15028185)

You're running `bundle exec` on a program. The program's creators wrote it when **certain versions of gems** were available. The program **Gemfile** specifies the versions of the gems the creators decided to use. That is, the script was made to run correctly against these gem versions.