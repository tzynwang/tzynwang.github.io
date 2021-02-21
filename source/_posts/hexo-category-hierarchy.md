---
title: Category hierarchy
date: 2021-02-15 09:38:00
categories:
- hexo
---


## Summary of this post
An introduction to hexo's category hierarchy.


### Categories with hierarchy
```YAML
# categories:
- Fruit
- Apple

# Result:
└── Fruit
    └── Apple
```

### Categories without hierarchy (no hierarchy, parallel)
```YAML
# categories:
- [Fruit, Apple] 
- [Vegetable]

# Result:
├── Fruit
|   └── Apple
└── Vegetable
```

### Multiple parallel categories
```YAML
# categories:
- [Fruit, Apple]
- [Fruit, Orange]
- [Vegetable]

# Result:
├── Fruit
|   └── Apple
|   └── Orange
└── Vegetable
```

### Sub-sub-category
```YAML
# categories:
- [Fruit, Apple, Apple seed]
- [Vegetable]

# Result:
├── Fruit
|   └── Apple
|      └── Apple Seed
└── Vegetable
```


## Reference
[hexo: Front-matter/Categories & Tags](https://hexo.io/docs/front-matter#Categories-amp-Tags)