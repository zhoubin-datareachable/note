---
sidebar: true
sidebarDepth: 2
title: redux
---

## 安装

**NPM**

```sh
npm i redux --save
npm i redux-thunk --save  异步操作
```

## 精简版本redux

### Rducer

```js
const initState = 0; //初始化状态
export default function countReducer(preState=initState,action){
    const {type,data} = action;
    switch(type){
        case 'increment': //如果是加
            return preState + data;
        case 'decrement': //如果是减
            return preState - data;
        default:
            return preState; //第一次返回默认值
    }
}
```

### Store

```JS
//引入createStore,专门用于创建redux中最为核心的store对象
import { createStore } from "redux";
//引入为Count组件服务的reducer
import countReducer from "./count_reducer";

//暴露store
export default createStore(countReducer);
```

### 组件中使用

```jsx
// 导入store
import store from "../../redux/store";

// 获取状态值
store.getState()
// 修改状态值
store.dispatch({type:'decrement',data:value*1})
```

## redux完整版

### Action对象

```jsx
//引入常量
import { INCREMENT,DECREMENT } from "./constant";

export const createIncrementAction = function(data){
    return {type:INCREMENT,data}
}

export const createDecrementAction = function(data){
    return {type:DECREMENT,data}
}
```

### Reducer

```jsx
const initState = 0; //初始化状态
export default function countReducer(preState=initState,action){
    const {type,data} = action;
    switch(type){
        case 'increment': //如果是加
            return preState + data;
        default:
            return preState; //第一次返回默认值
    }
}
```

### Store

```js
//引入createStore,专门用于创建redux中最为核心的store对象
import { createStore } from "redux";
//引入为Count组件服务的reducer
import countReducer from "./count_reducer";

//暴露store
export default createStore(countReducer);
```

### 组件中使用

```jsx
//引入store,用于获取redux中保存状态
import store from "../../redux/store";
//引入actionCreator,专门用于创建action对象
import { createIncrementAction } from "../../redux/count_action";

// 获取状态
store.getState()
// 修改状态
store.dispatch(createIncrementAction(value*1));
```

## 异步action版

### Action对象

```js
//引入常量
import { INCREMENT,DECREMENT } from "./constant";

//同步action
export const createIncrementAction = function(data){
    return {type:INCREMENT,data}
}

// 异步action
export const createIncrementAsyncAction = (data,time)=>{
    return (dispatch) =>{
        setTimeout(() => {
            // 调用同步action
            dispatch(createIncrementAction(data))
        }, time);
    }
}
```

### Reducer

```jsx
const initState = 0; //初始化状态
export default function countReducer(preState=initState,action){
    const {type,data} = action;
    switch(type){
        case 'increment': //如果是加
            return preState + data;
        default:
            return preState; //第一次返回默认值
    }
}
```

### Store

```js
import { createStore,applyMiddleware } from "redux";
//引入为Count组件服务的reducer
import countReducer from "./count_reducer";
//引入redux-thunk,用于支持异步action
import thunk from "redux-thunk";

//暴露store
export default createStore(countReducer,applyMiddleware(thunk));
```

### 组件中使用

```jsx
//引入store,用于获取redux中保存状态
import store from "../../redux/store";
//引入actionCreator,专门用于创建action对象
import { createIncrementAsyncAction } from "../../redux/count_action";

// 获取状态
store.getState()
// 异步修改状态500定时器时间
store.dispatch(createIncrementAsyncAction(value*1,500));
```

## react_redux

**安装**

```sh
npm i react-redux --save
```

### 容器组件和UI组件连接

```js
//引入Count的UI组件
import CountUI from '../../components/Count'

//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'

//使用connect()()创建并暴露一个Count的容器组件
export default connect()(CountUI)
```

**向容器组件传递store**

```jsx
import React, { Component } from 'react'
import Count from "./containers/Count";
import store from './redux/store'
import './App.css'

export default class App extends Component {
    render() {
        return (
            <div className="app">
                {/* 给容器组件传递store */}
                <Count store={store}/>
            </div>
        )
    }
}
```

### 容器组件

```js
//引入Count的UI组件
import CountUI from '../../components/Count'
//引入action
import {
	createIncrementAction,
	createDecrementAction,
	createIncrementAsyncAction
} from '../../redux/count_action'

//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'

//  1.mapStateToProps函数返回的是一个对象；
// 	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
// 	3.mapStateToProps用于传递状态
function mapStateToProps(state){
    // 这个state向当于store.getState()
    return {count:state}
}

/* 
	1.mapDispatchToProps函数返回的是一个对象；
	2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
	3.mapDispatchToProps用于传递操作状态的方法
*/
function mapDispatchToProps(dispatch) {
    // 这dispatch相当于store.dispatch
   return {
        //加法
        add:(number)=>{
           dispatch(createIncrementAction(number))
        },
        //减法
        subtract:(number)=>{
            dispatch(createDecrementAction(number))
        },
        //异步加
        addAsnc:(number,time)=>{
            dispatch(createIncrementAsyncAction(number,time));
        }

    }
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(mapStateToProps,mapDispatchToProps)(CountUI)
```

### UI组件中使用

```
this.props.返回的状态名
this.props.返回的方法名
```

