---
sidebar: true
sidebarDepth: 2
title: JSP
---
## Hello JSP

```javascript
<%@page contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
 
你好 JSP
 
<br>
 
<%=new Date().toLocaleString()%>
```

## 页面元素

### 输出一段HTML
```javascript
<%=%>和 <%out.println()%>
```

out是jsp的隐式对象，可以直接使用。

**注:** <%=%> 不需要分号结尾，<%%> 需要以分号结尾，和java代码一样
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
 
<%="hello jsp"%>
<br>
<% out.println("hello jsp");%>
```

### for循环
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
<%
    List<String> words = new ArrayList<String>();
    words.add("today");
    words.add("is");
    words.add("a");
    words.add("great");
    words.add("day");
%>
  
<table width="200px" align="center" border="1" cellspacing="0">
    <%for (String word : words) {%>
        <tr>
            <td><%=word%></td>
        </tr>
    <%}%>
</table>
```

## include

### 简单案例

1.准备一个footer.jsp

```html
<hr>
<p style="text-align:center">copyright@2016
</p>
```

2.准备一个index.jsp
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
     
你好  JSP
 
<%@include file="footer.jsp" %>
```

### 传参

1.准备一个footer.jsp
```javascript
<hr>
	<!-- 接收参数 -->
    <p style="text-align:center">copyright@<%=request.getParameter("year")%>
</p>
```

2.准备一个index.jsp
```javascript
<%@page contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
  
你好 JSP
<%=new Date().toLocaleString()%>
 
<jsp:include page="footer.jsp">
    <!-- 传递参数 -->
    <jsp:param  name="year" value="2017" />
</jsp:include>
```

## jsp跳转

重定向(客户端跳转)
```javascript
<%
    response.sendRedirect("hello.jsp");
%>
```

请求转发(服务端跳转)
```javascript
<jsp:forward page="hello.jsp"/>
```

## cookie

### 设置cookie
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="javax.servlet.http.Cookie"%>
 
<%
    Cookie c = new Cookie("name", "Gareen");
    c.setMaxAge(60 * 24 * 60);
    c.setPath("/");
    response.addCookie(c);
%>
 
<a href="getCookie.jsp">跳转到获取cookie的页面</a>
```

### 获取cookie
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="javax.servlet.http.Cookie"%>
 
<%
    Cookie[] cookies = request.getCookies();
    if (null != cookies)
        for (int d = 0; d <= cookies.length - 1; d++) {
            out.print(cookies[d].getName() + ":" + cookies[d].getValue() + "<br>");
        }
%>
```

## session

### 设置session
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="javax.servlet.http.Cookie"%>
 
<%
   session.setAttribute("name", "teemo");
%>
 
<a href="getSession.jsp">跳转到获取session的页面</a>
```

### 获取session

```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="javax.servlet.http.Cookie"%>
 
<%
    String name = (String)session.getAttribute("name");
%>
 
session中的name: <%=name%>
```

## 作用域

JSP有4个作用域，分别是
**pageContext** 当前页面
**requestContext** 一次请求
**sessionContext** 当前会话
**applicationContext** 全局，所有用户共享

### pageContext

pageContext表示**当前页面作用域**

通过pageContext.setAttribute(key,value)的数据，只能在当前页面访问，在其他页面就不能访问了。

**设置数据和获取数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 
<%
    pageContext.setAttribute("name","gareen");
%>
 
<%=pageContext.getAttribute("name")%>
```

### requestContext

- 当前页面能获取到数据
- 请求转发的页面能取到数据
- 重定向的页面**不能**取到数据

**设置数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    request.setAttribute("name","gareen");
%>
<!-- 当前页 -->
<%=request.getAttribute("name")%>

<!-- 请求转发页(服务端跳转) -->
<jsp:forward page="getContext.jsp"/>
```

