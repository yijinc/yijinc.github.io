---
authors: fish
date: 2022-02-19
tags: [Linux]
---


## 认识 BASH 这个shell

```bash
# 指令   选项       参数(1)     参数(2) 
command [-options] parameter1 parameter2 ...
# [--options] 使用选项的完整全名，例如 --help;
```

- 通过 `man` 查看 command 的使用说明书（manual pages），通常从 /usr/share/man 读取

```bash
man command

# 搜寻特定指令/文件的man page说明文件
man -f command # 相当于 ==>
whatis command

# 按关键字搜索man page说明文件
man -k command # 相当于 ==>
apropos command
``` 

- 环境变量 **$PATH** 默认是放置在 `/usr/share/info/`

- `set` 可以列出目前 bash 环境下的所有变量

-  按『tab键』：命令与文件补全功能

- 使用 `history` 查看执行过的历史指令，指令记录存放在 `~/.bash_history` ，按『上下键』可以找到前/后一个输入的指令

-  命令别名设定: `alias`,  `unalias`。例如 `alias rm='rm -i'`

- 路径与指令搜寻顺序：
	- 1 以相对/绝对路径执行指令；
	- 2 由 alias 找到该指令来执行；
	- 3 由 bash 内建的 (builtin) 指令来执行；
	- 4 透过 $PATH 这个变量的顺序搜寻到的第一个指令来执行。 

- login shell 会读取两个配置文件：
	- 1  /etc/profile（系统设定），
	- 2  ~/.bash_profile 或 ~/.bash_login 或 ~/.profile（个人设定，其中一个）
然后会通过这2个文件脚本载入其他文件配置。`source` (或小数点) 将配置文件的内容读进来目前的 shell 环境中（更改配置文件后不需要注销立即生效）

- 数据流重导向：
	- 1 标准输入 (stdin)：代码为0，使用<或<< ；
	- 2 标准输出 (stdout)：代码为 1 ，使用 > 或 >> ； 
	- 3 标准错误输出(stderr)：代码为 2 ，使用 2> 或 2>> ；
双向重导向`tee` 会同时将数据流分送到文件去与屏幕

```
# 将 stdout 与 stderr 分别存到不同的文件去
stdout > log.text 2> error.text

# 将 stdout 与 stderr 都写入同一个文件
stdout > log.text 2>&1

# 要注意! tee 后接的文件会被覆盖，若加上 -a (append) 这个选项则能将讯息累加
ls -l / | tee -a ~/homefile | more 
```

- 管线命令`|` 仅会处理 standard output，在每个管线后面接的第一个数据必定是『指令』，而且这个指令必须要能够接受 standard input 的数据。常用管线处理命令 `grep` 、`cut`、 `sort`、 `wc`、 `uniq`、 `split`、 `xargs`




## Linux 文件权限属性

**Linux下一切皆文件**，我们一般会用扩展名来表示不同种类的文件。

下达  `ls -al` 命令看看文件属性（-a: 包括目录和以 **.** 开头的隐藏文件；-l: 显示详细列表）

```bash
[root@serverxxx some-directory]# ls -la
总用量 8
drwxrwxr-x  7 user1 user1  132 12月 15 12:33 .
drwx------  3 user1 user1  127 12月 15 14:51 ..
drwxrwxr-x  2 user1 user1    6 12月 15 12:21 .git
-rw-rw-r--  1 user1 user1   66 12月 15 12:21 .gitignore
-rw-r--r--  1 user1 user1   73 12月 15 12:21 README.md
-rw-r--r--  1 user1 user1 1964 12月 15 12:33 package.json
drwxr-xr-x  8 user1 user1  256 12月 15 12:21 src
-rw-r--r--  1 user1 user1  377 12月 15 12:21 tsconfig.json
```

每一行都有 7 列，先认识一下上面7个字段个别的意思：

| drwxr-xr-x |  8 | user1 | user1 |  256 | 12月 15 12:21 | src |
| :---: | :---:| :---: | :---: | :---: | :---: | :---: |
| 文件类型与权限 | 链接数 | 所有者 | 群组 | 文件大小 | 最后修改时间 | 文件名 |

第一栏代表这个文件类型与权限，这一栏共 10 个字符：
- 第 1 个表示文件类型
	- d (directory)  表示目录
	-  \- 表示文件
	-  l (link file) 表示连接文件	
	-  b (block) 表示区块设备文件（可供储存的接口设备）
	-  c (character) 示为字符设备文件（串行端口的接口设备）例如键盘、鼠标

- 接下来的字符中，以3个为一组(共三组)，且均为 `rwx` 的三个参数的组合。其中，**r** 代表可读(read)、**w** 代表可写(write)、**x** 代表可执行(execute)。 要注意的是，这三个权限的位置不会改变，如果没有权限，就会用 **-** 代替占位。
	- 第一组 rwx 为文件拥有者的权限
	- 第二组 r-x  为加入此群组的账号的权限 
	- 第三组 r-x  为其他人的权限 



Linux 是个多人多任务的系统，Linux 一般将文件可存取的身份分为三个类别，分别是 owner/group/others，且三种身份各有 read/write/execute 等权限

### 文件所有者（Owner）