```jsx
import React, { Component } from 'react'

import "./index.css";

export default class Count extends Component {

    //加法
    increment = ()=>{
        const {value} = this.selectNumber;
        this.props.add(value*1);
    }

    //减法
    decrement = ()=>{
        const {value} = this.selectNumber;
        this.props.subtract(value*1);
    }

    //奇数再加
    incrementIfOdd = ()=>{
        const {value} = this.selectNumber;
        const {count} = this.props;
        if(count%2!==0){
            this.props.add(value*1);
        }
    }

    //异步加
    incrementAsync = ()=>{
        const {value} = this.selectNumber;
        this.props.addAsnc(value*1,500);
    }

    render() {
        return (
            <div>
                <h1>当前求和为:{this.props.count}</h1>
                <hr/>
                <select ref={c=>this.selectNumber=c} className="form-control">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                
                <button onClick={this.increment}>加</button>
                <button onClick={this.decrement}>减</button>
                <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>
                <button onClick={this.incrementAsync}>异步加</button>
            </div>
        )
    }
}
```

## react-redux优化

### 整合容器组件和UI组件

```
//引入action
import {createIncrementAction,createDecrementAction,createIncrementAsyncAction} from '../../redux/count_action'

import React, { Component } from 'react'
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'
import "./index.css";

class Count extends Component {

    //加法
    increment = ()=>{
        const {value} = this.selectNumber;
        this.props.add(value*1);
    }

    //减法
    decrement = ()=>{
        const {value} = this.selectNumber;
        this.props.subtract(value*1);
    }

    //奇数再加
    incrementIfOdd = ()=>{
        const {value} = this.selectNumber;
        const {count} = this.props;
        if(count%2!==0){
            this.props.add(value*1);
        }
    }

    //异步加
    incrementAsync = ()=>{
        const {value} = this.selectNumber;
        this.props.addAsnc(value*1,500);
    }

    render() {
        return (
            <div>
                <h1>当前求和为:{this.props.count}</h1>
                <hr/>
                <select ref={c=>this.selectNumber=c} className="form-control">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                
                <button onClick={this.increment}>加</button>
                <button onClick={this.decrement}>减</button>
                <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>
                <button onClick={this.incrementAsync}>异步加</button>
            </div>
        )
    }
}



function mapStateToProps(state){
    return {count:state}
}

function mapDispatchToProps(dispatch) {
   return {
        //加法
        add:(number)=>{
           dispatch(createIncrementAction(number))
        },
        //减法
        subtract:(number)=>{
            dispatch(createDecrementAction(number))
        },
        //异步加
        addAsnc:(number,time)=>{
            dispatch(createIncrementAsyncAction(number,time));
        }

    }
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(mapStateToProps,mapDispatchToProps)(Count)
```

### 优化store

```jsx
//无需自己给容器组件传递store，给<App/>包裹一个<Provider store={store}>即可。

//渲染App到页面
ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
document.getElementById('root'))
```

### 优化容器组件

```jsx
//使用connect()()创建并暴露一个Count的容器组件
export default connect(state=>{
    return {count:state}
},{
    add:createIncrementAction,
    subtract:createDecrementAction,
    addAsnc:createIncrementAsyncAction
})(Count)
```

### 完整版

```jsx
//引入action
import {
	createIncrementAction,
	createDecrementAction,
	createIncrementAsyncAction
} from '../../redux/count_action'

import React, { Component } from 'react'
//引入connect用于连接UI组件与redux
import {connect} from 'react-redux'
import "./index.css";

class Count extends Component {

    //加法
    increment = ()=>{
        const {value} = this.selectNumber;
        this.props.add(value*1);
    }

    //减法
    decrement = ()=>{
        const {value} = this.selectNumber;
        this.props.subtract(value*1);
    }

    //奇数再加
    incrementIfOdd = ()=>{
        const {value} = this.selectNumber;
        const {count} = this.props;
        if(count%2!==0){
            this.props.add(value*1);
        }
    }

    //异步加
    incrementAsync = ()=>{
        const {value} = this.selectNumber;
        this.props.addAsnc(value*1,500);
    }

    render() {
        return (
            <div>
                <h1>当前求和为:{this.props.count}</h1>
                <hr/>
                <select ref={c=>this.selectNumber=c}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                
                <button onClick={this.increment}>加</button>
                <button onClick={this.decrement}>减</button>
                <button onClick={this.incrementIfOdd}>当前求和为奇数再加</button>
                <button onClick={this.incrementAsync}>异步加</button>
            </div>
        )
    }
}


//使用connect()()创建并暴露一个Count的容器组件
export default connect(state=>{
    return {count:state}
},{
    add:createIncrementAction,
    subtract:createDecrementAction,
    addAsnc:createIncrementAsyncAction
})(Count)
```

## 数据共享版

### Store

```jsx
//该文件专门用于暴露一个store对象，整个应用只有一个store对象
//引入createStore,专门用于创建redux中最为核心的store对象
import { createStore,applyMiddleware,combineReducers } from "redux";
//引入redux-thunk,用于支持异步action
import thunk from "redux-thunk";

//引入为Count组件服务的reducer
import countReducer from "../redux/reduces/count";
import personReducer from "../redux/reduces/person";

//汇总所有的reducer变为一个总的reducer
const allReducer = combineReducers({
	count:countReducer,
	persons:personReducer
})

//暴露store
export default createStore(allReducer,applyMiddleware(thunk));
```

### 容器组件中使用

```jsx
// 使用connect()()创建并暴露一个Count的容器组件
export default connect(state=>{
    // 从store中取出取出count和persons
    return {count:state.count,perCount:state.persons.length}
},{
    add:createIncrementAction,
    subtract:createDecrementAction,
    addAsnc:createIncrementAsyncAction
})(Count)

// UI组件中使用
this.props.count
this.props.perCount
```

## ract-redux调试工具

**安装**

```sh
yarn add redux-devtools-extension
```

**store中进行配置**

```jsx
// 导入redux-devtools-extension
import {composeWithDevTools} from 'redux-devtools-extension'

// 配置调试工具
export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)))
```

