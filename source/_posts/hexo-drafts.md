---
title: Display draft post
date: 2021-02-19 14:25:20
categories:
- hexo
tags:
---


To view the draft posts (in the `source\_drafts` folder) on localhost:4000, just run `hexo server --draft`.
Set `render_drafts` as `true` in `_config.yml` will make `hexo generate` generate the posts in `source\_drafts` into `public` folder, which means the draft posts will be deployed to GitHub page by `hexo deploy`.
No needs to set `render_drafts` as `true` to view the draft posts on localhost, running `hexo server --draft` is enough.

`_config.yml`中的`render_drafts`設定為`true`的話，執行`hexo generate`時，資料夾`source\_drafts`內的檔案也會被生成到`public`資料夾中。
在這個情況下執行`hexo deploy`就會把草稿文章推到GitHub Page上。

只是想要在localhost:4000上瀏覽草稿的話，執行`hexo server --draft`即可，不用修改`render_drafts`的值。
hexo官方文件對`render_drafts`的說明比較簡短，一開始以為設定成`true`只是代表`hexo server`會渲染草稿……😇


## Environment
```
hexo: 5.3.0
hexo-cli: 4.2.0
os: Windows_NT 10.0.18363 win32 x64
```


## Reference
- [hexo: Commands/Display drafts](https://hexo.io/docs/commands#Display-drafts)
- [hexo: Configuration/Writing](https://hexo.io/docs/configuration#Writing)