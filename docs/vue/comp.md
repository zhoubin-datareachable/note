---
sidebarDepth: 2
---
## 组件

### 创建组件

创建一个Helloworld组件

```vue
<template>
  <div>
    <h2>{{msg}}</h2>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'Hello world'
      }
    }
  }
</script>

<style scoped>
 
</style>
```

### 引入组件

```vue
<template>
  <div>
    <HelloWorld/>
  </div>
</template>

<script>
  // 导入Helloworld组件
  import HelloWorld from './components/HelloWorld.vue'

  export default {
    components: {
      // 注册HelloWorld组件
      HelloWorld
    }
  }
</script>
```

## props

prop类型



### 传递静态或动态 Prop

给Home组件传递一个静态prop值

```html
<!-- 向Home组件传递静态属性 -->
<Home title="你好"></Home>
```

可以通过 `v-bind` 动态赋值

```vue
<Home :name="user.name"></Home>

<script>
//导入Home组件
import Home from './components/Home'

export default {
  components: {
    //注册Home组件
    Home
  },
  data(){
    return{
      user:{
        name:'张三'
      }
    }
  }
}
</script>
```

接收传递过来的值

```vue
<template>
  <div>{{title}}{{name}}</div>
</template>

<script>
export default {
  //接收父组件传递过来的数据
  props:['title','name']
};
</script>
```

### Prop 类型

#### 传入一个数字

```vue
<!-- 即便 `42` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:likes="42"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:likes="post.likes"></blog-post>
```

#### 传入一个布尔值

```html
<!-- 包含该 prop 没有值的情况在内，都意味着 `true`。-->
<blog-post is-published></blog-post>

<!-- 即便 `false` 是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:is-published="false"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```

#### 传入一个数组

```html
<!-- 即便数组是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post v-bind:comment-ids="[234, 266, 273]"></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:comment-ids="post.commentIds"></blog-post>
```

#### 传入一个对象

```html
<!-- 即便对象是静态的，我们仍然需要 `v-bind` 来告诉 Vue -->
<!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
<blog-post
  v-bind:author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
></blog-post>

<!-- 用一个变量进行动态赋值。-->
<blog-post v-bind:author="post.author"></blog-post>
```

#### 传入一个对象的所有 property

如果你想要将一个对象的所有 property 都作为 prop 传入，你可以使用不带参数的 `v-bind` (取代 `v-bind:prop-name`)。例如，对于一个给定的对象 `post`：

```js
post: {
  id: 1,
  title: 'My Journey with Vue'
}
```

下面的模板：

```html
<blog-post v-bind="post"></blog-post>
```

等价于：

```html
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

### Prop 验证

```vue
<script>
export default {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
};
</script>
```

### 类型检查

`type` 可以是下列原生构造函数中的一个：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

## 插槽

### 插槽内容

home组件中定义一个插槽

```html
<template>
  <slot></slot>
</template>
```

使用Home组件

```html
<Home>回家了</Home>
```

当组件渲染的时候，`<slot></slot>` 将会被替换为“回家了”。插槽内可以包含任何模板代码，包括 

```html
<Home>
  <!-- 添加一个 Font Awesome 图标 -->
  <span class="fa fa-user"></span>
  Your Profile
</Home>
```

甚至其它的组件：

```html
<Home>
  <!-- 添加一个图标的组件 -->
  <About name="user"></About>
  Your Profile
</Home>
```

### 后备内容

有时为一个插槽设置具体的后备 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。

```html
<template>
  <slot>默认内容</slot>
</template>
```

### 具名插槽

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

```html
<header>
    <slot name='header'></slot>
</header>
<main>
    <slot></slot>
</main>
<footer>
    <slot name='footer'></slot>
</footer>
```

使用具名插槽,未指明的将默认使用`<slot>` 插槽

```html
<p slot="header">标题信息</p>
<p>主要内容1</p>
<p>主要内容2</p>
<p slot="footer">底部信息</p>
```

