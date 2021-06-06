## 搭建脚手架项目

```sh
# 安装脚手架工具
npm install -g create-react-app
# 创建项目
create-react-app projectName
```

## 目录设计

```
├── src
    ├── api         # ajax相关请求模块
    ├── assets      # 共用资源文件夹
    ├── components  # UI组件文件夹
    ├── containers  # 容器组件文件夹
    ├── redux       # redux相关
    ├── utils       # 工具模块文件夹
    └── index.js    # 入口js
    
```

## 引入 antd-mobile

**下载组件库包**

```sh
npm install antd-mobile@2.1.8 --save
```

### 页面处理

**public/index.html**

```html
<!-- 配置视口标签 -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />

<!-- antd-mobile配置 -->
<script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
<script>
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            FastClick.attach(document.body);
        }, false);
    }
    if(!window.Promise) {
        document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
    }
</script>
```

**完整版**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
    <meta name="theme-color" content="#000000">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>React App</title>
    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
    <script>
      if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
          FastClick.attach(document.body);
        }, false);
      }
      if(!window.Promise) {
        document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
      }
    </script>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
  </body>
</html>
```

### 实现组件的按需打包

**下载依赖模块**

```sh
npm install babel-plugin-import@1.7.0 react-app-rewired@1.5.2 --save-dev
```

**定义加载配置的 js 模块: 根目录下config-overrides.js**

```js
const {injectBabelPlugin} = require('react-app-rewired');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', {libraryName: 'antd-mobile', style: 'css'}],
config);
    return config;
}
```

**修改配置: package.json**

```js
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject"
}
```

### 使用 antd 组件

```js
import React from 'react'
import ReactDOM from 'react-dom'
import {Button} from 'antd-mobile'
ReactDOM.render(
    <Button type='primary'>学习</Button>,
    document.getElementById('root')
)
```

### 自定义主题

目标: 将主体的背景颜色从 blue 变为 green

**下载依赖模块**

```sh
npm install --save-dev less@2.7.3 less-loader@4.1.0
```

**配置: config-overrides.js**

```js
const {injectBabelPlugin, getLoader} = require('react-app-rewired');

const fileLoaderMatcher = function (rule) {
  return rule.loader && rule.loader.indexOf(`file-loader`) != -1;
}

module.exports = function override(config, env) {
  // babel-plugin-import
  config = injectBabelPlugin(['import', {
    libraryName: 'antd-mobile',
    //style: 'css',
    style: true, // use less for customized theme
  }], config);

  // customize theme
  config.module.rules[1].oneOf.unshift(
    {
      test: /\.less$/,
      use: [
        require.resolve('style-loader'),
        require.resolve('css-loader'),
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            // theme vars, also can use theme.js instead of this.
            modifyVars: {
              "@brand-primary": "#1cae82", // 正常
              "@brand-primary-tap": "#1DA57A", // 按下
            },
          },
        },
      ]
    }
  );

  // css-modules
  config.module.rules[1].oneOf.unshift(
    {
      test: /\.css$/,
      exclude: /node_modules|antd-mobile\.css/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[local]___[hash:base64:5]'
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
      ]
    }
  );

  // file-loader exclude
  let l = getLoader(config.module.rules, fileLoaderMatcher);
  l.exclude.push(/\.less$/);

  return config;
};
```

## 引入路由

**下载路由包: react-router-dom**

```sh
npm install --save react-router-dom@4.2.2
```

**路由组件: containers/register/register.jsx**

```jsx
import React, { Component } from 'react'

export default class Register extends Component {
    render() {
        return (
            <div>
                register
            </div>
        )
    }
}
```

**路由组件: containers/login/login.jsx**

```jsx
import React, { Component } from 'react'

export default class Login extends Component {
    render() {
        return (
            <div>
                login
            </div>
        )
    }
}
```

**路由组件: containers/main/main.jsx**

```jsx
import React, { Component } from 'react'

export default class Main extends Component {
    render() {
        return (
            <div>
                main
            </div>
        )
    }
}
```

### 映射路由: 

**index.js**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter,Switch,Route} from 'react-router-dom'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'

ReactDOM.render(
<HashRouter>
    <Switch>
        <Route path="/login" component={Login}/>
        <Route path="/register" component={Register}/>
        <Route component={Main}/>
    </Switch>
</HashRouter>,document.getElementById('root'))
```

## 引入 redux

**下载相关依赖包**

```sh
npm install --save redux@3.7.2 react-redux@5.0.7 redux-thunk@2.2.0
npm install --save-dev redux-devtools-extension@2.13.2
```

**redux/reducers.js**

```js
import {combineReducers} from 'redux'

function xxx(state = 0,action){
    return state
}

function yyy(state = 0,action){
    return state
}

// 返回合并后的reducer函数
export default combineReducers({
    xxx,
    yyy
})
```

**redux/store.js**

```js
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducers from './reducers'

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
```

**入口 JS: index.js**

```js
// 引入provider
import {Provider} from 'react-redux'
// 引入store
import store from './redux/store'

<Provider store={store}></Provider>
```

**完整代码**

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter,Switch,Route} from 'react-router-dom'
import {Provider} from 'react-redux'

import store from './redux/store'
import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route component={Main}/>
        </Switch>
    </HashRouter>
  </Provider>
,document.getElementById('root'))
```

## 注册/登陆界面

### Logo 组件

**1.在logo组件下放一张logo图片**

**2.components/logo/logo.jsx**

```jsx
import React, { Component } from 'react'
// 引入logo图片
import logo from './log.png'
// 引入样式文件
import './logo.less'

export default class Logo extends Component {
    render() {
        return (
            <div className="logo-container">
                <img src="{logo}" className="logo-img"/>
            </div>
        )
    }
}

```

**3.样式文件logo.less**

```less
.logo-container {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    .logo-img {
    width: 240px;
    height: 240px;
    }
}
```

### 注册组件

containers/register/register.jsx

**用到的组件**

```html
<!-- 两翼留白 -->
<WingBlank>...</WingBlank>
<!-- 上下留白 -->
<WhiteSpace />
<!-- 导航栏 -->
<NavBa>NavBar</NavBar>
<!-- 列表 -->
<List></List>
<!-- 文本输入 -->
<InputItem placeholder='输入用户名' onChange={事件函数}>用户名:</InputItem>
<!-- 单选框 -->
<Radio checked={} onClick={事件回调}>老板</Radio>
<!-- 按钮 -->
<Button type="primary">primary</Button>
```

**基本样式**

```jsx
<div>
    <NavBar>硅谷直聘</NavBar>
    <Logo />
    <WingBlank>
        <List>
            <InputItem type="text">用户名:</InputItem>
            <InputItem type="password">密&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
            <InputItem type="password">确认密码:</InputItem>
            <List.Item>
                <span style={{marginRight: 30}}>用户类型:</span>
                <Radio name="type">老板</Radio>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Radio name="type">大神</Radio>
            </List.Item>
            <WhiteSpace />
            <Button type="primary">注册</Button>
            <WhiteSpace />
            <Button>已有账号</Button>
        </List>
    </WingBlank>