当创建一个用户的时候，Linux 会为该用户创建一个主目录，路径为 /home/[username]，我们可以使用 `cd ~`，快捷进入当前用户 home 目录。如果你想放一个私密文件，就可以放在自己的主目录里，然后设置只能自己查看。


### 群组（Group）

每个用户都有一个用户组，方便多人操作的时候，为一群人分配权限。当创建用户的时候，会自动创建一个与它同名的用户组。

如果一个用户同时属于多个组，用户需要在用户组之间切换，才能具有其他用户组的权限。

### 其他人（Others）

既不是 Owner 又不属于 Group，就是其他人。


### 超级用户（Root）
Root 用户是万能的天神，该用户可以访问所有文件




### chgrp：改变文件所属群组

chgrp（change group） 群组名需要存在 /etc/group

```bash
# -R：递归更改文件属组
chgrp [-R] 群组名 文件或目录
```

### chown：改变文件拥有者

chown（change owner） 用户账号名需要存在 /etc/passwd 

```bash
# -R：递归更改文件属组
chown [-R] 账号名称 文件或目录
chown [-R] 账号名称:组名 文件或目录
```

### chmod：改变文件的权限

Linux 文件的基本权限就有九个，分别是 owner/group/others 三种身份各有自己的 read/write/execute 权限，我们也可以用数字表示权限，数字与字母的对应关系为：

- r : 4 
- w : 2
- x : 1

每组 rwx 权限用数字累加表示，例如 rwxrwxr-x 对应的数字则是：
owner = rwx = 4+2+1 = 7
group = r-x = 4+0+1 = 5
others= - -x = 0+0+1 = 1

```bash
# 数字类型改变文件权限
# xyz 为 rwx 属性数值的相加值，例如上面 chmod 751 filename
chmod [-R] xyz 文件或目录
```

还有一种就是用字符改变权限的方法，我们用 **u**(user，也就是owner), **g**(group), **o**(others) 来代表三种身份的权限，**a**(all) 代表全部身份 

| &nbsp; chmod &nbsp; |  &nbsp; u、g、o、a &nbsp; | &nbsp; +(加入)、-(除去)、 =(设定) &nbsp; | &nbsp;&nbsp; r、w、x &nbsp;&nbsp; |  &nbsp; 文件或目录 &nbsp; |
| :---: | :---:| :---: | :---: | :---: |

```bash
# 字符类型改变文件权限
# 设置 u（owner）具有rwx权限，go(group&others)具有rx权限
chmod u=rwx,go=rx text.txt

# u(owner) 加上 x 权限，g(group)和 o(others)除去 x 权限。
chmod u+x,g-x,o-x index.html
```

## Linux 常用命令

#### 1. ssh 远程连接
```bash
ssh [options] [-p PORT] [username@]hostname
# 例
ssh -p 3000 root@100.100.100.100
```

#### 2. pwd 显示当前目录
```bash
[root@my-azure]$ pwd
/home/root/
```

#### 3. cd 切换工作目录
```bash
cd /home/workspace  # 进入/home/workspace
cd ~  # 进入home目录
cd -  # 回到上次所在目录，一般来回切换
```

#### 4. mkdir 创建目录
```bash
mkdir folder-name # 创建目录
mkdir -p folder1/folder2/folder3  # 递归创建目录
```

#### 5. touch 创建文件
```bash
touch new-file # 创建文件
```

#### 6. echo 打印输出
```bash
echo "hello world"
# 将打印内容通过 > 输出到 a.txt 文件，追加使用 >>
echo "some content" > a.txt
```

#### 7. cat 查阅一个文件的内容
```bash
cat ~/.ssh/id_rsa.pub

# 如果文件内容太多，可以使用可翻页查看命令 more|less
less /etc/man_db.conf

# 如果只想查看部分内容，可以使用撷取命令 head|tail
tail -n 10 -f /tomcat/log/messages # -n 10 显示10行，-f 监听文件修改实时显示
```

#### 8. cp 复制文件或目录
```bash
cp source_file_name target_file_name

cp -r app /home/www/app # -r 复制目录
```

#### 9. mv 移动并重命名
```bash
mv workspace/project/index.html /home/www/app # 移动
mv index.html home.html # 更改文件名
```

#### 10. rm 删除一个文件或者目录​
```bash
rm package.lock
mv -rf dist # 直接删除整个目录
```

#### 11. tar 文件的压缩打包

下面是常用的压缩命令，tar 是打包命令

| 压缩命令 |  选项与参数 | 打包文件拓展名 | 在 tar 中使用的参数 |
| :---: | :---:| :---: | :---: |
| gzip | c d t v # | *.gz | -z |
| bzip2 | c d k z v # | *.bz2  | -j | 
| xz | c d t k l # | *.gz | -J |

我们以使用度最广的压缩指令gzip 为例

```bash
# 压缩
tar -zcvf xxx.tar.gz 要被压缩的文件或目录

# 解压
tar -zxvf xxx.tar.gz
```

#### 12. which 查看指令对应的文件位置
```bash
which node # /root/.nvm/versions/node/v14.17.6/bin/node

# 如果需要查询系统文件（/bin/sbin、/usr/share/man）可以使用 whereis
whereis nginx
```
