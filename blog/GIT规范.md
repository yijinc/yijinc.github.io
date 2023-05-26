---
authors: fish
date: 2023-05-26
tags: [git]
---


GIT 规范

## 合并规范

为适应多个feature同时**并行交错**开发，做到每个 feature 独立干净、合并的代码不被意外覆盖，这里有几个良好的代码合并习惯(规范)供大家参考，

- 为了让代码变化更好追踪，总是使用 `merge` 操作 而非 `rebase` ；
- 总是在自己的 **开发(feature)分支** 修改代码，无论开发阶段还是解决bug阶段；
- 每当需要部署时，请切换到 **部署分支**，比如 test，merge 您的 **开发(feature)分支** 代码到 test；请不要将您的环境变量配置一起合并过去；
- 您不需要将 **部署分支** 同步（merge）到您的 **开发(feature)分支**，它会污染您的代码。

这样做的好处是：您的feature分支代码总是独立干净的，多人开发时，可以灵活选择哪几个 feature 上线，拥抱产品需求变化


## 提交规范

commit message格式 

```
type(scope): subject
```

#### type(必须) ：

用于说明git commit的类别，只允许使用下面的标识。
- feat：新功能（feature）。
- fix：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。
- chore：构建过程或辅助工具的维护。
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）。
- docs：文档（documentation）。
- style：格式（不影响代码运行的变动）。
- perf：优化相关，比如提升性能、体验。
- test：增加测试。
- revert：回滚到上一个版本。
- ci：持续集成相关。

#### scope(可选)

scope用于说明 commit 影响的范围，比如权限、订单、商品等等，视项目不同而不同。

```
feat(order)
```

#### subject(必须)

subject是commit目的的简短描述，不超过50个字符。

```
fix(product): 修复产品无法删除 Refs #133
```

## 部署上线

保持 master 分支是线上稳定版本， 该分支是受保护的

统一使用 tag 的形式，发布上线：

```bash
git tag -a v1.0.0 -m "v1.0.0：一些相关描述，解决了xxx，修复了xxx"

# push tag
git push origin v1.0.0
```

打 tag 形式对运维操作友好，tag 能准确的指向 commit id，回滚方便；这里我们以版本号格式标记，版本号可以同步产品的版本，也可以开发自己维护。
常见使用3个整数来记录版本号 `major.minor.patch`，比如 1.2.3
- major 主版本号：大改版，不兼容老版本，major+1
- minor 次版本号：普通迭代，不影响之前版本功能，minor+1
- patch 补丁版本号：小修改，bug修复，patch+1

打完 tag 后，将tag名 告知运维，运维做线上发布；
发布完成后，线上验证完成，运维或项目Owner/Maintainer 做合并到 master 分支操作

> ⚠️：视情况 tagName 用 newBranch / commitId 代替
