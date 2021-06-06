---
sidebar: true
sidebarDepth: 2
title: springMVC
---
## 入门

**配置web.xml**

在WEB-INF目录下创建 web.xml

配置Spring MVC的入口 **DispatcherServlet**，把所有的请求都提交到该Servlet

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- 配置所有请求由spring管理 -->
    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
         <!-- 启动顺序，数字越小，启动越早 -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    
    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

</web-app>
```

**springMVC配置文件**

在WEB-INF目录下创建和配置DispatcherServlet-servlet.xml

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
      http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
      http://www.springframework.org/schema/mvc
      http://www.springframework.org/schema/mvc/spring-mvc-3.2.xsd
      http://www.springframework.org/schema/context
      http://www.springframework.org/schema/context/spring-context-3.2.xsd
      http://www.springframework.org/schema/aop
      http://www.springframework.org/schema/aop/spring-aop-3.2.xsd
      http://www.springframework.org/schema/tx
      http://www.springframework.org/schema/tx/spring-tx-3.2.xsd">

    <!-- 1.配置url处理映射-->
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"></bean>

    <!-- 2.配置控制器处理适配器-->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"></bean>

    <!-- 3.配置控制器-相当于配置了访问路径
		class 要访问的java路径
	-->
    <bean name="/user" class="com.zh.web.controller.UserController"></bean>

    <!-- 4.配置资源视图解析器-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--前缀-->
        <property name="prefix" value="/WEB-INF/views/"></property>
        <!--后缀-->
        <property name="suffix" value=".jsp"></property>
    </bean>
</beans>
```

**创建Controller控制器**

```java
//实现controller接口mvc.Controller下的
public class UserController implements Controller{

    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //返回jsp视图前缀/WEB-INF/views/user/userlist后缀.jsp将拼接起来
        ModelAndView mv = new ModelAndView("user/userlist");

        //存入数据让jsp取
        mv.addObject("name","张三");
        return mv;
    }
}
```

**创建jsp页面**

![](https://ae01.alicdn.com/kf/H4222667056d844138ae498c981b0dc5ek.png)

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>用户列表</title>
</head>
<body>
用户列表<br>
${name}
</body>
</html>
```

**运行项目**

![](https://ae01.alicdn.com/kf/H6b63b82e63d54ec9a99cba007eb9768ci.png)

## 视图定位

`new ModelAndView("index");`

```xml
<!-- 配置资源视图解析器-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <!--前缀-->
    <property name="prefix" value="/WEB-INF/views/"></property>
    <!--后缀-->
    <property name="suffix" value=".jsp"></property>
</bean>
```

**controller**

```java
//实现controller接口mvc.Controller下的
public class UserController implements Controller{

    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //返回jsp视图前缀/WEB-INF/views/user/userlist后缀.jsp将拼接起来
        ModelAndView mv = new ModelAndView("user/userlist");

        //存入数据让jsp取
        mv.addObject("name","张三");
        return mv;
    }
}
```

## 注解方式

**配置文件**

```xml
<!-- 注解配置控制器-->
<!-- 1.配置扫描包:配置要扫描的包-->
<context:component-scan base-package="com.zh.web.controller"/>

<!-- 2可省略处理映射和适配器的配置-->
<mvc:annotation-driven/>

<!-- 3.配置资源视图解析器-->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <!--前缀-->
    <property name="prefix" value="/WEB-INF/views/"></property>
    <!--后缀-->
    <property name="suffix" value=".jsp"></property>
</bean>
```

**controller修改**

```java
@Controller
public class UserController{
    @RequestMapping("useradd")
    public String userAdd(){
        return "/user/useradd";
    }
}
```

```
可访问useradd.jsp
http://localhost/springmvc/useradd
```

## RequestMapping详解

```java
@RequestMapping(“list”)
@RequestMapping(“/list”)
@RequestMapping(value=”/list”)
@RequestMapping(value = "/list3",method=RequestMethod.POST) //只能使用POST方法
@RequestMapping(value = "/list3",method=RequestMethod.Get) //只能使用GET方法
```

## RestFul 风格

**概念**

Restful就是一个资源定位及资源操作的风格。不是标准也不是协议，只是一种风格。基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存等机制。

**功能**

资源：互联网所有的事物都可以被抽象为资源

资源操作：使用POST、DELETE、PUT、GET，使用不同方法对资源进行操作。

使用 @PathVariable 注解，让方法参数的值对应绑定到一个URI模板变量上

```java
@Controller
public class UserController{
    @RequestMapping("/add/{id}/{name}"。)
    public String userAdd(@PathVariable("id") Integer id,@PathVariable("name") String name){
        System.out.println("id:"+id+",name"+name)
        return "success";
    }
}
```

配置过滤器

- get请求不需要过滤器
- post,put,delete需要配置过滤器

```xml
<!-- 将POST请求转化为DELETE或者是PUT 要用_method指定真正的请求参数-->
<filter>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
    </filter>
    <filter-mapping>
    <filter-name>HiddenHttpMethodFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

