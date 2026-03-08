---
title: How to print folder structure by Mac terminal
slug: mac-print-folder-structure
date: 2025-03-24 07:40:33
tag:
  - []
banner:
summary:
---

## TL;DR

Inside the target folder, run `tree -I node_modules -L 2` in the terminal. If you don't have `tree` installed, run `brew install tree` to install it first.

## Explanation

```bash
tree [-I pattern] [-L level]
```

- `-I node_modules`: ignore the `node_modules` folder.
- `-L 2`: only print the files and folders that are "at the root" and "at the second level".

## Recipe

- Run `tree` to print everything, except the hidden files/folders.
- Run `tree -a` to print everything, including the hidden files/folders.
- Run `tree -d` to print only the directories.
- Run `tree -I 'node_modules|dist'` to ignore files/folders whose name patterns match `node_modules` and `dist`.
- Run `tree --prune` to ignore the empty folders.
- Run `tree > tree.txt` to save the output as a text file.

## Where can I find `tree`'s official documentation?

Simply run `man tree`[^1] to view the docs. If you prefer to read it as a file, run `man tree | col -b > tree-manual.txt`[^2] to export the docs as a text file.

[^1]: For `man` command, see [The man Command](https://www.linfo.org/man.html).

[^2]: For `col` command, see [col(1) - Linux manual page](https://man7.org/linux/man-pages/man1/col.1.htm)
