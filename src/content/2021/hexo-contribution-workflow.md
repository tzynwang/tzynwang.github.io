---
title: Contribution workflow note&#58; document update
date: 2021-02-14 09:53:37
tag:
  - [hexo]
---

This a note for participating hexo's contribution (for improving the documentation in English and traditional Chinese).
參與了 hexo 說明文件的改善協作，記錄一下整個流程。
不過 pr 因為提出的改善建議已經過時（[hexo 4.2.1 已支援 Noje.js 14](https://github.com/hexojs/hexo/issues/4267#issuecomment-778646141)）所以並沒有被接受 🤣

## Preparing works

- Read the [hexo's official guide for contributing](https://hexo.io/docs/contributing)
- Understand what is "Fork" in git workflow: [GitHub Docs: Fork a repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)
- Understand how to create a branch in CLI: [Git create branch \[a Git commands tutorial\]](https://www.datree.io/resources/git-create-branch)

## Environment

```
hexo: 5.3.0
hexo-cli: 4.2.0
os: Windows_NT 10.0.18363 win32 x64
```

## Workflow

1. Fork [hexojs/site](https://github.com/hexojs/hexo)
   ![Click "Fork" button](fork-hexo-site.png)
1. Open cmd.exe, move to `C:\Projects\hexo_contributing` by entering `cd C:\Projects\hexo_contributing` (since I want to store the hexojs/site repo in this location on my computer).
1. Enter `git init` to [create a empty Git repository](https://git-scm.com/docs/git-init) in this folder.
1. Follow the instruction on hexo's contribution document:

```
git clone https://github.com/tzynwang/site.git
cd site
npm install
```

1. Dive into the `\site\source` folder. Update the contents in English and traditional Chinese documents
1. Run `hexo server` to have a live previwing, checking the pages I'd updated and make sure nothing was mess-up
1. Create a branch call "update-node-js-version-suggestion" by entering `git checkout -b update-node-js-version-suggestion` in cmd.exe
1. Push the modification from local to GitHub by `git push https://github.com/tzynwang/site.git update-node-js-version-suggestion`
1. Create a pull request on GitHub page, describe what changes I'd applied to the documents.

## Result

[Receive a comment](https://github.com/hexojs/hexo/issues/4267#issuecomment-778646141) which indicated the improvement is out of date (my bad), thus remove the pr from GitHub. Here's the flow:

1. Click the ["Pull requests" tab in hexojs/site](https://github.com/hexojs/hexo/pulls), click the pr I'd sent
   ![Navigate to the Pull request tab in hexojs/site repository](close-pr-00.png)
1. Scroll to the page bottom, add the comment to describe the reason of closing the pr. Click the button "Close with comment"
   ![Comment the reason for closing the pull-request before closing it](close-pr-01.png)
1. Click the button "Delete branch" (since it has no useage now)
   ![Delete the branch from GitHub repository](close-pr-02.png)
1. The branch has been deleted
   ![The screenshot after deleting a branch](close-pr-03.png)
   Done 😌

## Reference

About how to use indicator characters (`:`) in yaml file and bracket (`[]`) in markdown file:

- [yaml Escaping Characters](https://riptutorial.com/yaml/example/25838/escaping-characters)
- [How to escape indicator characters (i.e. : or - ) in YAML](https://stackoverflow.com/a/19086251/15028185)
- [How to escape backslash bracket (\[) in Markdown?](https://stackoverflow.com/a/43011868/15028185)

About cancel, delete, remove a GitHub pull request:

- [How to cancel a pull request on github?](https://stackoverflow.com/a/10142727/15028185)
- [GitHub Docs: Closing a pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/closing-a-pull-request)