</div>
```

**数据收集**

```jsx
import React, { Component } from 'react'
import {NavBar,WingBlank,List,InputItem,Radio,Button,WhiteSpace} from 'antd-mobile'
import Logo from '../../components/logo/logo'

export default class Register extends Component {
    state = {
        username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    handleChange = (name,value)=>{
        this.setState({
            [name]:value
        })
    }
    register = ()=>{
        console.log(this.state);
    }
    toLogin = ()=>{
        this.props.history.replace('/login')
    }
    render() {
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        <InputItem type="text" onChange={val => this.handleChange('username',val)}>用户名:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password2',val)}>确认密码:</InputItem>
                        <List.Item>
                            <span style={{marginRight: 30}}>用户类型:</span>
                            <Radio checked={this.state.type === 'laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type === 'dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>
                        </List.Item>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.register}>注册</Button>
                        <WhiteSpace />
                        <Button onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

```

### 登录组件

containers/login/login.jsx

```jsx
import React, { Component } from 'react'
import {NavBar,WingBlank,List,InputItem,Button,WhiteSpace} from 'antd-mobile'
import Logo from '../../components/logo/logo'

export default class Login extends Component {
    state = {
        username:'',
        password:''
    }
    handleChange = (name,value)=>{
        this.setState({
            [name]:value
        })
    }
    login = ()=>{
        console.log(this.state);
    }
    toRegister = ()=>{
        this.props.history.replace('/register')
    }
    render() {
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        <InputItem type="text" onChange={val => this.handleChange('username',val)}>用户名:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.login}>登录</Button>
                        <WhiteSpace />
                        <Button onClick={this.toRegister}>还没账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

```

## 搭建后台应用

### 搭建项目

**创建项目**

```sh
npx express-generator
```

在bin/www文件修改端口号

```js
var port = normalizePort(process.env.PORT || '4000');
```

安装依赖

```sh
npm install
```

启动项目

```sh
npm start
```

### 热部署

**下载依赖**

```sh
npm install --save-dev nodemon
```

**修改package.json文件**

```json
"scripts": {
    "start": "nodemon ./bin/www"
}
```

**启动项目**

```sh
npm start
```

## 操作数据库

**下载依赖包**

```sh
npm install --save mongoose blueimp-md5
```

**导入依赖**

```js
const md5 = require('blueimp-md5')
const mongoose = require('mongoose')
```

## 注册/登陆后台处理

**数据库数据操作模块: db/models.js**

```js
var express = require('express');
const md5 = require('blueimp-md5')
var router = express.Router();

const {UserModel} = require('../db/models')

// 注册路由
router.post('/register',(req,res)=>{
  const {username,password,type} = req.body

  UserModel.findOne({username},(err,user)=>{
    if(user){
      res.send({code:1,msg:'此用户已存在'})
    }else{
      new UserModel({username,password:md5(password),type}).save((err,user)=>{
        // 设置cookie存放7天
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
        res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })
})

// 登录路由
router.post('/login',(req,res)=>{
  const {username,password} = req.body
  UserModel.findOne({username,password:md5(password)},"-password",(err,user)=>{
    console.log(user);
    if(!user){
      res.send({code:1,msg:'用户或密码错误'})
    }else{
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
      res.send({code:0,data:user})
    }
  })
})

module.exports = router;
```

## 注册/登陆前台处理

**下载依赖**

```sh
npm install --save axios@0.18.0
```

### 封装 ajax 请求

**1.配置api/ajax.js**

```js
import axios from 'axios'

// 默认get请求
export default function ajax(url = '',data = {},type = 'GET'){
    if(type === 'GET'){
        let dataStr = '' //数据拼接字符串
        Object.keys(data).forEach(key =>{
            dataStr += key + '=' + data[key] + '&'
        })
        if(dataStr !==''){
            dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
            url = url + '?' + dataStr
        }

        // 发送get请求
        return axios.get(url)
    }else{
        // 发送post请求
        return axios.post(url,data)
    }
}
```

**2.配置登录和注册接口api/index.js**

```js
import ajax from './ajax'

// 请求注册
export const reqRegister = user=>{
    return ajax('/register',user,'POST')
}

// 请求登录
export const reqLogin = user =>{
    return ajax('/login',user,'POST')
}
```

**3.配置请求代理: package.json**

```json
"proxy": "http://localhost:3000"
```

### redux 管理用户信息

**1.常量配置：redux/action-types.js**

```js
// 验证成功
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
// 请求出错
export const ERROR_MSG = 'ERROR_MSG'
```

**2.action配置：redux/actions.js**

返回`return {type:INCREMENT,data}`的格式

```js
// 导入常量
import {AUTH_SUCCESS,ERROR_MSG} from './action-types'
// 导入请求api
import {reqRegister,reqLogin} from '../api'

// 定义标准返回格式
// 失败格式
const errorMsg = msg =>{
    return {type:ERROR_MSG,data:msg}
}
// 成功格式
const authSuccess = msg =>{
    return {type:AUTH_SUCCESS,data:msg}
}

// 注册action
export function register({username,password,password2,type}){
    //前台验证
    if(!username || !password || !type){
        return errorMsg('用户名和密码不能为空')
    }
    if(password !== password2){
        return errorMsg('密码和确认密码不同')
    }

    return async dispatch =>{
        // 发送请求得到响应
        const response = await reqRegister({username,password,type})
        // 得到数据
        const result = response.data
        // 如果正确
        if(result.code === 0){
            // 分发成功的action
            dispatch(authSuccess(result.data))
        }else{
            // 分发错误的action
            dispatch(errorMsg(result.msg))
        }
    }
}

// 登录action
export const Login = ({username,password})=>{
    if(!username || !password){
        return errorMsg('用户名和密码不能为空')
    }
    return async dispath =>{
        const response = await reqLogin({username,password})
        const result = response.data
        if(result.code === 0){
            dispath(authSuccess(result.data))
        }else{
            dispath(errorMsg(result.msg))
        }
    }
}
```

**3.reducer配置：redux/reducers.js**

```js
import {combineReducers} from 'redux'
import {AUTH_SUCCESS,ERROR_MSG} from './action-types'

// 初始化参数
const initUser = {
    username: '', // 用户名
    type: '', // 类型
    msg: '', // 错误提示信息
    redirectTo: '' // 需要自动跳转的路由 path
}

function user(state = initUser,action){
    switch(action.type){
        case AUTH_SUCCESS: //登录成功
            return {...action.data,redirectTo:'/'}
        case ERROR_MSG: //登录失败
            return {...state,msg: action.data}
        default:
            return state
    }
}

// 返回合并后的reducer函数
export default combineReducers({
    user
})
```

### 注册组件: register.jsx

```jsx
import React, { Component } from 'react'
import {NavBar,WingBlank,List,InputItem,Radio,Button,WhiteSpace} from 'antd-mobile'

import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

class Register extends Component {
    state = {
        username:'',
        password:'',
        password2:'',
        type:'dashen'
    }
    handleChange = (name,value)=>{
        this.setState({
            [name]:value
        })
    }
    register = ()=>{
        this.props.register(this.state)
    }
    toLogin = ()=>{
        this.props.history.replace('/login')
    }
    render() {
        const {redirectTo,msg} = this.props
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p>:null}
                    <List>
                        <InputItem type="text" onChange={val => this.handleChange('username',val)}>用户名:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password2',val)}>确认密码:</InputItem>
                        <List.Item>
                            <span style={{marginRight: 30}}>用户类型:</span>
                            <Radio checked={this.state.type === 'laoban'} onChange={()=>this.handleChange('type','laoban')}>老板</Radio>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={this.state.type === 'dashen'} onChange={()=>this.handleChange('type','dashen')}>大神</Radio>
                        </List.Item>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.register}>注册</Button>
                        <WhiteSpace />
                        <Button onClick={this.toLogin}>已有账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {register}
)(Register)

```

### 登录组件

```jsx
import React, { Component } from 'react'
import {NavBar,WingBlank,List,InputItem,Button,WhiteSpace} from 'antd-mobile'

import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'

class Login extends Component {
    state = {
        username:'',
        password:''
    }
    handleChange = (name,value)=>{
        this.setState({
            [name]:value
        })
    }
    login = ()=>{
        this.props.login(this.state)
    }
    toRegister = ()=>{
        this.props.history.replace('/register')
    }
    render() {
        const {redirectTo,msg} = this.props
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
                <NavBar>硅谷直聘</NavBar>
                <Logo />
                <WingBlank>
                    {msg ? <p className='error-msg'>{msg}</p>:null}
                    <List>
                        <InputItem type="text" onChange={val => this.handleChange('username',val)}>用户名:</InputItem>
                        <InputItem type="password" onChange={val => this.handleChange('password',val)}>密&nbsp;&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <Button type="primary" onClick={this.login}>登录</Button>
                        <WhiteSpace />
                        <Button onClick={this.toRegister}>还没账号</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => state.user,
    {login}
)(Login)
```

### 样式: 

**assets/css/index.less**

```less
.error-msg {
color: red;
text-align: center;
font-size: 18px;
}
//需要在 index.js 中引入
```

## 实现 user 信息完善功能

**下载相关依赖包**

```sh
npm install --save js-cookie@2.2.0
```

### 注册/登陆成功的路由跳转

**1.工具模块: utils/index.js**

```js
export function getRedirectPath(type,header){
    let path = ''

    // 根据type得到path
    path += type === 'laoban' ? '/laoban': '/dashen'

    if(!header){
        path += 'info'
    }
    
    return path
}
```

**2.reducers 中使用工具: redux/reducers.js**

**作用：登录后跳转到信息完善页**

```js
import {getRedirectPath} from '../utils'

case AUTH_SUCCESS: //登录成功
    const redirectTo = getRedirectPath(action.data.type,action.data.header)
    return {...action.data,redirectTo}
```

### **后台路由: routes/index.j**

```js
router.post('/update',(req,res)=>{
  // 得到请求cookie的userid
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:'请先登录'})
  }

  // 更新数据库中对应的数据
  UserModel.findByIdAndUpdate({_id:userid},req.body,(err,user)=>{
    const {_id,username,type} = user
    const data = Object.assign(req.body,{_id,username,type})
    res.send({code:0,data})
  })
})
```

### **更新的 ajax 请求: api/index.js**

```js
// 更新用户信息
export const reqUpdateUser = user =>{
    return ajax('/update',user,'POST')
}
```

### redux 更新状态

**1.配置常量：redux/action-types.js**

```js
// 接收用户
export const RECEIVE_USER = 'RECEIVE_USER'
// 重置用户
export const RESET_USER = 'RESET_USER'
```

**2.action配置redux/actions.js**

```js
// 导入常量
import {RECEIVE_USER,RESET_USER} from './action-types'
// 导入请求api
import {reqUpdateUser} from '../api'

// 同步接收用户
const receiverUser = user =>{
    return {type:RECEIVE_USER,data:user}
}
// 同步重置用户
export const resetUser = msg =>{
    return {type:RESET_USER,data:msg}
}

// 异步更新用户
export const updateUser = user=>{
    return async dispatch =>{
        // 发送异步ajax请求
        const response = await reqUpdateUser(user)
        const result = response.data
        if(result.code === 0){
            dispatch(receiverUser(result.data))
        }else{
            dispatch(resetUser(result.msg))
        }
    }
}
```

**3.reducer配置：redux/reducers.js**

```js
import { RECEIVE_USER,RESET_USER} from './action-types'
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER: // 接收用户
        return action.data
        case RESET_USER: // 重置用户
        return {...initUser, msg: action.data}
    }
}
```

### 用户头像选择组件

**安装依赖**

```sh
npm install prop-types@15.6.1 --save
```

**添加多个头像图片文件: assets/images**

**头像选择器组件**

组件: components/header-selector/header-selector.jsx

```html
<!-- 宫格 -->
<Grid data={this.headerList} columnNum={5} onClick={this.selectHeader}/>
```

```jsx
import React, { Component } from 'react'
import {List,Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

    static PropTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        icon: null
    }

    constructor(props){
        super(props)
        this.headerList = []
        for(var i = 0;i < 20; i++){
            const text = `头像${i+1}`
            this.headerList.push({text,icon: require(`../../assets/images/${text}.png`)})
        }
    }

    selectHeader = ({icon,text}) =>{
        // 更新当前组件的状态
        this.setState({icon})
        // 更新父组件的状态
        this.props.setHeader(text)
    }

    render() {
        // 计算头部显示
        const {icon} = this.state
        const gridHeader = icon ? <p>已选择头像: <img src={icon} alt="header"/></p>:'请选择头像'
        return (
            <List renderHeader = {()=>gridHeader}>
                <Grid data = {this.headerList}
                    columNum = {5}
                    onClick = {this.selectHeader}
                />
            </List>
        )
    }
}
```

### 老板信息完善组件

containers/laoban-info/laoban-info.jsx

```jsx
import React, { Component } from 'react'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

class LaobanInfo extends Component {
    state = {
        header: '',//头像名称
        info:'', //职位简介
        post:'', //职位名称
        company:'',//公司名称
        salary:''//工资
    }
    handleChange = (name,val)=>{
        this.setState({[name]:val})
    }
    setHeader = (header)=>{
        this.setState({header})
    }
    render() {
        const {user} = this.props
        // 如果用户信息已完善, 自动跳转到 laoban 主界面
        if(user.header) {
        return <Redirect to='/laoban'/>
        }
        return (
            <div>
                <NavBar>老板信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem onChange={val => this.handleChange('post',val)}>招聘职位</InputItem>
                <InputItem onChange={val => this.handleChange('company',val)}>公司名称</InputItem>
                <InputItem onChange={val => this.handleChange('salary',val)}>职位薪资</InputItem>
                <TextareaItem title="职位要求" rows={3} onChange={val => this.handleChange('info',val)}/>
                <Button type='primary' onClick={()=>this.props.updateUser(this.state)}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {updateUser}
)(LaobanInfo)
```

### 大神信息完善组件

containers/dashen-info/dashen-info.jsx

```jsx
import React, { Component } from 'react'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import HeaderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

class DashenInfo extends Component {
    state = {
        header: '',// 头像名称
        info:'', // 个人简介
        post:'', // 求助岗位
    }
    handleChange = (name,val)=>{
        this.setState({[name]:val})
    }
    setHeader = (header)=>{
        this.setState({header})
    }
    render() {
        const {user} = this.props
        // 如果用户信息已完善, 自动跳转到大神主界面
        if(user.header){
            return <Redirect to='/dashen'/>
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem onChange={val => this.handleChange('post',val)}>求职岗位</InputItem>
                <TextareaItem title="个人介绍" rows={3} onChange={val => this.handleChange('info',val)}/>
                <Button type='primary' onClick={()=>this.props.updateUser(this.state)}>保存</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {updateUser}
)(DashenInfo)
```

### main 组件

containers/main/main.jsx

```jsx
import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'
import Cookies from 'js-cookie'
import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'

export default class Main extends Component {
    render() {
        const userid = Cookies.get('userid')
        // 如果没有登录返回主界面
        if(!userid){
            this.props.history.replace('/login')
            return null
        }
        return (
            <div>
                <Switch>
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>
                </Switch>
            </div>
        )
    }
}
```

## 搭建整体界面

### 后台路由: routes/index.js

```js
// 根据cookie获取相应的user
router.get('/user',(req,res)=>{
  // 取出cookie中的userid
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code: 1,msg: '请先登录'})
  }

  // 查询相应的user
  UserModel.findOne({_id: userid},{password:0},(err,user)=>{
    return res.send({code: 0,data: user})
  })
})
```

### 获取用户

```js
// 获取用户信息
export const reqUser = () =>{
    return ajax('/user')
}
```

### redux 管理状态

**redux/actions.js**

```js
export const getUser = ()=>{
    return async dispatch =>{
        const response = await reqUser()
        const result = response.data
        if(result.code === 0){
            dispatch(receiverUser(result.data))
        }else{
            dispatch(resetUser(rese.data))
        }
    }
}
```

### main 路由的子路由

**containers/laoban/laoban.jsx**

```jsx
import React, { Component } from 'react'

export default class Laoban extends Component {
    render() {
        return (
            <div>
                老板列表
            </div>
        )
    }
}
```

**containers/dashen/dashen.jsx**

```jsx
import React, { Component } from 'react'

export default class Dashen extends Component {
    render() {
        return (
            <div>
                dashen
            </div>
        )
    }
}
```

**containers/message/message.js**

```jsx
import React, { Component } from 'react'

export default class Message extends Component {
    render() {
        return (
            <div>
                Message
            </div>
        )
    }
}
```

**containers/personal/personal.jsx**

```jsx
import React, { Component } from 'react'

export default class Personal extends Component {
    render() {
        return (
            <div>
                personal
            </div>
        )
    }
}
```

**components/not-found/not-found.jsx**

```jsx
import React, { Component } from 'react'
import {Button} from 'antd-mobile'

export default class NotFound extends Component {
    render() {
        return (
            <div>
                <h2>找不到该页面</h2>
                <Button type='primary' onClick={this.props.history.replace("/")}>回到首页</Button>
            </div>
        )
    }
}
```

### 底部导航组件

**1.相关图标图片**

**2.组件: components/nav-footer/nav-footer.jsx**

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {TabBar} from 'antd-mobile'

const Item = TabBar.Item

class NavFooter extends Component {
    static propTypes = {
        navList:PropTypes.array.isRequired
    }
    render() {
        // 获取底部导航列表
        const navList = this.props.navList.filter(nav=>{
            return !nav.hide
        })

        // 获取当前请求路径
        const {pathname} = this.props.location
        return (
            <TabBar>
                {
                    navList.map(nav=>(
                        <Item
                            key={nav.path}
                            title={nav.text}
                            icon = {{uri:require(`./images/${nav.icon}.png`)}}
                            selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                            selected={pathname === nav.path}
                            onPress={()=>{
                                this.props.history.replace(nav.path)
                            }}
                        />
                    ))
                }
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)
```

### 应用主界面路由组件

**1.containers/main/main.jsx**

```jsx
import React, { Component } from 'react'
import {Switch,Route} from 'react-router-dom'
import Cookies from 'js-cookie'
import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Message from '../message/message'
import Personal from '../personal/personal'
import NotFound from '../../components/not-found/not-found'
import NavFooter from '../../components/nav-footer/nav-footer'
import { connect } from 'react-redux'
import {getUser} from '../../redux/actions'
import {getRedirectPath} from '../../utils/'
import { NavBar } from 'antd-mobile'

class Main extends Component {
    // 给组件对象添加属性
    navList = [ // 包含所有导航组件的相关信息数据
        {
        path: '/laoban', // 路由路径
        component: Laoban,
        title: '大神列表',
        icon: 'dashen',
        text: '大神',
        },
        {
        path: '/dashen', // 路由路径
        component: Dashen,
        title: '老板列表',
        icon: 'laoban',
        text: '老板',
        },
        {
        path: '/message', // 路由路径
        component: Message,
        title: '消息列表',
        icon: 'message',
        text: '消息',
        },
        {
        path: '/personal', // 路由路径
        component: Personal,
        title: '用户中心',
        icon: 'personal',
        text: '个人',
        }
    ]
    componentDidMount(){
        const userid = Cookies.get('userid')
        const {user} = this.props
        if(userid && !user._id){
            this.props.getUser() //获取user并保存到redux中
        }
    }
    render() {
        const pathname = this.props.location.pathname

        const userid = Cookies.get('userid')
        if(!userid){
            this.props.history.replace('/login')
            return null
        }
        const {user} = this.props
        if(!user._id){
            return null //不做任何显示
        }else{
            if(pathname === '/'){
                const path = getRedirectPath(user.type,user.header)
                this.props.history.replace(path)
                return null
            }
            if(user.type === 'laoban'){
                this.navList[1].hide = true
            }else{
                this.navList[0].hide = true
            }
        }

        // 得到当前的nav
        const currentNav = this.navList.find(nav => nav.path === pathname)
        return (
            <div>
                {currentNav ? <NavBar>{currentNav.title}</NavBar>:null}
                <Switch>
                    <Route path='/laobaninfo' component={LaobanInfo}/>
                    <Route path='/dasheninfo' component={DashenInfo}/>

                    <Route path='/dashen' component={Dashen}/>
                    <Route path='/laoban' component={Laoban}/>
                    <Route path='/message' component={Message}/>
                    <Route path='/personal' component={Personal}/>
                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter unReadCount={this.props.unReadCount} navList={this.navList}/> : null}
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {getUser}
)(Main)
```

## 个人中心组件

