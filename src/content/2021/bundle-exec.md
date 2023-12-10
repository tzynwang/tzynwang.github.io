---
title: bundle exec
date: 2021-02-08 20:31:26
tag:
  - [jekyll]
---

Question: why adds `bundle exec` in the command when running jekyll server in the first time?
Answer (short): to know the version of the gems that are going to use.

## Note

`bundle exec` will check the Gemfile to understand "**what gems** will be used" and "**which version** of the gems should be used".
In the case that Gemfile is modified, run `bundle exec jekyll server` instead of just running `jekyll server`.

第一次執行`jekyll server`要輸入`bundle exec jekyll server`，讓環境根據 Gemfile 查詢你的程式會用到哪些 gems、並這些 gems 該使用哪些版本。在 Gemfile 沒有更新的情況下，第二次以後直接在環境輸入`jekyll server`就可以了。

若有修改 Gemfile 的內容，則須重新執行`bundle exec jekyll server`。

## Reference

[What does bundle exec rake mean?](https://stackoverflow.com/a/16218854/15028185)

You're running `bundle exec` on a program. The program's creators wrote it when **certain versions of gems** were available. The program **Gemfile** specifies the versions of the gems the creators decided to use. That is, the script was made to run correctly against these gem versions.