接受请求

```java
@Controller
public class UserController{
    // PUT GET POST DELETE
    @RequestMapping(value = "/add/{id}/{name}",method=RequestMethod.PUT)
    public String userAdd(@PathVariable("id") Integer id,@PathVariable("name") String name){
        System.out.println("id:"+id+",name"+name)
        return "success";
    }
}
```

## 中文乱码问题

```xml
<filter> 
    <filter-name>CharacterEncodingFilter</filter-name> 
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class> 
    <init-param> 
        <param-name>encoding</param-name> 
        <param-value>utf-8</param-value> 
    </init-param> 
</filter> 
<filter-mapping> 
    <filter-name>CharacterEncodingFilter</filter-name> 
    <url-pattern>/*</url-pattern> 
</filter-mapping>  
```

## 表单数据接收

### 基本类型

**表单页**

```jsp
<!-- 注册页面 -->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>注册</title>
</head>
<body>
<form action="${pageContext.request.contextPath}/user/register.do" method="post">
    用户名:<input type="text" name="username"><br>
    密码:<input type="text" name="password"><br>
    性别:<input type="text" name="gender"><br>
    年龄:<input type="text" name="age"><br>
    生日:<input type="text" name="birthday"><br>
    爱好:<input type="checkbox" name="hobbyIds" value="1">唱
    <input type="checkbox" name="hobbyIds" value="2">跳
    <input type="checkbox" name="hobbyIds" value="3">rap<br>
    <input type="submit">
</form>
</body>
</html>
```

**Controller**

```java
@Controller
@RequestMapping("/user")
public class UserController{
    /**
     * 第一种接收表单参数的方式:
     * 默认日期格式 月/日/年 10/10/2016
     * @return
     */
    @RequestMapping("/register")
    public String register(String username,String password, int age,String gender,Date birthday, String[] hobbyIds){
        System.out.println(username);
        System.out.println(password);
        System.out.println(age);
        System.out.println(gender);
        System.out.println(birthday);
        System.out.println(Arrays.toString(hobbyIds));
        return "user/info";
    }
}
```

```
张三
123
22
男
Sat Oct 10 00:00:00 CST 2020
[1, 2, 3]
```

### **pojo类型**

```java
//模型
public class User {
    private Integer id;
    private String username;
    private String password;
    private  int age;
    private String gender;
    private Date birthday;
    private  String[] hobbyIds;
}
```

**controller**

```java
/**
 * 第二种接收表单参数的方式:模型方式
 * 默认日期格式 月/日/年 10/10/2016
 * @return
 */
@RequestMapping("/register")
public String register(User user){
    System.out.println(user);
    return "user/info";
}
```

```
User{id=null, username='zhangsan', password='123', age=12, gender='男', birthday=Mon Oct 12 00:00:00 CST 2020, hobbyIds=[1, 2, 3]}
```

### **包装类型**

```java
//user的扩展类
public class UserExt {
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "UserExt{" +
                "user=" + user +
                '}';
    }
}
```

```jsp
<!-- 表单加上user.-->
<form action="${pageContext.request.contextPath}/user/register.do" method="post">
    用户名:<input type="text" name="user.username"><br>
    密码:<input type="text" name="user.password"><br>
    性别:<input type="text" name="user.gender"><br>
    年龄:<input type="text" name="user.age"><br>
    生日:<input type="text" name="user.birthday"><br>
    爱好:<input type="checkbox" name="user.hobbyIds" value="1">唱
    <input type="checkbox" name="user.hobbyIds" value="2">跳
    <input type="checkbox" name="user.hobbyIds" value="3">rap<br>
    <input type="submit">
</form>
```

```java
@RequestMapping("/register")
public String register(UserExt userExt){
    System.out.println(userExt);
    return "user/info";
}
```

```
UserExt{user=User{id=null, username='zhangsan', password='123', age=12, gender='男', birthday=Mon Oct 12 00:00:00 CST 2020, hobbyIds=[1, 2, 3]}}
```

### List类型

```java
public class User {
    private String username;
    private String password;
}
```

```java
//扩展类声明list集合
public class UserExt {
    //集合类型
    private List<User> users;
}
```

```java
@RequestMapping("/register")
public String register(UserExt userExt){
    System.out.println(userExt.getUsers());
    return "user/info";
}
```

```jsp
<form action="${pageContext.request.contextPath}/user/register.do" method="post">
    <!-- private List<User> users -->
    用户名1:<input type="text" name="users[0].username"><br>
    密码1:<input type="text" name="users[0].password"><br>
    =======================================================<br>
    用户名2:<input type="text" name="users[1].username"><br>
    密码2:<input type="text" name="users[1].password"><br>
    <input type="submit">
</form>
```

