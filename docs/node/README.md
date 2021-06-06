---
sidebar: true
sidebarDepth: 2
title: node基础
---
## 文件系统

### 使用fs读取文件

```js
var fs = require('fs');
// 第一个参数要读取的文件路径
// 第二个参数是一个回调函数
fs.readFile('./data/hello.txt',function(error,data){
    if(error) console.log(error);
    console.log(data.toString());
})
```

### 使用fs写入文件

```js
var fs = require('fs')
// 参数一:文件路径
// 参数二：文件内容
// 参数三：回调函数
fs.writeFile('./data/你好.md','我是node创建的文件',function(error){
    if(error) console.log("写入失败");
    console.log("文件写入成功");
})
```

## web模块

### 创建服务器

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(){
    console.log("客户端请求来了");
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

**服务端**

```
服务器启动成功了,可以通过http://localhost:3000访问
客户端请求来了
```

### 响应浏览器事件

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(request,response){
    //获取请求路径
    console.log("客户端的请求路径是:"+request.url);
    //响应数据
    //write 可以使用多次，但是最后一定要用end来结束响应
    //否则客户端会一直等待
    response.write('hello');
    response.write('nodejs')
    //结束响应
    response.end();
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

**服务端**

```
服务器启动成功了,可以通过http://localhost:3000访问
客户端的请求路径是:/
客户端的请求路径是:/favicon.ico
```

**浏览器**

```
hellonodejs
```

### 路由

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(request,response){
    //获取请求地址
    let {url} = request;
    if(url === '/'){
        response.end('Home');
    }else if(url === '/login'){
        response.end("login")
    }else{
        response.end('404 not fond')
    }
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

**只能返回字符串，数字对象等等都不行**

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(request,response){
    //获取请求地址
    let {url} = request;
    if(url === '/'){
        let users = [
            {name:'张三',age:18},
            {name:'李四',age:19},
        ]
        //只能换回字符串
        response.end(JSON.stringify(users));
    }
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

### 设置响应编码，解决中文乱码问题

```js
response.setHeader('Content-Type','text/plain;charset=utf-8');
```

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(request,response){
    //设置响应头的编码格式
    response.setHeader('Content-Type','text/plain;charset=utf-8');
    response.end("你好")
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

### 响应HTML

```js
response.setHeader('Content-Type','text/html;charset=utf-8');
```

```js
var http = require('http');
//1.创建一个web服务器
var server = http.createServer();
server.on('request',function(request,response){
    //设置响应头的编码格式
    //text/plain响应的是普通文本
    //text/plain响应的html(默认)
    response.setHeader('Content-Type','text/html;charset=utf-8');
    response.end("<h3>你好</h3>")
})
//2.绑定端口号
server.listen(3000,function(){
    console.log("服务器启动成功了,可以通过http://localhost:3000访问");
});
```

## 模块化

### 简单使用

a.js

```js
require('./b')
```

b.js

```js
console.log('我是b');
```

运行

```sh
$ node a.js
我是b
```

### 属性和方法的暴露

**b模块**

```js
// b.js
let age = 10;
// 暴露属性
exports.age = age;
//暴露方法
exports.add = function(x,y){
    return x+y;
}
```

**a.js**

```js
var b = require('./b')
// 打印b暴露的对象
console.log(b);
// 调用b的方法
const sum = b.add(1,2);
console.log(sum);
```

```js
$ node a.js
{ age: 10, add: [Function] }
3
```

## 模板引擎

**安装**

```sh
npm install art-template --save
```

**简单使用**

```js
//引入模板引擎
let template = require('art-template');
let ret = template.render('hello {{name}}',{
    name: 'jack'
})
console.log(ret);
```

运行结果

```js
hello jack
```