**获取数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 
<%=request.getAttribute("name")%>
```

### sessionContext

sessionContext 指的是会话，从**一个用户**打开网站的那一刻起，无论访问了多少网页，链接都属于同一个会话，直到浏览器关闭。

所以页面间传递数据，也是可以通过session传递的。

但是，不同用户对应的session是不一样的，所以session无法在不同的用户之间共享数据。

**设置数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    session.setAttribute("name","gareen");
    response.sendRedirect("getContext.jsp");
%>
```

**获取数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 
<%=session.getAttribute("name")%>
```

### applicationContext

applicationContext 指的是全局，所有用户共享同一个数据

在JSP中使用application对象， application对象是**ServletContext接口的实例**
也可以通过 request.getServletContext()来获取。
所以 application == request.getServletContext() 会返回true
application映射的就是web应用本身。

**设置数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    application.setAttribute("name","gareen");
    System.out.println(application == request.getServletContext());
    response.sendRedirect("getContext.jsp");
%>
```

**获取数据**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
 
<%=application.getAttribute("name")%>
```

## 隐式对象

JSP的隐式对象指的是不需要显示定义，直接就可以使用的对象，比如request,response

JSP一共有9个隐式对象，分别是

```
request #请求
response #响应
out #输出

pageContext #前页面作用域
session #会话作用域
application #全局作用域

page,config,exception
```

### page

page 对象即表示当前对象
JSP 会被编译为一个Servlet类 ，运行的时候是一个Servlet实例。 page即代表**this**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
      
page:<%=page%>
<br>
this:<%=this%>
```

### config

config可以获取一些在web.xml中初始化的参数。
在JSP中使用config比较复杂，需要如下几个步骤
1.在web.xml中进行配置
2.创建一个testconfig.jsp
通过config.getInitParameter("database-ip") 获取参数
3.访问路径，获取web.xml中配置的参数

**配置web.xml**

```xml
<servlet>
    <!-- 把 testconfig.jsp配置为一个 servlet -->
    <servlet-name>testconfig</servlet-name>
    <jsp-file>/testconfig.jsp</jsp-file>
    <!-- 配置初始化参数 -->
    <init-param>
        <param-name>database-ip</param-name>
        <param-value>127.0.0.1</param-value>
    </init-param>
</servlet>
<!-- 将路径 testconfig映射到testconfig.jsp -->
<servlet-mapping>
    <servlet-name>testconfig</servlet-name>
    <url-pattern>/testconfig</url-pattern>
</servlet-mapping>
```

**获取配置**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
      
database-ip: <%=config.getInitParameter("database-ip")%>
```

### exception

exception 对象只有当前页面的`<%@page 指令设置为isErrorPage="true"`的时候才可以使用。

同时，在其他页面也需要设置 `<%@page 指令 errorPage=""` 来指定一个专门处理异常的页面。

1.准备一个try.jsp
设置errorPage="catch.jsp"，表示有异常产生的话，就交给catch.jsp处理
故意在里面造成数组越界异常

2.准备一个catch.jsp
设置 isErrorPage="true"，表示当前页面可以使用exception对象

**try.jsp**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" errorPage="catch.jsp"%>
 
<%
    int[] a = new int[10];
    a[20] = 5;
%>
```

**catch.jsp**
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isErrorPage="true"%>
     
<%=exception%>
```

## JSTL标签库

**导入jar包**

为了能够在JSP 中使用JSTL，首先需要两个jar包，分别是jstl.jar 和standard.jar
```javascript
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
```

### 常用指令

**set**
```javascript
<!-- scope作用域 -->
<c:set var="name" value="${'gareen'}" scope="request" />

<!-- 相当于 -->
<%request.setAttribute("name","gareen")%>
```

**out**
```javascript
<c:out value="${name}" />

<!-- 相当于 -->
<%=request.getAttribute("name")%>
```

**remove**
```javascript
<c:remove var="name" scope="request" />

