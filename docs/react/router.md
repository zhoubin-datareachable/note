---
sidebar: true
sidebarDepth: 2
title: 路由
---

## 安装

**NPM**

```shell
npm install --save react-router-dom
```

如果在一个模块化工程中使用它，必须要通过导入路由功能：

```js
import {Link,Route} from 'react-router-dom'
```

## Link的使用

1.导入link和route

```js
import { Link,Route } from "react-router-dom";
```

2.设置路由导航

```jsx
{/* <!-- 使用 Link 组件来导航. --> */}
{/* <!-- 通过传入 `to` 属性指定链接. --> */}
{/* <!-- <Link> 默认会被渲染成一个 `<a>` 标签 --> */}
<Link to="/about">About</Link>
<Link to="/home">Home</Link>
```

3.注册路由

```jsx
{/* <!-- 路由出口 --> */}
{/* <!-- 路由匹配到的组件将渲染在这里 --> */}
<Route path="/about" component={About} />
<Route path="/home" component={Home} />
```

## NavLink使用

1.导入NavLink和route

```js
import { NavLink,Route } from "react-router-dom";
```

2.设置路由导航

\- 被点击的link默认会添加active类样式

\- 我们可以通过activeClassName来设置类样式

```jsx
{/* <!-- 使用 NavLink 导航链接组件 --> */}
{/* 默认被点击的链接会自动加上active */}
<NavLink activeClassName="active" to="/about">About</NavLink>
<NavLink activeClassName="active" to="/home">Home</NavLink>
```

3.注册路由

```jsx
{/* <!-- 路由出口 --> */}
{/* <!-- 路由匹配到的组件将渲染在这里 --> */}
<Route path="/about" component={About} />
<Route path="/home" component={Home} />
```

## 封装NavLink

1.自己封装一个NavLink

\- 属性值可以通过props全部传递过来

\- 组件中的数据可以通过children接收

```jsx
import React, { Component } from 'react'
import { NavLink } from "react-router-dom";
export default class MyNavLink extends Component {
    render() {
        return (
            <NavLink {...this.props}/>
        )
    }
}
```

2.使用MyNavLink

```jsx
// 导入自定义的MyNavLink组件
import MyNavLink from "./components/MyNavLink";
// 使用组件About会被props中的children接收
<MyNavLink to="/about">About</MyNavLink>
<MyNavLink to="/home">Home</MyNavLink>
```

## switch匹配

\- 使用switch包裹只会匹配一次,不再向下匹配

\- 不使用switch及时匹配成功也会向下匹配

```jsx
{/* 不使用switch会一直向下匹配 */}
{/* 使用switch匹配成功后不会再匹配 */}
<Switch>
    <Route path="/about" component={About} />
    <Route path="/home" component={Home} />
    <Route path="/home" component={Test} />
</Switch>
```

## 模糊匹配与精准匹配

1.默认情况下是模糊匹配

\- 只要前面的一致就会匹配成功

```jsx
<MyNavLink to="/about/a/b/c">About</MyNavLink>
<Switch>
    <Route path="/about" component={About} />
</Switch>
```

2.精准匹配

\- 精准匹配使用exact属性关键字

\- 需要完全匹配实例一不能匹配成功

```jsx
// 实例一
<MyNavLink to="/home/a/b/c">Home</MyNavLink>
// 实例二
<MyNavLink to="/home">Home</MyNavLink>
<Switch>
    {/* 精确匹配需要完全一样 */}
    <Route exact path="/home" component={Home}/>
</Switch>
```

## 路由重定向

1.导入Redirect

```jsx
import { Route,Switch,Redirect } from "react-router-dom";
```

2.使用Redirect组件

\- 访问redirect组件的path路径会被重定向到to指定的路径

```jsx
<Switch>
    <Route path="/about" component={About} />
    <Route path="/home" component={Home} />
    {/* 路由重定向 */}
    {/* 访问更路径都会被重定向到about */}
    <Redirect path="/" to="/about"/>
</Switch>
```

## 嵌套路由

1.第一层路由App组件