```
[User{username='张三', password='123'}, User{username='李四', password='456'}]
```

### Map类型

```java
public class UserExt {
	//集合类型
    private Map<String,Object> infos = new HashMap<>();
}
```

```java
@RequestMapping("/register")
public String register(UserExt userExt){
    System.out.println(userExt.getInfos());
    return "user/info";
}
```

```jsp
<form action="${pageContext.request.contextPath}/user/register.do" method="post">
    <!-- private Map<String,Object> infos = new HashMap<>() -->
    用户名:<input type="text" name="infos['username']"><br>
    密码:<input type="text" name="infos['password']"><br>
    性别:<input type="text" name="infos['gender']"><br>
    年龄:<input type="text" name="infos['age']"><br>
    <input type="submit">
</form>
```

```
{username=张三, age=22, gender=男, password=123}
```

## 数据传递

### 向jsp页面传参

**设置数据**

```java
@RequestMapping("/list")
public String list(Model model){
    //模拟数据库数据
    List<User> list = new ArrayList<>();
    list.add(new User(1,"张三",15,"男"));
    list.add(new User(2,"李四",16,"男"));
    list.add(new User(3,"王五",17,"男"));

    model.addAttribute("userlist",list);
    return "user/userlist";
}
```

**接收数据**

```jsp
<!-- 需要用的el表达式-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<html>
<head>
    <title>用户列表</title>
</head>
<body>
用户列表界面
<table border="1px">
    <tr>
        <td>姓名</td>
        <td>年龄</td>
        <td>性别</td>
        <td>修改</td>
    </tr>
    <c:forEach items="${userlist}" var="user">
        <tr>
            <td>${user.username}</td>
            <td>${user.age}</td>
            <td>${user.gender}</td>
            <td><a href="${pageContext.request.contextPath}/user/edit.do?id=${user.id}">修改</a></td>
        </tr>
    </c:forEach>
</table>
</body>
</html>
```

### parms传参

```jsp
<a href="${pageContext.request.contextPath}/user/edit?id=${user.id}">
```

接收参数

```java
@RequestMapping("/edit")
public String edit(Integer id,Model model){
    //模拟从数据库取数据
    User user = new User(id,"张三",15,"男");
    //保存数据宫页面显示
    model.addAttribute("user",user);
    return "user/edit";
}
```

### URL传参

```jsp
<a href="${pageContext.request.contextPath}/user/edit/${user.id}.do">
```

接收参数

```java
//多个参数@RequestMapping("/edit/{id}/{a}")
//@PathVariable Integer id,@PathVariable Integer a
@RequestMapping("/edit/{id}")
public String edit(@PathVariable Integer id, Model model){
    //模拟从数据库取数据
    User user = new User(id,"张三",15,"男");
    //保存数据宫页面显示
    model.addAttribute("user",user);
    return "user/edit";
}
```

## 转发和重定向

### 请求转发

**1.转发到同一个控制器的方法**

```java
@Controller
@RequestMapping("/user")
public class UserController{
	//转发到同一个控制器
    @RequestMapping("test")
    public String test(){
        return "forward:list.do";
    }

    @RequestMapping("/list")
    public String list(Model model){
        //省略...
    }
}
```

```
http://localhost/springmvc/user/test.do
```

**2.转发到不同一个控制器的方法**

```java
//student控制器
@Controller
@RequestMapping("/student")
public class StudentController {

    @RequestMapping("test")
    public String test(){
        return "forward:/user/list.do";
    }
}
```

```
http://localhost/springmvc/student/test.do
```

### 重定向

**1.重定向到同一个控制器的方法**

```java
@Controller
@RequestMapping("/user")
public class UserController{
	//转发到同一个控制器
    @RequestMapping("test")
    public String test(){
        return "redirect:list.do";
    }

    @RequestMapping("/list")
    public String list(Model model){
        //省略...
    }
}
```

```
http://localhost/springmvc/user/test.do
http://localhost/springmvc/user/list.do
```

**2.重定向到不同一个控制器的方法**

```java
//student控制器
@Controller
@RequestMapping("/student")
public class StudentController {

    @RequestMapping("test")
    public String test(){
        return "redirect:/user/list.do";
    }
}
```

```
http://localhost/springmvc/student/test.do
http://localhost/springmvc/user/list.do
```

## 返回json数据

1.导入jackson-core和jackson-mapper

2.在springMVC的配置文件中开启MVC驱动

3.在处理ajax请求的方法上加上注解@ResponseBody

4.将要转换为json且响应到客户端的数据，直接作为该方法返回值返回

实例

```java
//@RequestBody 请求数据转成对象
//@ResponseBody 响应数据转成json
@RequestMapping("register")
@ResponseBody
public String Student save(){
    return "你好";
}
```