<!-- 相当于 -->
<%request.removeAttribute("name")%>
```

### if else

JSTL通过**<c:if test="">** 进行条件判断

但是JSTL**没有<c:else**，所以常用的办法是在<c:if的条件里取反

配合if使用的还有通过**empty**进行为空判断
empty可以判断对象是否为null,字符串长度是否为0，集合长度是否为0
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*"%>
 
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
 
<c:set var="hp" value="${10}" scope="request" />
 
<c:if test="${hp<5}">
    <p>这个英雄要挂了</p>
</c:if>
 
<c:if test="${!(hp<5)}">
    <p>这个英雄觉得自己还可以再抢救抢救</p>
</c:if>
 
<%
    pageContext.setAttribute("weapon", null);
    pageContext.setAttribute("lastwords", "");
    pageContext.setAttribute("items", new ArrayList());
%>
 
<c:if test="${empty weapon}">
    <p>没有装备武器</p>
</c:if>
<c:if test="${empty lastwords}">
    <p>挂了也没有遗言</p>
</c:if>
<c:if test="${empty items}">
    <p>物品栏为空</p>
</c:if>
```

### choose

虽然JSTL没有提供else标签，但是提供了一个else功能的标签
```javascript
<c:choose>
    <c:when test="${hp<5}">
        <p>这个英雄要挂了</p>
    </c:when>
    <c:otherwise>
        <p>这个英雄觉得自己还可以再抢救抢救</p>
    </c:otherwise>
</c:choose>
```

### forEach

**items="${heros}"** 表示遍历的集合
**var="hero"** 表示把每一个集合中的元素放在hero上
**varStatus="st"** 表示遍历的状态
```javascript
<!-- 使用JSTL中的c:forEach 循环来遍历List -->
<table width="200px" align="center" border="1" cellspacing="0">
<tr>
    <td>编号</td>
    <td>英雄</td>
</tr>
   
<c:forEach items="${heros}" var="hero" varStatus="st"  >
    <tr>
        <td><c:out value="${st.count}" /></td>
        <td><c:out value="${hero}" /></td>
    </tr>
</c:forEach>
</table>
```

## EL表达式

所以为了保证EL表达式能够正常使用，需要在<%@page 标签里加上**isELIgnored="false"**

### 取值
```javascript
${name}

<!-- 相当于 -->
<%=request.getAttribute("name")%>
```

### 作用域优先级

EL表达式可以从pageContext,request,session,application四个作用域中取到值

pageContext>request>session>application
```javascript
${name}
```

### 获取JavaBean的属性

获取JavaBean的属性，只需要通过.符号操作就可以了。

像这样 ${hero.name} ，就会自动调用getName方法了

**注：** 如果属性是boolean类型，那么就会自动调用isXXX方法了
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" isELIgnored="false" import="bean.*"%>
  
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
  
<%
    Hero hero =new Hero();
    hero.setName("盖伦");
    hero.setHp(616);
     
    request.setAttribute("hero", hero);
%>
  
英雄名字 ： ${hero.name} <br>
英雄血量 ： ${hero.hp}
```

### forEach简写
```javascript
<c:out value="${hero}" /> 

可以简写为
${hero}
```
```javascript
<table width="200px" align="center" border="1" cellspacing="0">
<tr>
    <td>编号</td>
    <td>英雄</td>
</tr>
    
<c:forEach items="${heros}" var="hero" varStatus="st"  >
    <tr>
        <td>${st.count}</td>
        <td>${hero}</td>
    </tr>
</c:forEach>
</table>
```

### 取参

EL表达式还可以做到request.getParameter("name") 这样的形式获取浏览器传递过来的参数
```javascript
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*" isELIgnored="false"%>
 
${param.name}
```

### eq

进行条件判断，大大简化了 JSTL的 c:if 和 c:choose 代码

eq相等 ne、neq不相等，
gt大于， lt小于
gt大于， lt小于
gte、ge大于等于
lte、le 小于等于
not非 mod求模
is [not] div by是否能被某数整除
is [not] even是否为偶数
is [not] odd是否为奇
```javascript
EL表达式eq的用法，运行结果：
${killNumber ge 10? "超神":"还没超神" }
```

