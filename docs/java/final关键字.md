---
sidebar: true
sidebarDepth: 2
title: final关键字
---
## 1.1 概述

学习了继承后，我们知道，子类可以在父类的基础上改写父类内容，比如，方法重写。那么我们能不能随意的继承 API中提供的类，改写其内容呢？显然这是不合适的。为了避免这种随意改写的情况，Java提供了 `final `关键字， 用于修饰**不可改变内容**。

final： 不可改变。可以用于修饰类、方法和变量。 

- 类：被修饰的类，不能被继承。 
- 方法：被修饰的方法，不能被重写。 
- 变量：被修饰的变量，不能被重新赋值。

## 1.2 使用方式

### 修饰类

格式如下：

```java
final class 类名 {
}
```

查询API发现像 `public final class String `、` public final class Math` 、 `public final class Scanner` 等，很多我们学习过的类，都是被final修饰的，目的就是供我们使用，而不让我们所以改变其内容。

### 修饰方法 

格式如下：

```java
修饰符 final 返回值类型 方法名(参数列表){
	//方法体
}
```

重写被 `final `修饰的方法，编译时就会报错。

### 修饰变量

**1.局部变量——基本类型** 

基本类型的局部变量，被final修饰后，只能赋值一次，**不能再更改**。代码如下：

```java
public class FinalDemo1 {
    public static void main(String[] args) {
        // 声明变量，使用final修饰
        final int a;
        // 第一次赋值
        a = 10;
        // 第二次赋值
        a = 20; // 报错,不可重新赋值
        // 声明变量，直接赋值，使用final修饰
        final int b = 10;
        // 第二次赋值
        b = 20; // 报错,不可重新赋值
    }
}
```

思考，如下两种写法，哪种可以通过编译？

写法1：

```java
final int c = 0;
    for (int i = 0; i < 10; i++) {
    c = i;
    System.out.println(c);
}
```

写法2：

```java
for (int i = 0; i < 10; i++) {
    final int c = i;
    System.out.println(c);
}
```

根据 `final `的定义，写法1报错！写法2，为什么通过编译呢？因为每次循环，都是一次新的变量c。这也是大家 需要注意的地方。

**2.局部变量——引用类型**

引用类型的局部变量，被final修饰后，只能指向一个对象，地址不能再更改。但是不影响对象内部的成员变量值的 修改，代码如下：

```java
public class FinalDemo2 {
    public static void main(String[] args) {
        // 创建 User 对象
        final User u = new User();
        // 创建 另一个 User对象
        u = new User(); // 报错，指向了新的对象，地址值改变。
        // 调用setName方法
        u.setName("张三"); // 可以修改
    }
}
```

**3.成员变量**

成员变量涉及到初始化的问题，初始化方式有两种，只能二选一：

- 显示初始化

```java
public class User {
    final String USERNAME = "张三";
    private int age;
}
```

- 构造方法初始化。

```java
public class User {
    final String USERNAME ;
    private int age;
    public User(String username, int age) {
    	this.USERNAME = username;
    	this.age = age;
    }
}

```

> 被final修饰的常量名称，一般都有书写规范，所有字母都**大写**。