```jsx
<MyNavLink to="/about">About</MyNavLink>
<MyNavLink to="/home">Home</MyNavLink>
<Switch>
    <Route path="/about" component={About} />
    <Route path="/home" component={Home} />
    <Redirect path="/" to="/about"/>
</Switch>
```

2.第二层路由Home组件

```jsx
<MyNavLink to="/home/news">News</MyNavLink>
<MyNavLink to="/home/message">Message</MyNavLink>
<Route path="/home/news" component={News}/>
<Route path="/home/message" component={Message}/>
<Redirect to="/home/news"/>
```

## 向路由传递三种参数

### 1.传递params参数

\- 参数通过/分割 例如 /home/参数1/参数2

\- 路由组件申明接收参数/:形式 例如 /home/:参数1/:参数2

```jsx
{/* 向路由组件传递params参数 */}
<Link to={`/home/${msg.id}/${msg.title}`}>{msg.title}</Link>
{/* 声明接收params参数 */}
<Route path="/home/:id/:title" component={Home}/>
```

接收参数

\- 参数存放在props的params对象中

```
this.props.params.id
this.props.params.title
```

### 2.传递search参数

\- 参数通过/home/?id=参数1&title=参数2方式传递

\- search参数无需申明接收

```jsx
{/* 向路由组件传递search参数 */}
<Link to={`/home/?id=${msg.id}&title=${msg.title}`}>{msg.title}</Link>
{/* search参数无需声明接收，正常注册路由即可 */}
<Route path="/home" component={Home}/>
```

接收参数

\- 接收到的参数是 ?id=1&title="消息"

\- 消息存放在location中

\- 可以通过qs函数将search参数转换为对象

```jsx
//转换search参数为对象,react自带无需导入
import qs from "querystring";
//serach参数存放在location中是一个字符串
const {search} = this.props.location;
//slice去掉第一?号转换后的格式为{id:1,title:'消息1'}
const props = qs.parse(search.slice(1));
```

### 3.传递state参数

\- 最外层的括号表示这是js表达式

\- state参数传递的是一个对象 {pathname:路径,state:{key1:value1,key2:value2}}

\- state参数无需申明接收

```jsx
{/* 向路由组件传递state参数 */}
<Link to={{pathname:'/home',state:{id:msg.id,title:msg.title}}}>{msg.title}</Link>
{/* state参数无需声明接收，正常注册路由即可 */}
<Route path="/home" component={Home}/>
```

接收参数

\- 参数存放在location中的state对象中

```jsx
const {id,title} = this.props.location.state;
```

## 开启replace

\- 开启replace后链接无法回退

```jsx
{/* 开启replace */}
<MyNavLink replace={true} to="/about">About</MyNavLink>
{/* 简写方式 */}
<MyNavLink replace to="/home">Home</MyNavLink>
```

## 编程式导航

1.历史记录的跳转

```jsx
// 回退到上一个路由地址
this.props.history.goBack();
// 前进到下一个路由地址
this.props.history.goForward()
// 向前或向后基本 +向前 -向后
this.props.history.go(-2)
```

2.replace跳转

\- replace跳转不带历史记录

```jsx
//replace跳转+携带params参数
this.props.history.replace(`/home/message/detail/${id}/${title}`)
//replace跳转+携带search参数
this.props.history.replace(`/home/?id=${id}&title=${title}`)
//replace跳转+携带state参数
this.props.history.replace('/home',{id,title})
```

3.push跳转

```jsx
//push跳转+携带params参数
this.props.history.push(`/home/${id}/${title}`)
//push跳转+携带search参数
this.props.history.push(`/home?id=${id}&title=${title}`)
//push跳转+携带state参数
this.props.history.push('/home',{id,title})
```

## withRouter

\- withRouter可以加工一般组件，让一般组件具备路由组件所特有的API

1.导入withRouter

```jsx
import { withRouter } from "react-router-dom";
```

2.使用withRouter

```jsx
class Header extends Component {
    back = ()=>{
        this.props.history.goBack()
    }
    render() {
        return (
            <div className="page-header">
                <h2>React Router Demo</h2>
                <button onClick={this.back}>回退</button>&nbsp;
            </div>
        )
    }
}
export default withRouter(Header);
```