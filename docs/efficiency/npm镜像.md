npm镜像源

```
npm config set registry https://registry.npm.taobao.org --global
npm config set registry https://registry.npmjs.org --global
```

查看本地镜像源

```
npm config get registry
```

私有镜像搭建

```
# 安装verdaccio
npm install –global verdaccio
# 启动
verdaccio
# 链接
http://localhost:4873/
```

修改镜像地址

```
C:\Users\26540\AppData\Roaming\npm\node_modules\verdaccio\conf\default.yaml
```

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    timeout: 10s
  yarn:
    url: https://registry.yarnpkg.com/
    timeout: 10s
  taobao:
    url: https://registry.npm.taobao.org/
    timeout: 10s
```

```
npm set registry http://localhost:4873/
```

发布包

```
#当前npm 服务指向 本地
npm set registry http://localhost:4873
# 注册用户
npm adduser –registry http://localhost:4873
```

