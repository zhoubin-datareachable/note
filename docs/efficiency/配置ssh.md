### 一、确定的是你的电脑上是安装过Git

打开 `cmd` ，输入命令，查看git版本：

```
git --version
复制代码
```

  如果显示类似 `git version 2.20.1.windows.1` 的Git版本，说明你的电脑是安装过Git的；否则请左转[打开Git的正确姿势](https://juejin.cn/post/6844903749631098893#heading-4)，把Git安装完了再来，不送。

### 二、查看是否配置了git用户名和邮箱

1. 查看用户名

```
git config user.name`
复制代码
```

1. 查看用户邮箱

```
git config user.email
复制代码
```

如果没有配置，那么需要配置用户名和邮箱：

1. 配置用户名：

```
git config --global user.name "xxx"
复制代码
```

1. 配置用户邮箱

```
git config --global user.email "xxx"
复制代码
```

### 三、查看是否配置过SSH Key(密钥)

1. 进入ssh文件夹

```
cd ~/.ssh 
复制代码
```

1. 查看文件

```
ls
复制代码
```

  查看该文件下的文件，看是否存在 `id_isa` 和 `id_isa.pub` 文件（也可以是别的文件名，只要 `yourName` 和 `yourName.pub` 成对存在就可以），如果存在的话，证明已经存在 ssh key了，可以直接跳过 `四、生成SSH Key(密钥)` 这一步骤，

### 四、生成SSH Key(密钥)

输入:

```
ssh-keygen -t rsa -C "你的邮箱" 
复制代码
```

  此处会提示 `Enter file in which to save the key (/Users/shutong/.ssh/id_rsa):` 这样一段内容, 让我们输入文件名，如果第3步的文件存在的话最好在这里修改一下文件名以防覆盖之前的内容；如果第3步的文件不存在的话则直接按 `enter` 键就好了。

  之后会有提示你是否需要设置密码，如果设置了每次使用Git都会用到密码，一般都是直接不写为空，直接 `enter` 就好了。

  上述操作执行完毕后，在 `~/.ssh/` 目录会生成 `XXX-rsa` (私钥)和 `XXX-rsa.pub` (公钥)，它们默认的存储路径是：

> C:\Users\Administrator.ssh

**注意**

> 个人建议生成的rsa最好单独命名不要使用默认名称，因为有可能sshkey可能会用在多个地方，一不小心就可能被覆盖然后导致git功能异常

### 五、添加公钥到你的远程仓库（github）

#### 1 、查看你生成的公钥：

```
cat ~/.ssh/id_rsa.pub
复制代码
```

  这里会把公钥显示出来，我们把这段内容复制出来。

#### 2、添加公钥到远程仓库:

  登陆你的github帐户 -> 点击你的头像，然后点击 `Settings` -> 左栏点击 `SSH and GPG keys` -> 点击 `New SSH key`

  然后将复制的公钥内容，粘贴进 `Key` 文本域内。 `title` 域，自己随便起个名字，建议与电脑位置或作用相关的名字，以为你今后可能会新增或者删除ssh，取个好理解的名字也知道他是个哪台电脑的。

  点击 `Add SSH key` 。

#### 2、查看 ssh文件是否配置成功

```
ssh -T git@github.com
复制代码
输出： Hi danygitgit! You've successfully authenticated, but GitHub does not provide shell access.
```

  恭喜你，你的设置已经成功了。

#### 六、使用了clash代理软件

```sh
git config --global http.proxy http://127.0.0.1:7890 
git config --global https.proxy http://127.0.0.1:7890
```

