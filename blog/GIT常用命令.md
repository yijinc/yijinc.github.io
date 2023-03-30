---
authors: fish
date: 2019-09-21
tags: [git]
---


## git add 

```bash
# 添加指定文件到暂存区
git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
git add [dir]

# 添加当前目录的所有文件到暂存区
git add .
```


## git reset

```bash
# 移出暂存区文件，文件依然修改在工作区中
git reset [file1] [file2] ...

# 撤回到上一次提交，reset 根据下列参数恢复到不同状态
# 1 移动 HEAD 指向到上一次提交 （若指定了 --soft，则到此停止，上一次提交修改存入暂存区）
# 2 使索引看起来像 HEAD （default --mixed，上一次提交修改存入工作区）
# 3 使工作目录看起来像索引 （若指定了 --hard，上一次提交修改完全被撤回/无记录）
git reset HEAD^ 

# 撤回到指定提交
git reset --hard [commited-hash]  

```


## git commit

```bash
# 提交暂存区到本地仓库
git commit -m "message"

# 提交暂存区的指定文件到本地仓库
git commit -m "message" [file1] [file2] ... 

# 允许创建一个没有任何改动的提交
git commit -m "message" --allow-empty

# 提交时显示所有diff信息
git commit -v

# 如果暂存区没有可提交的，则直接改写上一次的提交信息
# 如果暂存区有可提交的，提交变化，替代/覆盖 上一次提交
git commit --amend -m "message"
```


## git checkout

```bash
# (默认在当前分支)新建一个分支，并切换到该分支，可以在最后指定[检出分支]
git checkout -b [new-branch]
git checkout -b [new-branch] [from-branch]

# 切换到指定分支或提交，并切换到当前分支或提交点
git checkout [branch-name]  # 等同于 git switch [branch-name]
git checkout [commit-hash]

# 检出某个 commit 的指定文件 放入暂存区
git checkout [commit-hash] [file]

# 切换到上一个分支
git checkout -  # 等同于 git switch -

# 放弃/撤销 工作区（未git add）文件修改, . 表示所有文件
git checkout -- [filename]
git checkout .

```


## git branch

```bash
# 列出所有本地分支
git branch

# 列出所有远程分支 
$ git branch -r

# 列出所有本地分支和远程分支
git branch -a

# 查看本地分支关联（跟踪）的远程
git branch -vv

# (默认在当前分支)新建一个分支，停留在当前分支（不会切换过去）
# 也可在最后指定 from-branch 或 commit-hash
git branch [new-branch]
git branch [new-branch] [commit-hash]

# 与指定的远程分支建立追踪关系（
# 默认 local-branch 与 remote/branch名字一致，指定时需要注意
# local-branch 不填默认当前分支，可填当前分支或其他分支名
git branch [local-branch] [remote/branch] --track 
git branch [local-branch] --set-upstream-to=[remote/branch]

# 删除本地分支
git branch -d [branch]
git branch -D [branch]  # --delete --force

# 删除远程跟踪分支（本地分支/远程分支不会删除）
git branch -dr [remote/branch]

# 删除远程分支
git push origin --delete [branch]
```

## git fetch

```bash
# 获取/下载远程仓库的所有变动
git fetch [remote]
```

## git merge

```bash
# 合并指定（本地）分支到当前分支
git merge [branch]
# 合并指定（远程）分支到当前分支，指定 origin / branch-name
git merge [remote/branch]

# 合并、忽略解决冲突过程
git merge [branch] --abort

```


## git pull

```bash
# 拉最新指定远程分支代码，并与当前本地分支合并，（省略后面2个参数，拉取当前分支追踪的远程分支并合并）r
git pull [remote] [branch]

# 拉最新指定远程分支代码，并与当前本地分支合并
git pull [remote] [remote-branch]:[local-branch]
```

## git push

```bash
# 推送本地当前分支到指定远程分支仓库，（省略后面2个参数，推到当前分支追踪的远程分支）
git push [remote] [branch]

# 推送本地指定分支到远程指定分支, 以下2行等价
git push [remote] [local-branch]:[remote-branch]
git push [remote] refs/heads/[local-branch]:refs/heads/[remote-branch]

# 推送所有分支到远程仓库
git push [remote] --all
```

## git remote

```bash
# 显示所有远程仓库
git remote -v

# 显示某个远程仓库的信息，主要远程分支与本地分支追踪情况
git remote show [remote]

# 增加一个新的远程仓库，并命名
git remote add [shortname] [url]

```

## git show

```bash
# 显示某次提交的元数据和内容变化
git show [commit-hash]

# 显示某次提交发生变化的文件
$ git show [commit] --name-only

# 显示某次提交filename文件的内容
$ git show [commit]:[filename]
```

## git tag

```bash
# 列出所有tag
git tag

# 新建一个轻量标签，一般为临时标签
git tag [tag-name]

# 新建一个tag在指定commit
git tag [tag-name] [commit]

# 新建一个附注标签，【建议】
git tag -a [tag-name] -m "annotate message"

# 查看标签信息
git show [tag-name]


# 将tag推送到远程上，push tag跟branch操作类似
# 默认情况下，git push命令并不会传送标签到远程仓库服务器上，必须显式地推送标签
git push [remote] [tag-name]:[tag-name]

# 删除本地tag
git tag -d [tag-name]

# 删除远程分支（需要仓库所有权限）
git push [remote] :[tag-name]
git push [remote] :refs/tags/[tag-name]
```


## git status

```bash
# 显示当前状态，当前文件的变化、当前分支、追踪分支
git status
```

## git config

```bash
# 列出当前的git配置
git config --list

# 编辑git配置文件
git config -e [--global]

# 设置git用户信息
git config [--global] user.name "name"
git config [--global] user.email "email address"
```

## git log

```bash
# 列出当前分支commit日志，翻页，按q退出
git log

# 显示过去n次提交
git log -n

# 提交记录，文件修改统计信息
git log --stat

# 搜索提交历史，根据关键词
git log -S [keyword]

# 显示指定文件的版本历史，以下2行功能一致
git log --follow [file]
git whatchanged [file]

# 显示指定文件的版本历史，带每一次详细diff
git log -p [file]

# 可以设置alias 保存一些常用复杂命令
git config --global alias.history  'log --pretty=format:"%h %ad : %s %d [%an]" --graph --date=iso'
git history

```


## git 其他

```bash

# 将修改未提交的改变暂存到 stash
git stash

# 列出存储的的 stash
git stash list 

# 应用上一次存储的stash，pop会从stash list 移除
git stash ( apply | pop )

```