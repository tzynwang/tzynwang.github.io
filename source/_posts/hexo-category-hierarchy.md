---
title: hexo posts' category hierarchy
date: 2021-02-15 09:38:00
categories:
- hexo
- category hierarchy
tags:
---


## Summary of this post
An introduction to hexo's category hierarchy.


### Categories with hierarchy
```
categories:
- Fruit
- Apple
```
Result:
```
└── Fruit
    └── Apple
```

### Categories without hierarchy (no hierarchy, parallel)
```
categories:
- [Fruit, Apple] 
- [Vegetable]
```
Result:
```
├── Fruit
|   └── Apple
└── Vegetable
```

### Multiple parallel categories
```
- [Fruit, Apple]
- [Fruit, Orange]
- [Vegetable]
```
Result:
```
├── Fruit # 2 sub-categories "Apple" and "Orange" exist under the parent category "Fruit"
|   └── Apple
|   └── Orange
└── Vegetable
```

### Sub-sub-category
```
- [Fruit, Apple, Apple seed]
- [Vegetable]
```
Result:
```
├── Fruit
|   └── Apple
|      └── Apple Seed
└── Vegetable
```


## Reference
[hexo: Front-matter/Categories & Tags](https://hexo.io/docs/front-matter#Categories-amp-Tags)