 **containers/personal/personal.jsx**

1.静态组件

```jsx
import React, { Component } from 'react'
import {Result,List,WhiteSpace,Button} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

export default class Personal extends Component {
    render() {
        return (
            <div>
                <Result
                    img={<img src={require(`../../assets/images/头像1.png`)} style={{width: 50}} alt="header"/>}
                    title='张三'
                    message='IBM'
                />

                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>职位: 前端工程师</Brief>
                        <Brief>简介: React/Vue/jQuery</Brief>
                        <Brief>薪资: 20k</Brief>
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button type='warning'>退出登录</Button>
                </List>
            </div>
        )
    }
}
```

**2.动态组件**

```jsx
import React, { Component } from 'react'
import {Result,List,WhiteSpace,Modal,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import { resetUser } from "../../redux/actions";

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component {
    handleLogout = ()=>{
        Modal.alert('退出', '确认退出登录吗?', [
            { text: '取消'},
            { text: '确认', onPress: () => {
                Cookies.remove('userid')
                this.props.resetUser()
            }},
        ]) 
    }
    render() {
        const {username, header, post, info, salary, company} = this.props.user
        return (
            <div>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt="header"/>}
                    title={username}
                    message={company}
                />

                <List renderHeader={()=>'相关信息'}>
                    <Item multipleLine>
                        <Brief>职位: {post}</Brief>
                        <Brief>简介: {info}</Brief>
                        {salary?<Brief>薪资: {salary}</Brief>:null}
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    <Button onClick={this.handleLogout} type='warning'>退出登录</Button>
                </List>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),
    {resetUser}
)(Personal)
```

样式文件

assets/css/index.less

```less
.am-tab-bar{ /*使导航始终在底部*/
    position: fixed;
    bottom: 0;
    width: 100%;
    height: inherit; 
}
```

## 老板/大神列表功能

### 后台路由

routes/index.js

```js
//查看用户列表
router.get('/list',(req,res)=>{
  const { type } = req.query
  UserModel.find({type},(err,users)=>{
    return res.send({code:0,data: users}) 
  })
})
```

### ajax 请求模块

api/index.js

```js
// 请求获取用户列表
export const reqUserList = type=>{
  return ajax('/list',{type})
}
```

### redux 管理状态

**1.redux/action-types.js**

```js
export const RECEIVE_USER_LIST = 'receive_user_list'
```

**2.redux/actions.js**

```js
import {RECEIVE_USER_LIST} from './action-types'
import {reqUserList} from '../api'

// 用户列表
const receiveUserList = users=>{
    return {type:RECEIVE_USER_LIST,data:users}
}

// 异步获取用户列表
export const getUserList = (type) =>{
    return async dispatch => {
        const response = await reqUserList(type)
        const result = response.data
        if(result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
}
```

**3.redux/reducers.js**

```js
const initUserlist = []
function userList(state=initUserlist,action){
    switch (action.type){
        case RECEIVE_USER_LIST:
            return action.data
        default:
            return state
    }
}

// 返回合并后的reducer函数
export default combineReducers({
    user,
    userList
})
```

### 用户列表组件

components/user-list/user-list.jsx

```jsx
import React, { Component } from 'react'
import { Card,WingBlank,WhiteSpace } from 'antd-mobile'

const Header = Card.Header
const Body = Card.Body

export default class UserList extends Component {
    render() {
        return (
            <WingBlank>
                <div>
                    <WhiteSpace/>
                    <Card>
                        <Header 
                            thumb={require(`../../assets/images/头像1.png`)}
                            extra='aa'
                        />
                        <Body>
                            <div>职位: 前端工程师</div>
                            <div>公司: Google</div>
                            <div>月薪: 18K</div>
                            <div>描述: React/Vue</div>
                        </Body>
                    </Card>
                </div>
            </WingBlank>
        )
    }
}
```

### 动态组件

```jsx
import React, { Component } from 'react'
import { Card,WingBlank,WhiteSpace } from 'antd-mobile'
import PropTypes from 'prop-types'

const Header = Card.Header
const Body = Card.Body

export default class UserList extends Component {

    static propsTypes = {
        userList: PropTypes.array.isRequired
    }
    render() {
        return (
            <WingBlank>
                {
                    this.props.userList.map(user=>(
                        <div key={user._id}>
                            <WhiteSpace/>
                            <Card>
                                <Header 
                                    thumb={require(`../../assets/images/${user.header}.png`)}
                                    extra={user.name}
                                />
                                <Body>
                                <div>职位: {user.post}</div>
                                {user.company ? <div>公司: {user.company}</div> : null}
                                {user.salary ? <div>月薪: {user.salary}</div> : null}
                                <div>描述: {user.info}</div>
                                </Body>
                            </Card>
                        </div>
                    ))
                }
            </WingBlank>
        )
    }
}
```

### 老板路由组件: 

containers/laoban/laoban.jsx

```jsx
import React, { Component } from 'react'
import { connect } from "react-redux";
import { getUserList } from "../../redux/actions";
import UserList from "../../components/user-list/user-list";

class Laoban extends Component {
    componentDidMount(){
        this.props.getUserList('dashen')
    }
    render() {
        return (
            <UserList userList={this.props.userList}></UserList>
        )
    }
}
 
export default connect(
    state => ({userList:state.userList}),
    {getUserList}
)(Laoban)
```

### 大神路由组件

containers/dashen/dashen.jsx

```jsx
import React, { Component } from 'react'
import { connect } from "react-redux";
import { getUserList } from "../../redux/actions";
import UserList from "../../components/user-list/user-list";

class Dashen extends Component {
    componentDidMount(){
        this.props.getUserList('laoban')
    }
    render() {
        return (
            <UserList userList={this.props.userList}/>
        )
    }
}

export default connect(
    state => ({userList:state.userList}),
    {getUserList}
)(Dashen)

```

### 优化头部和底部的布局效果

问题: 列表滑动, 顶部会跟着滑动而不可见 底部导航会遮挡列表的部分显示

**1.Index.less**

```less
.stick-top { /*固定在顶部*/
    z-index: 10;
    position: fixed;
    top: 0;
    width: 100%;
}
```

**2.main.jsx**

```jsx
<NavBar className='stick-top'>{currentNav.title}</NavBar>
```

**3.user-list.jsx**

```jsx
<WingBlank style={{marginTop: 50, marginBottom: 50}}>
```

## 实时聊天功能

**相关依赖包**

```sh
npm install --save socket.io@2.1.0
```

**服务器端**
socketIO/test.js

```js
// 导出socketIO
module.exports = function(server){
    // 通过服务器创建io
    const io = require('socket.io')(server)
    // 监视连接
    io.on('connection',(socket)=>{
        console.log('socketio connected');
        // 绑定sendMsg监听,接收客户端发送的消息
        socket.on('sendMsg',function(data){
            console.log('服务器接收到浏览器的消息',data);
            // 向客户端发送消息(名称,数据)
            io.emit('receiveMsg',data.name+'_'+data.data)
            console.log('服务器向浏览器发送消息',data);
        })
    })
}
```

bin/www

```js
// 向服务器传递server
require('../socketIO/test')(server)
```

客户端 

src/test/socketio_test.js

```js
// 引入客户端io
import io from 'socket.io-client'

// 连接服务器,得到代表连接的socket对象
const socket = io('ws://localhost:4000')

// 监听receiveMessage消息,来接收服务器发送的消息
socket.on('receiveMsg',data=>{
    console.log('浏览器端接收到消息',data);
})

// 向服务器发送消息
socket.emit('sendMsg',{name:'Tom',data:Date.now()})
console.log('浏览器端向服务器发送消息:',{name:'Tom',data:Date.now()});
```

src/index.js

```js
import './test/socketio_test'
```

### 后台实现

**添加新的数据库集合模型: db/models.js**

```js
const mongoose = require('mongoose')
// 指定数据库
mongoose.connect('mongodb://localhost:27017/boosz')
// 获取连接
const conn = mongoose.connection
// 绑定连接完成的监听
conn.on('connected',()=>{
    console.log("数据库连接成功");
})

// 定义Schema
const userSchema = mongoose.Schema({
    username: {type: String,required:true},//用户名
    password: {type: String,required:true},//密码
    type:{type: String,required:true},//用户类型
    header:{type:String},//用户头像
    post:{type:String},//职位
    info:{type:String},//简介
    company:{type:String},//公司名称
    salary:{type:String}//工资
})

// 定义model
const UserModel = mongoose.model('user',userSchema)

// 向外暴露
exports.UserModel = UserModel

// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type:String,required:true}, // 发送用户的is
    to: {type:String,required:true},  // 接收用户的id
    chat_id:{type:String,required:true}, // from和to组成的字符串
    content:{type:String,required:true}, // 内容
    read:{type:Boolean,default:false}, //标识是否以读
    create_time:{type:Number} //创建时间
})

// 定义操作chats集合数据的Model
const ChatModel = mongoose.model('chat',chatSchema)

// 向外暴露Model
exports.ChatModel = ChatModel
```

**新增路由: routes/index.js**

```js
// 获取当前用户所有相关聊天信息列表
router.get('/msglist',(req,res)=>{
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find((err,userDocs)=>{
    // 用对象存储所有 user 
    //信息: key 为 user 的_id, val 为 name 和 header 组成的 user 对象
    const users = {} //对象容器
    userDocs.forEach(doc =>{
      users[doc.id] = {username:doc.username,header:doc.header}
    })
    //查询 userid 相关的所有聊天信息
    ChatModel.find({'$or':[{from:userid},{to:userid}]},{password:0},(err,chatMsgs)=>{
      // 返回包含所有用户和当前用户相关所有聊天信息的数据
      res.send({code:0,data:{users,chatMsgs}})
    })
    console.log(users);
  })
})

//修改指定消息为已读
router.post('/readmsg',(req,res)=>{
  // 得到请求中的from和to
  const {from} = req.body
  const to = req.cookies.userid

  /*更新数据库中的 chat 数据
  参数 1: 查询条件
  参数 2: 更新为指定的数据对象
  参数 3: 是否 1 次更新多条, 默认只更新一条
  参数 4: 更新完成的回调函数
  */
  ChatModel.update({from,to,read:false},{read:true},{multi:true},(err,doc)=>{
    console.log('/readmsg',doc);
    res.send({code:0,data:doc.nModified}) // 更新的数量
  })
})
```

**返回的用户信息**

```json
{
  '6012696327073057a8e57eac': { username: 'admin', header: '头像2' },
  '6013718f9a5d285850944c1a': { username: 'aa', header: '头像6' },
  '6015061a193f100e50db3f57': { username: '周杰伦', header: '头像6' },
  '601506bf193f100e50db3f58': { username: '张三', header: '头像2' },
  '601506e6193f100e50db3f59': { username: '王者', header: '头像18' },
  '60150734193f100e50db3f5a': { username: '大佬', header: '头像7' }
}
```

**使用上 socket.io 实现实时通信**

server_socket.js

```js
module.exports = function(server){
    // 引入操作chats集合数据的model
    const {ChatModel} = require('../db/models')
    // 得到操作服务端socketIO的io对象
    const io = require('socket.io')(server)

    // 绑定监听回调:客户端连接上服务器
    io.on('connect',socket=>{
        console.log('有客户端连接上了服务器');
        socket.on('sendMessage',({from,to,content})=>{
            console.log('服务器接收到数据',{from,to,content})
            // 将接收到的消息保存到数据库
            const chat_id = [from,to].sort().join('_')
            const create_time = Date.now()
            const chatModel = new ChatModel({chat_id,from,to,create_time,content})
            chatModel.save((err,chatMsg)=>{
                // 保存完成后,向所有连接的客户端发送消息
                io.emit('receiveMessage',chatMsg) //全局发送,所有连接的客户端都可以收到
                console.log('向所有连接的客户端发送消息',chatMsg);
            })
        })
    })
}
```

bin/www

```js
// 向socket服务器传递server
require('../socketIO/server_socket')(server)
```

### ajax 请求模块

api/index.js

```js
// 请求获取当前用户的所有聊天记录
export const reqChatMsgList = ()=>{
    return ajax('/msglist')
}

// 标识为已读
export const reqReadChatMsg = from =>{
    return ajax('/readmsg',{from},'POST')
}
```

### redux 管理状态

**1.redux/action-types.js**

```js
// 接收消息列表
export const RECEIVE_MSG_LIST = 'receive_msg_list'
// 接收一条消息
export const RECEIVE_MSG = 'receive_msg'
// 标识消息已读
export const MSG_READ = 'msg_read'
```

**2.redux/actions.js**

```js
import io from 'socket.io-client'
import { RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ } from './action-types'
import {reqChatMsgList,reqReadChatMsg} from '../api'

// 接收消息列表的同步action
const receiveMsgList = ({users,chatMsgs,userid})=>{
    return {type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}}
}

// 接收消息的同步 action
const receiveMsg = (chatMsg,isToMe) =>{
    return {type:RECEIVE_MSG,data:{chatMsg,isToMe}}
}

// 读取了消息的同步action
const msgRead = ({from,to,count}) =>{
    return {type:MSG_READ,data:{from,to,count}}
}

// 初始化客户端socketio
function initIO(dispatch,userid){
    if(!io.socket){
        io.socket = io('ws://localhost:4000')
        io.socket.on('receiveMsg',chatMsg=>{
            if(chatMsg.from===userid || chatMsg.to===userid){
                dispatch(receiveMsg(chatMsg,chatMsg.to === userid))
            }
        })
    }
}

/*获取当前用户相关的所有聊天消息列表
(在注册/登陆/获取用户信息成功后调用)
*/

async function getMsgList(dispatch,userid){
    initIO(dispatch,userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0){
        const {chatMsgs,users} = result.data
        dispatch(receiveMsgList({chatMsgs,users,userid}))
    }
}

// 发送消息的异步 action
export const sendMsg = ({from,to,content})=>{
    return async dispatch =>{
        io.socket.emit('sendMsg',{from,to,content})
    }
}

// 更新读取消息的异步 action
export const readMsg = userid =>{
    return async (dispatch,getState) =>{
        const response = await reqReadChatMsg(userid)
        const result = response.data
        if(result.code===0){
            const count = result.data
            const from = userid
            const to = getState().user._id
            dispatch(msgRead({from,to,count}))
        }
    }
}
```

**redux/reducers.js**

```js
import RECEIVE_MSG_LIST,RECEIVE_MSG,MSG_READ} from './action-types'

// 初始chat对象
const initChat = {
    chatMsgs: [], //消息数组[{from: id1, to: id2}{}]
    users:{}, //所有用户的集合对象{id1:user1,id2:user2}
    unReadCount:0 //未读消息的数量
}

// 管理聊天相关信息数据的reducer
function chat(state=initChat,action){
    switch(action.type){
        case RECEIVE_MSG:
            var {chatMsg,userid} = action.data
            return {
                chatMsgs: [...state.chatMsgs,chatMsg],
                users: state.users,
                unReadCount: state.unReadCount+(!chatMsg.read && chatMsg.to===userid?1:0)
            }
            case RECEIVE_MSG_LIST:
                var {chatMsgs,users,userid} = action.data
                return {
                    chatMsgs,
                    users,
                    unReadCount: chatMsgs.reduce((preTotal,msg)=>{
                        return preTotal + (!msg.read&&msg.to===userid?1:0)
                    },0)
                }
            case MSG_READ:
                const {count,from,to} = action.data
                return {
                    chatMsgs: state.chatMsgs.map(msg=>{
                        if(msg.from===from && msg.to===to && !msg.read){
                            return {...msg,read:true}
                        }else{
                            return msg
                        }
                    }),
                    users: state.users,
                    unReadCount: state.unReadCount-count
                }
            default:
                return state
    }
}

// 返回合并后的reducer函数
export default combineReducers({
    user,
    userList,
    chat
})
```

### 聊天组件

containers/chat/chat.jsx

1.静态组件

```jsx
import React, { Component } from 'react'
import {NavBar,List,InputItem} from 'antd-mobile'
const Item = List.Item

export default class Chat extends Component {
    render() {
        return (
                <div id='chat-page'>
                    <NavBar>aa</NavBar>
                    <List>
                        <Item
                            thumb={require('../../assets/images/头像1.png')}
                        >
                        你好
                        </Item>
                        <Item
                            thumb={require('../../assets/images/头像1.png')}
                        >
                        你好 2
                        </Item>
                        <Item
                            className='chat-me'
                            extra='我'
                        >
                        很好
                        </Item>
                        <Item
                            className='chat-me'
                            extra='我'
                        >
                        很好 2
                        </Item>
                    </List>
                    <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        extra={
                        <span>发送</span>
                        }
                    />
                    </div>
                </div>
        )
    }
}
```

css/index.less

```less
/*消息文本居右*/
#chat-page .chat-me .am-list-extra {
    flex-basis: auto; /*宽度包裹内容*/
}
#chat-page .chat-me .am-list-content {
    padding-right: 15px;
    text-align: right;
}
```

**动态组件**

```jsx
import React, { Component } from 'react'
import {NavBar,List,InputItem, Icon} from 'antd-mobile'
import {connect} from 'react-redux'
import { sendMsg } from "../../redux/actions";

const Item = List.Item

class Chat extends Component {
    state = {
        content:''
    }

    handSend = ()=>{
        // 获取自己的id
        const from = this.props.user._id
        // 从地址获取对方的id
        const to = this.props.match.params.id

        const content = this.state.content.trim()
        // 如果不为空发送
        if(content){
            this.props.sendMsg({from,to,content})
        }
        //console.log({from,to,content});
        // 清除输入框
        this.setState({
            content:''
        })

    }
    render() {
        // 获取自己
        const {user} = this.props
        // 所有用户和所有聊天记录
        let {users,chatMsgs} = this.props.chat

        // 计算当前聊天的chatId
        const meId = user._id
        if(!users[meId]){ //如果没有数据,直接不做任何显示
            return null
        } 

        console.log(this.props);
        let targetId = this.props.match.params.id
        // 拼接聊天id
        const chatId = [targetId,meId].sort().join('_')
        
        // 过滤只接受和自己相关的聊天记录
        const msgs = chatMsgs.filter((msg)=>{
            return msg.chat_id === chatId
        })
        
        // 得到目标对象的header头像
        const targetHeader = users[targetId].header

        // console.log(users[targetId].username);
        return (
                <div id='chat-page'>
                    <NavBar
                        icon={<Icon type='left'/>}
                        className='stick-top'
                        onLeftClick={()=>this.props.history.goBack()}
                    >{users[targetId].username}</NavBar>
                    <List style={{marginBottom:50, marginTop:50}}>
                        {
                            msgs.map(msg=>{
                                if(msg.to === meId){
                                    return (
                                        <Item
                                            key={msg._id}
                                            thumb={require(`../../assets/images/${targetHeader}.png`)}
                                        >
                                        {msg.content}
                                        </Item>
                                    )
                                }else{
                                    return (
                                        <Item
                                            key={msg._id}
                                            className='chat-me'
                                            extra='我'
                                        >
                                        {msg.content}
                                        </Item>
                                    )
                                }
                            })
                        }
                    </List>
                    <div className='am-tab-bar'>
                    <InputItem
                        placeholder="请输入"
                        value={this.state.content}
                        onChange={val=>this.setState({content:val})}
                        extra={
                        <span onClick={this.handSend}>发送</span>
                        }
                    />
                    </div>
                </div>
        )
    }
}

export default connect(
    state=>({user:state.user,chat:state.chat}),
    {sendMsg}
)(Chat)
```

**列表自动滑到底部显示**

```jsx
componentDidMount(){
    // 初始化显示列表
    window.scrollTo(0,document.body.scrollHeight)
}

componentDidUpdate(){
    // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
}
```

**表情功能**

本质就是一个字符文本, 可以作用为字符串直接使用, 各个操作系统能显示 在线可用表情: https://emojipedia.org/

```jsx

state = {
content:'',
isShow:false
}

componentWillMount(){
    // 初始化表情列表数据
    const emojis = ['😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
    ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣']
    this.emojis = emojis.map(emoji=>{
    	return {text:emoji}
	})     
	console.log(this.emojis);
}

// 显示表情
toggleShow = ()=>{
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow) {
    // 异步手动派发resize事件,解决表情列表显示的bug
    setTimeout(() => {
    	window.dispatchEvent(new Event('resize'))
    }, 0)
}

handSend = ()=>{
    ...
    // 清除输入框
    this.setState({
    	content:'',
    	isShow:false
    })
}

<div className='am-tab-bar'>
<InputItem
    placeholder="请输入"
    value={this.state.content}
    onChange={val=>this.setState({content:val})}
    extra={
        <span>
            <span onClick={this.toggleShow} style={{marginRight:5}}>😁</span>
            <span onClick={this.handSend}>发送</span>
        </span>
    }
/>
{this.state.isShow ? <Grid 
    data={this.emojis}
    columnNum={5}
    carouselMaxRow={4}
    isCarousel={true}
    onClick={(item)=>{
    this.setState({content:this.state.content+item.text})
}}
/>:null}
```

### 消息列表组件

containers/message/message.jsx

**1.静态组件**

```jsx
import React, { Component } from 'react'
import { List,Badge } from "antd-mobile";

const Item = List.Item
const Brief = Item.Brief

export default class Message extends Component {
    render() {
        return (
            <List style={{marginTop:50,marginBottom:50}}>
                <Item
                    extra={<Badge text={3}/>}
                    thumb={require(`../../assets/images/头像1.png`)}
                    arrow='horizontal'
                >
                    你好
                    <Brief>nr1</Brief>
                </Item>
                <Item
                    extra={<Badge text={0}/>}
                    thumb={require(`../../assets/images/头像2.png`)}
                    arrow='horizontal'
                >
                    你好 2
                    <Brief>nr2</Brief>
                </Item>
            </List>
        )
    }
}
```

**动态组件**

```jsx
import React, { Component } from 'react'
import { List,Badge } from "antd-mobile";
import { connect } from "react-redux";

const Item = List.Item
const Brief = Item.Brief

function getLastMsgs(meId,chatMsgs){

    const lastMsgsObj = {}
    chatMsgs.forEach(msg=>{
        msg.unReadCount = 0
        // 判断当前 msg 对应的 lastMsg 是否存在
        const chatId = msg.chat_id
        // 查看last对象是否有当前id的消息
        const lastMsg = lastMsgsObj[chatId]

        // 如果没有当前id消息
        if(!lastMsg){
           lastMsgsObj[chatId] = msg
           // 如果是别人给我发的消息
           if(!msg.read && meId === msg.to){
               msg.unReadCount = 1
           } 
        }else{
            // 如果这条消息晚于里面存的消息
            if(msg.create_time>lastMsg.create_time){
                lastMsgsObj[chatId] = msg
                // 将原有保存的未读数量保存到新的 lastMsg
                msg.unReadCount = lastMsg.unReadCount
            }
            // 如果是别人给我发的消息
            if(!msg.read && meId === msg.to){
                msg.unReadCount++
            }
        }

    })
    // 得到所有分组的 lastMsg 组成数组
    const lastMsgs = Object.values(lastMsgsObj)
    // 对数组进行排序
    lastMsgs.sort((msg1,msg2)=>{
        return msg2.create_time-msg1.create_time
    })
    return lastMsgs
}

class Message extends Component {
    render() {
        const {chatMsgs,users} = this.props.chat
        const {user} = this.props

        const meId = user._id
        const lastMsgs = getLastMsgs(meId,chatMsgs)
        console.log(lastMsgs);
        return (
            <List style={{marginTop:50,marginBottom:50}}>
                {
                    lastMsgs.map(msg=>{
                        // 得到目标用户的id
                        const targetUserId = meId===msg.from?msg.to:msg.from
                        const targetUser = users[targetUserId]
                        return (
                            <Item
                                key={msg.chat_id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={require(`../../assets/images/${targetUser.header}.png`)}
                                arrow='horizontal'
                                onClick={()=>{this.props.history.push(`/chat/${targetUserId}`)}}
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state =>({
        user:state.user,
        chat:state.chat
    })
)(Message)

```

### 应用主界面路由组件

containers/main/main.jsx

```jsx
{currentNav ? <NavFooter unReadCount={this.props.unReadCount} navList={this.navList}/> : null}

export default connect(
    state => ({
        user:state.user,
        unReadCount:state.chat.unReadCount
    }),
    {getUser}
)(Main)
```

### 显示总未读消息数量

components/nav-footer/nav-footer.jsx

```jsx
static propTypes = {
    navList:PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
}

badge={nav.path === '/message' ? this.props.unReadCount:0}
```

**完整代码**

```jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {TabBar} from 'antd-mobile'

const Item = TabBar.Item

class NavFooter extends Component {
    static propTypes = {
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    }
    render() {
        console.log(this.props);
        // 获取底部导航列表
        const navList = this.props.navList.filter(nav=>{
            return !nav.hide
        })

        // 获取当前请求路径
        const {pathname} = this.props.location
        return (
            <TabBar>
                {
                    navList.map(nav=>(
                        <Item 
                            key={nav.path}
                            badge={nav.path === '/message' ? this.props.unReadCount:0}
                            title={nav.text}
                            icon = {{uri:require(`./images/${nav.icon}.png`)}}
                            selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                            selected={pathname === nav.path}
                            onPress={()=>{
                                this.props.history.replace(nav.path)
                            }}
                        />
                    ))
                }
            </TabBar>
        )
    }
}

export default withRouter(NavFooter)
```

### 查看聊天后, 更新未读数量

chat.jsx

```jsx
import { sendMsg,readMsg } from "../../redux/actions";

componentDidMount() {
// 初始显示列表
window.scrollTo(0, document.body.scrollHeight)
	this.props.readMsg(this.props.match.params.userid)
}
componentWillUnmount() {
	this.props.readMsg(this.props.match.params.userid)
}

export default connect(
    state=>({user:state.user,chat:state.chat}),
    {sendMsg,readMsg}
)(Chat)
```

### 添加聊天的页面的动画效果

下载依赖包 

```
npm install --save rc-queue-anim@1.5.0
```

在聊天组件使用: containers/chat/chat.jsx

```jsx
import QueueAnim from 'rc-queue-anim'
{/*alpha left right top bottom scale scaleBig scaleX scaleY*/}
<QueueAnim type='scale' delay={100}>
{chatMsgs.map(msg => {
const avatar = require(`../../assets/imgs/${users[msg.from].avatar}.png`)
if (msg.from === userid) {
return (
<Item
key={msg._id}
thumb={avatar}
>{msg.content}</Item>
)
} else {
return (
<Item
key={msg._id}
extra={<img src={avatar}/>}
className='chat-me'
>{msg.content}</Item>
)
}
})}
</QueueAnim>
```

