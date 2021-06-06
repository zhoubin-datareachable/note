---
sidebar: true
sidebarDepth: 2
title: spring
---
## 入门

**1.导入Spring的核心jar包**

| **spring-core-3.2.2.RELEASE.jar**  核心工具类                |
| ------------------------------------------------------------ |
| **spring-beans-3.2.2.RELEASE.jar**  访问配置文件、创建和管理bean |
| **spring-context-3.2.2.RELEASE.jar**  Spring提供在基础IoC功能上的扩展服务 |
| **spring-expression-3.2.2.RELEASE.jar**  Spring表达式语言    |
| **com.springsource.org.apache.commons.logging-1.1.1.jar**  第三方的主要用于处理日志 |

**2.编写service**

```java
package com.zh.service;

public interface IUserService {
    public void add();
}
```

```java
package com.zh.service;

public class UserService implements IUserService{
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void add() {
        System.out.println("name:"+name);
    }
}
```

**3.配置beans.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置一个bean对象,只能填写实现类，不能填接口-->
    <bean id="userService" class="com.zh.service.UserService">
        <!-- 注入依赖数据,调用set方法 -->
        <property name="name" value="张三"></property>
    </bean>

</beans>
```

**4.测试**

```java
public class lesson01 {
    @Test
    public void test1(){
        //1.加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        //2.根据id获取bean
        IUserService userService = (UserService) context.getBean("userService");
        //3.调用add方法
        userService.add();
    }
}
```

```
控制台:
name:张三
```

## 加载Spring容器的三种方式

**1.类路径获得配置文件(最常用)**

```java
//通过类路径加载beans.xml
ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
```

**2.文件系统路径获得配置文件**

```java
//文件系统路径加载beans.xml
String path = "C:\\Users\\admin\\IdeaProjects\\spring\\src\\beans.xml";
ApplicationContext context = new FileSystemXmlApplicationContext(path);     
```

**3.使用BeanFactory(了解)**

```java
//使用BeanFactory加载beans.xml
String path = "C:\\Users\\admin\\IdeaProjects\\spring\\src\\beans.xml";
BeanFactory context = new XmlBeanFactory(new FileSystemResource(path));
```

## 装配Bean(xml)

### 第一种方式:new实现类

```xml
<!-- 第一种方式: new 实现类-->
<bean name="userService" class="com.zh.service.UserService"></bean>
```

```java
public class lesson01 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans1.xml");
        //1.new对象
        IUserService userService = (UserService) context.getBean("userService");
        userService.add();
    }
}
```

```
控制台:
name:null
```

### 第二种方式:使用静态工厂

```java
//静态工厂类static
package com.zh.service;

public class UserSereviceFactory {
    public static IUserService createUserService(){
        return new UserService();
    }
}
```

```xml
<!-- 第二种方式：通过静态工厂方法 spring的版本过低，3.0版本,把jdk改成1.7-->
<bean name="userService" class="com.zh.service.UserSereviceFactory" factory-method="createUserService"></bean>
```

```java
public class lesson01 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans1.xml");

        //使用工厂类创建对象
        IUserService userService = (UserService) context.getBean("userService");
        userService.add();
    }
}
```

```
控制台:
name:null
```

### 第三种方式:使用实例工厂

```java
//实例工厂类
package com.zh.service;
public class UserSereviceFactory2 {
    public IUserService createUserService(){
        return new UserService();
    }
}
```

```xml
<!--第三种方式：通过实例工厂方法 -->
<!-- 1.创建实例工厂bean -->
<bean name="factory2" class="com.zh.service.UserSereviceFactory2"></bean>
 <!-- 2.使用工厂bean -->
<bean name="userService" factory-bean="factory2" factory-method="createUserService"></bean>
```

```java
public class lesson01 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans1.xml");

        //使用实例工厂类创建对象
        IUserService userService = (UserService) context.getBean("userService");
        userService.add();
    }
}
```

```
控制台:
name:null
```

## bean的作用域

**掌握前两个常用的即可**

| 类别          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| **singleton** | 在Spring IoC容器中仅存在一个Bean实例，Bean以单例方式存在，默认值 |
| **prototype** | 每次从容器中调用Bean时，都返回一个新的实例，即每次调用getBean()时 ，相当于执行new XxxBean() |

### 第一种:单例

```xml
<!-- 单例方式-->
<bean id="userService" class="com.zh.service.UserService" scope="singleton"></bean>
```

```java
public class lesson02 {
    @Test
    public void test1(){
        //1.加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans2.xml");

        //2.从容器获取两个bean
        IUserService userService1 = (IUserService) context.getBean("userService");
        IUserService userService2 = (IUserService) context.getBean("userService");

        //3.查看是否是同一个对象
        System.out.println(userService1);
        System.out.println(userService2);
    }
}
```

```
com.zh.service.UserService@184f6be2
com.zh.service.UserService@184f6be2
```

### 第二种:多例

```xml
<!-- 多例方式-->
<bean id="userService" class="com.zh.service.UserService" scope="prototype"></bean>
```

```
com.zh.service.UserService@527740a2
com.zh.service.UserService@13a5fe33
```

## 数据的注入

### 1.构造方法注入

```java
package com.zh.model;

public class User {
    private String username;
    private String password;
    private Integer age;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public User(String username, Integer age) {
        this.username = username;
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", age=" + age +
                '}';
    }
}
```

```xml
<!--1.构造方法注入=属性值-->
<bean id="user" class="com.zh.model.User">
    <constructor-arg name="username" value="张三"></constructor-arg>
    <constructor-arg name="password" value="123"></constructor-arg>
</bean>
```

```java
public class lesson03 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans3.xml");
        //1.构造方法注入
        User user = (User) context.getBean("user");
        System.out.println(user);
    }
}
```

```
控制台:
User{username='张三', password='123', age=null}
```

### 2通过索引加类型给构造方法赋值

```xml
<!-- 2.通过索引加类型 给构造方法赋值-->
<bean id="user" class="com.zh.model.User">
    <constructor-arg index="0" value="张三" type="java.lang.String"></constructor-arg>
    <constructor-arg index="1" value="123" type="java.lang.Integer"></constructor-arg>
</bean>
```

```
控制台:
User{username='张三', password='123', age=null}
```

### 3.通过set方法往bean注入属性值

```java
//需要提供无参构造方法
package com.zh.model;

public class User {
    private String username;
    private String password;
    private Integer age;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
}
```

```xml
<!-- 3.通过set方法往bean注入属性值-->
<bean id="user" class="com.zh.model.User">
    <property name="username" value="张三"></property>
    <property name="password" value="123"></property>
    <property name="age" value="20"></property>
</bean>
```

```
控制台:
User{username='张三', password='123', age=20}
```

### 4.通过p命名空间注入

```xml
<!-- 命名空间 -->
xmlns:p ="http://www.springframework.org/schema/p"
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--3.通过p命名空间注入-->
    <bean id="user" class="com.zh.model.User" p:username="张三" p:password="123" p:age="20"></bean>
</beans>
```

```
控制台:
User{username='张三', password='123', age=20}
```

## SpEL表达式

### 数字、字符串

```xml
<bean id="user" class="com.zh.model.User">
    <!--字符串-->
    <property name="username" value="#{'张三'}"></property>
    <!--数字-->
    <property name="age" value="#{5}"></property>
</bean>
```

```
控制台:
User{username='张三', password='null', age=5}
```

### 引用另一个对象

- ref: 引用`ref="要引用bean的id"`
- SpEL:`value="#{要引用bean的id}"`

```java
package com.zh.model;

public class Customer {
    private String name;
    private String sex = "男";//性别
    private double pi;//性别

    private Address address;
}
```

```java
package com.zh.model;

public class Address {
    private String name;
}
```

```xml
<!--
    一个对象引用另外一个对象两写法
    1.ref: 引用<property name="address" ref="address"></property>
    2.SpEL:<property name="address" value="#{address}"></property>
-->
<bean id="address" class="com.zh.model.Address">
    <property name="name" value="武汉"></property>
</bean>

<!-- 一个对象引用另外一个对象两写法-->
<bean id="customer" class="com.zh.model.Customer">
    <property name="address" value="#{address}"></property>
</bean>
```

```java
public class lesson04 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans4.xml");
        //1.构造方法注入
        Customer customer = (Customer) context.getBean("customer");
        System.out.println(customer);
    }
}
```

```
控制台:
Customer{name='null', sex='男', pi=0.0, address=Address{name='武汉'}}
```

### 执行方法

```xml
<!-- 执行方法 -->
<bean id="customer" class="com.zh.model.Customer">
    <property name="name" value="#{'abc'.toUpperCase()}"></property>
</bean>
```

```
控制台:
Customer{name='ABC', sex='男', pi=0.0, address=null}
```

### 静态方法

```xml
<!-- Math.PI 调用静态方法 -->
<bean id="customer" class="com.zh.model.Customer">
    <property name="pi" value="#{T(java.lang.Math).PI}"></property>
</bean>
```

```
控制台:
Customer{name='null', sex='男', pi=3.141592653589793, address=null}
```

## 集合注入

### 1.List注入

```java
public class Programmer {
    private List<String> cars;

    public List<String> getCars() {
        return cars;
    }

    public void setCars(List<String> cars) {
        this.cars = cars;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
	<!-- list注入 -->
    <bean name="programe" class="com.zh.model.Programmer">
        <property name="cars">
            <list>
                <value>ofo</value>
                <value>mobike</value>
            </list>
        </property>
    </bean>
</beans>
```

```java
public class lesson04 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans5.xml");
        Programmer programmer = (Programmer) context.getBean("programe");
        System.out.println(programmer.getCars());
    }
}
```

```
[ofo, mobike]
```

### 2.Set注入

```java
package com.zh.model;

import java.util.List;
import java.util.Set;

public class Programmer {
    private Set<String> pats;

    public Set<String> getPats() {
        return pats;
    }

    public void setPats(Set<String> pats) {
        this.pats = pats;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- set数据注入-->
    <bean name="programe" class="com.zh.model.Programmer">
        <property name="pats">
            <set>
                <value>机器猫</value>
                <value>加菲猫</value>
            </set>
        </property>
    </bean>
</beans>
```

```
[机器猫, 加菲猫]
```

### 3.Map注入

```java
public class Programmer {
    private Map<String,String> info;

    public Map<String, String> getInfo() {
        return info;
    }

    public void setInfo(Map<String, String> info) {
        this.info = info;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- map数据注入-->
    <bean name="programe" class="com.zh.model.Programmer">
        <property name="info">
            <map>
                <entry key="name" value="zhang"></entry>
                <entry key="age" value="20"></entry>
            </map>
        </property>
    </bean>
</beans>
```

```
{name=zhang, age=20}
```

### 4.Properties注入

```java
public class Programmer {
   private Properties mysqlinfo;

    public Properties getMysqlinfo() {
        return mysqlinfo;
    }

    public void setMysqlinfo(Properties mysqlinfo) {
        this.mysqlinfo = mysqlinfo;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- Properties数据注入-->
    <bean name="programe" class="com.zh.model.Programmer">
        <property name="mysqlinfo">
            <props>
                <prop key="url">mysql:jdbc://localhost:3306/dbname</prop>
                <prop key="user">root</prop>
                <prop key="password">www</prop>
            </props>
        </property>
    </bean>
</beans>
```

```
{user=root, url=mysql:jdbc://localhost:3306/dbname, password=www}
```

### 5.数组注入

```java
public class Programmer {
   private String[] member;

    public String[] getMember() {
        return member;
    }

    public void setMember(String[] member) {
        this.member = member;
    }
}
```

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p ="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 数组数据注入-->
    <bean name="programe" class="com.zh.model.Programmer">
        <property name="member">
            <array>
                <value>father</value>
                <value>mother</value>
                <value>brother</value>
            </array>
        </property>
    </bean>
</beans>
```

```java
public class lesson04 {
    @Test
    public void test1(){
        //加载beans.xml
        ApplicationContext context = new ClassPathXmlApplicationContext("beans5.xml");
        Programmer programmer = (Programmer) context.getBean("programe");
        System.out.println(programmer.getMember()[1]);
    }
}
```

```
mother
```

## 注解注入

开发中：使用注解取代 xml配置文件

`@component`取代`<bean class="">`

`@Component("id")` 取代 `<bean id="" class="">`

**web开发，提供3个@Component注解衍生注解（功能一样）取代**`<bean class="">`

`@Repository(“名称”)`：dao层

`@Service(“名称”)`：service层

`@Controller(“名称”)`：web层

`@Autowired`：自动根据类型注入

`@Qualifier(“名称”)`:指定自动注入的id名称

`@Resource(“名称”)`

`@ PostConstruct` 自定义初始化

`@ PreDestroy` 自定义销毁

### 第一个案例

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context ="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/context
                        http://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 开启注解-->
    <context:annotation-config />
    <!-- 注解的位置-->
    <context:component-scan base-package="com.zh"/>
</beans>
```

**Dao层**

```java
//User
package com.zh.model;

public class User {
    private String username;
    private String password;
    private Integer age;
}
```

**service**

```java
//实现类
@Component
public class UserServiceImpl implements IUserService{
    @Override
    public void add(User user) {
        System.out.println("service 添加用户:" + user);
    }
}

```

```java
//没配置id,通过类型获取
public class lesson05 {
    @Test
    public void test1(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans6.xml");
        //1.如果@Component没配置id,通过类型获取
        IUserService userService = context.getBean(UserServiceImpl.class);

        User user = new User();
        user.setUsername("章三");
        user.setPassword("123");
        user.setAge(10);

        userService.add(user);

    }
}
```

```
service 添加用户:User{username='章三', password='123', age=10}
```

### 第二个案例

```java
//实现类
@Component("userService")
public class UserServiceImpl implements IUserService{
    @Override
    public void add(User user) {
        System.out.println("service 添加用户:" + user);
    }
}
```

```java
//2.如果@Component("userService),配置了id，就可以通过id来获取
IUserService userService = (IUserService) context.getBean("userService");
```

```
service 添加用户:User{username='章三', password='123', age=10}
```

### 第三个案例

**Dao层**

```java
package com.zh.dao;

import com.zh.model.User;

public class UserDaoImpl implements IUserDao{

    @Override
    public void add(User user) {
        System.out.println("dao 添加用户:"+user);
    }
}
```

**service层**

```java
package com.zh.service;

import com.zh.dao.IUserDao;
import com.zh.model.User;

public class UserServiceImpl implements IUserService{
    private IUserDao userDao;

    @Override
    public void add(User user) {
        System.out.println("service 添加用户:" + user);
        //调用Dao
        userDao.add(user);
    }

    public IUserDao getUserDao() {
        return userDao;
    }

    public void setUserDao(IUserDao userDao) {
        this.userDao = userDao;
    }
}
```

**web层**

```java
//web层
package com.zh.web.action;

import com.zh.model.User;
import com.zh.service.IUserService;

public class UserAction {
    private IUserService userService;
    public void save(User user){
        System.out.println("action save方法");
        userService.add(user);
    }

    public IUserService getUserService() {
        return userService;
    }

    public void setUserService(IUserService userService) {
        this.userService = userService;
    }
}
```

```xml
<!-- 配置dao -->
<bean name="userDao" class="com.zh.dao.UserDaoImpl"></bean>

<!-- 配置service -->
<bean name="userService" class="com.zh.service.UserServiceImpl">
    <property name="userDao" ref="userDao"></property>
</bean>

<!-- 配置action -->
<bean id="userAction" class="com.zh.web.action.UserAction">
   <property name="userService" ref="userService"></property>
</bean>
```

```java
public class lesson05 {
    @Test
    public void test1(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans7.xml");

        //1.获取service对象
        UserAction userAction = (UserAction) context.getBean("userAction");

        //2.创建user对象
        User user = new User();
        user.setUsername("张三");
        user.setPassword("mima");
        user.setAge(22);

        //3.调用方法
        userAction.save(user);
    }
}
```

```
action save方法
service 添加用户:User{username='张三', password='mima', age=22}
dao 添加用户:User{username='张三', password='mima', age=22}
```

**2.使用注解**

```java
//dao层
@Repository
public class UserDaoImpl implements IUserDao{

    @Override
    public void add(User user) {
        System.out.println("dao 添加用户:"+user);
    }
}
```

```java
//serve层
@Service
public class UserServiceImpl implements IUserService{
    @Autowired
    private IUserDao userDao;//spring会自动往userDao赋值

    @Override
    public void add(User user) {
        System.out.println("service 添加用户:" + user);
        //调用Dao
        userDao.add(user);
    }

}
```

```java
//web层
@Controller
public class UserAction {
    @Autowired
    private IUserService userService;
    public void save(User user){
        System.out.println("action save方法");
        userService.add(user);
    }

}
```

```java
public class lesson06 {
    @Test
    public void test1(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans6.xml");

        //1.获取action对象
        UserAction userAction = context.getBean(UserAction.class);

        //2.创建user对象
        User user = new User();
        user.setUsername("张三");
        user.setPassword("mima");
        user.setAge(22);

        userAction.save(user);

    }
}
```

```
action save方法
service 添加用户:User{username='张三', password='mima', age=22}
dao 添加用户:User{username='张三', password='mima', age=22}
```

### 第四个案例

--指定注入的id

```java
//指定id
@Service("myUserService")
public class UserServiceImpl implements IUserService{
    @Autowired
    private IUserDao userDao;//spring会自动往userDao赋值

    @Override
    public void add(User user) {
        System.out.println("service 添加用户:" + user);
        //调用Dao
        userDao.add(user);
    }

}
```

```java
//web层
@Controller
public class UserAction {
    @Autowired
    @Qualifier("myUserService")//指定注入的id
    private IUserService userService;
    public void save(User user){
        System.out.println("action save方法");
        userService.add(user);
    }

}
```

```java
//上面可替换
//@Autowired
//@Qualifier("myUserService")//指定注入的id
@Resource(name="myUserService")
```

### 第五个案例

*1.默认单例*

```java
@Controller
public class UserAction {
    @Autowired
    private IUserService userService;
    public void save(User user){
        System.out.println("action save方法");
        userService.add(user);
    }

}
```

```java
public class lesson07 {
    @Test
    public void test1(){
        ApplicationContext context = new ClassPathXmlApplicationContext("beans6.xml");

        //1.获取action对象
        UserAction userAction1 = context.getBean(UserAction.class);
        UserAction userAction2 = context.getBean(UserAction.class);

        System.out.println(userAction1);
        System.out.println(userAction2);
    }
}
```

```
com.zh.web.action.UserAction@3fc15856
com.zh.web.action.UserAction@3fc15856
```

*2.多例配置*

```java
@Controller
@Scope("prototype") //多例配置
public class UserAction {
    @Autowired
    private IUserService userService;
    public void save(User user){
        System.out.println("action save方法");
        userService.add(user);
    }

}
```

```
com.zh.web.action.UserAction@78c1d004
com.zh.web.action.UserAction@7c3ff48b
```

### 第六个案例

```java
//dao层
@Repository
public class UserDaoImpl implements IUserDao{
    // <bean init-method="" destroy-method=""></bean>
    @PostConstruct
    public void myInit(){
        System.out.println("自定义初始化方法。。。");
    }

    @PreDestroy
    public void myDestroy(){
        System.out.println("自定义销毁方法。。。");
    }
    @Override
    public void add(User user) {
        System.out.println("dao 添加用户:"+user);
    }
}
```

```java
//action
public class lesson07 {
    @Test
    public void test1() throws Exception{
        ApplicationContext context = new ClassPathXmlApplicationContext("beans6.xml");

        //1.获取action对象
        UserAction userAction1 = context.getBean(UserAction.class);
		
        //2.关闭context
        context.getClass().getMethod("close").invoke(context);
    }
}
```

```
自定义初始化方法。。。
自定义销毁方法。。。
```

## AOP动态代理

### JDK动态代理

1.目标类

```java
import com.zh.model.User;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
@Service
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
package com.zh.service;

public class MyAspec {
    public void before(){
        System.out.println("开启事务");
    }

    public void after(){
        System.out.println("提交事务");
    }
}
```

**3.工厂类**

```java
public class MyBeanFactory {

    public static IUserService createUserService(){
        //1.创建目标对象target
        final IUserService userService = new UserServiceImpl();
        //2.声明切面类对象
        final MyAspec aspec = new MyAspec();
        //3.把切面类2个方法 应用到目标类

        //3.1创建JDK代理
        /*
            参数1 类加载器,写当前类
            参数2 接口：接口下的方法会被拦截
            参数3 处理
         */
       IUserService serviceProxy = (IUserService) Proxy.newProxyInstance(MyBeanFactory.class.getClassLoader(),
                userService.getClass().getInterfaces(),
                new InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        //开启事务
                        aspec.before();
                        //放行代码,业务方法返回值
                        Object retObj = method.invoke(userService,args);
                        //System.out.println("拦截换回值"+retObj);

                        //提交事务
                        aspec.after();
                        return retObj;
                    }
                }
        );
        return serviceProxy;
    }
}
```

4.测试类

```java
public class lesson08 {
    @Test
    public void test1(){
        //自用实现AOP编程,使用JDK代理来实现
        IUserService userService = MyBeanFactory.createUserService();
        userService.addUser();
    }
}
```

```
开启事务
添加用户
提交事务
```

### cglib增强字节码代理

⭐ 没有接口，只有实现类。

⭐ 采用字节码增强框架 cglib，在运行时 创建目标类的子类，从而对目标类进行增强。

⭐ 导入jar包：

自己导包（了解）：

​     核心：hibernate-distribution-3.6.10.Final\lib\bytecode\cglib\cglib-2.2.jar

​     依赖：struts-2.3.15.3\apps\struts2-blank\WEB-INF\lib\asm-3.3.jar

**采用字节码增强框架 cglib，在运行时 创建目标类的子类(继承)，从而对目标类进行增强。**

```java
//目标类接口
public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
    public int deleteUser(int id);
}
```

```
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }

    @Override
    public int deleteUser(int id) {
        System.out.println("通过id删除用户");
        return 1;
    }
}
```

```java
//切面类
public class MyAspec {
    public void before(){
        System.out.println("开启事务...");
    }

    public void after(){
        System.out.println("提交事务...");
    }
}
```

```java
//代理类
public class MyBeanFactory {
    // cglib实现代理
    public static IUserService createUserService(){
        //1.目标类
        final IUserService userService = new UserServiceImpl();

        //2.切面类
        final MyAspec aspec = new MyAspec();

        //3.cglib核心类
        Enhancer enhancer = new Enhancer();
        //4.设置父类
        enhancer.setSuperclass(userService.getClass());
        //5.设置回调【拦截】
        enhancer.setCallback(new MethodInterceptor() {
            @Override
            public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
                //执行代理类的方法
                aspec.before();
                Object obj = method.invoke(userService,args);
                //Object obj = methodProxy.invokeSuper(proxy,objects);
                aspec.after();
                return obj;
            }
        });

        //创建代理对象
        UserServiceImpl proxy = (UserServiceImpl) enhancer.create();
        return proxy;
    }
}
```

```java
//测试类
public class lesson09 {
    @Test
    public void test1(){
        //采用cglib实现动态代理
        IUserService userService = MyBeanFactory.createUserService();
        userService.addUser();
    }
}
```

```
开启事务...
添加用户
提交事务...
```

### 半自动代理

【核心4+1 、AOP联盟（规范）、spring-aop （实现）】

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
package com.zh.service;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
//MethodInterceptor导入的是aop联盟下的包
public class MyAspect implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation methodInvocation) throws Throwable {
        //拦截方法
        //开启事务
        System.out.println("开启事务...");
        //放行
        Object obj = methodInvocation.proceed();
        //提交事务
        System.out.println("提交事务...");
        return obj;
    }
}
```

**3.spring配置**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.service.MyAspect"></bean>

    <!-- 配置代理  -->
    <bean id="serviceProxy" class="org.springframework.aop.framework.ProxyFactoryBean">
        <!-- 接口：如果只是一个接口，就写Value,如果是多个接口就写List-->
        <property name="interfaces" value="com.zh.service.IUserService"></property>

        <!-- 目标类 -->
        <property name="target" ref="userService"></property>

        <!-- 切面类 -->
        <property name="interceptorNames" value="myAspect"></property>

        <!-- 不配置默认就是JDK的Proxy实现，配置使用cglib生成 -->
        <property name="optimize" value="true"></property>

    </bean>
</beans>
```

**4.测试**

```java
public class lesson09 {
    @Test
    public void test1(){
        //spring半自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans9.xml");

        //创建代理对象
        IUserService userService = (IUserService) context.getBean("serviceProxy");
        userService.addUser();
    }
}
```

```
开启事务...
添加用户
提交事务...
```

### AOP全自动代理

```
spring-framework-3.0.2.RELEASE-dependencies\org.aspectj\com.springsource.org.aspectj.weaver\1.6.8.RELEASE
```

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
package com.zh.service;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
//MethodInterceptor导入的是aop联盟下的包
public class MyAspect implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation methodInvocation) throws Throwable {
        //拦截方法
        //开启事务
        System.out.println("开启事务...");
        //放行
        Object obj = methodInvocation.proceed();
        //提交事务
        System.out.println("提交事务...");
        return obj;
    }
}
```

**3.spring配置**

```xml
<!-- 引入提示 -->
xmlns:aop="http://www.springframework.org/schema/aop"
http://www.springframework.org/schema/aop
http://www.springframework.org/schema/aop/spring-aop.xsd
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.service.MyAspect"></bean>

    <!-- 配置代理  -->
    <!-- proxy-target-class:使用cglib实现代理 -->
    <aop:config proxy-target-class="true">
        <!-- 切入点: proxy-target-class:使用cglib实现代理
        expression 表达式：*任意
        execution(*          com.gyf.service.*.       *          (..))
                  任意返回值     包名        任意类名  任意方法名  任意参数-->
        <aop:pointcut id="mycut" expression="execution(* com.zh.service.*.*(..))"/>
        <!-- advice-ref切面类，pointcut-ref 切入点引用-->
        <aop:advisor advice-ref="myAspect" pointcut-ref="mycut"></aop:advisor>
    </aop:config>
</beans>
```

**4.测试**

```java
public class lesson10 {
    @Test
    public void test1(){
        //spring全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.addUser();
    }
}
```

```
开启事务...
添加用户
提交事务...
```

## AspectJ

AspectJ是一个基于Java语言的AOP框架

Spring2.0以后新增了对AspectJ切点表达式支持

@AspectJ 是AspectJ1.5新增功能，通过JDK5注解技术，允许直接在Bean类中定义切面

**新版本** **Spring** **框架，建议使用** **AspectJ** **方式来开发** **AOP**

**主要用途：自定义开发**

### 前后置通知

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
package com.zh.aspect;

public class MyAspect{
    //自定义的前置通知
    public void myBefore(){
        System.out.println("前置通知...");
    }

    //自定义的后置通知
    public void myAfterReturning(){
        System.out.println("后置通知...");
    }
}
```

**3.配置文件**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>

    <!-- 配置aop -->
    <aop:config>
        <!-- aop:指定切面类-->
        <aop:aspect ref="myAspect">
            <!-- 定义一个切入点 -->
            <aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>

            <!-- 前置通知 method:切面类中的方法名-->
            <aop:before method="myBefore" pointcut-ref="mypointcut"></aop:before>
            <!-- 后置通知 -->
            <aop:after-returning method="myAfterReturning" pointcut-ref="mypointcut"></aop:after-returning>
        </aop:aspect>
    </aop:config>
</beans>
```

**4.测试**

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.addUser();
    }
}
```

```
//前后置通知可以单独使用
前置通知...
添加用户
后置通知...
```

### 环绕通知

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
package com.zh.aspect;

import org.aspectj.lang.ProceedingJoinPoint;

public class MyAspect{

    //自定义环绕通知
    public void myAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("开启事务...");
        Object reobj = pjp.proceed();
        System.out.println("提交事务...");
    }
}

```

**3.配置文件**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>

    <!-- 配置aop -->
    <aop:config>
        <!-- aop:指定切面-->
        <aop:aspect ref="myAspect">
            <!-- 定义一个切入点 -->
            <aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>
            <!-- 环绕通知 -->
            <aop:around method="myAround" pointcut-ref="mypointcut"></aop:around>
        </aop:aspect>
    </aop:config>
</beans>
```

**4.测试**

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.addUser();
    }
}
```

```
开启事务...
添加用户
提交事务...
```

### 通知的执行顺序

```java
/*
JoinPoint可以获取代理对象方法名
ProceedingJoinPoint 可以获取代理对象方法名+放行
*/
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;

public class MyAspect{
    //自定义的前置通知
    public void myBefore(JoinPoint jp){
        System.out.println("前置通知--"+jp.getSignature().getName());
    }

    //自定义的后置通知
    public void myAfterReturning(JoinPoint jp){
        System.out.println("后置通知--"+jp.getSignature().getName());
    }

    //自定义环绕通知
    public void myAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知--开启事务..."+pjp.getSignature().getName());
        Object reobj = pjp.proceed();
        System.out.println("环绕通知--提交事务..."+pjp.getSignature().getName());
    }
}
```

```
前置通知--addUser
环绕通知--开启事务...addUser
添加用户
后置通知--addUser
环绕通知--提交事务...addUser
```

### 异常通知

```java
public class UserServiceImpl implements IUserService{
    public void deleteUser() {
        System.out.println("删除用户");
        //制造一个异常
        int i = 10/0;
    }
}
```

```java
//自定义异常通知
public void myAfterThrowing(JoinPoint jp,Throwable e){
	System.out.println("异常通知:" + jp.getSignature().getName() + "===" +e.getMessage());
}
```

```xml
<!-- 异常通知 throwing 异常方法名-->
<aop:after-throwing method="myAfterThrowing" pointcut-ref="mypointcut" throwing="e"></aop:after-throwing>
```

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.deleteUser();
    }
}
```

```xml
异常通知:deleteUser===/ by zero

java.lang.ArithmeticException: / by zero
```

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
         //制造一个异常
        int i = 10/0;
    }
}
```

**2.切面类**

```java
public class MyAspect{
    //自定义的前置通知
    public void myBefore(JoinPoint jp){
        System.out.println("前置通知--"+jp.getSignature().getName());
    }

    //自定义的后置通知
    public void myAfterReturning(JoinPoint jp){
        System.out.println("后置通知--"+jp.getSignature().getName());
    }

    //自定义环绕通知
    public void myAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知--开启事务..."+pjp.getSignature().getName());
        Object reobj = pjp.proceed();
        System.out.println("环绕通知--提交事务..."+pjp.getSignature().getName());
    }

    //自定义异常通知
    public void myAfterThrowing(JoinPoint jp,Throwable e){
        System.out.println("异常通知:" + jp.getSignature().getName() + "===" + e.getMessage());
    }
}
```

**3.配置文件**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>

    <!-- 配置aop -->
    <aop:config>
        <!-- aop:指定切面-->
        <aop:aspect ref="myAspect">
            <!-- 定义一个切入点 -->
            <aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>

            <!-- 前置通知 -->
            <aop:before method="myBefore" pointcut-ref="mypointcut"></aop:before>
            <!-- 后置通知 -->
            <aop:after-returning method="myAfterReturning" pointcut-ref="mypointcut"></aop:after-returning>

            <!-- 环绕通知 -->
            <aop:around method="myAround" pointcut-ref="mypointcut"></aop:around>

            <!-- 异常通知 throwing 异常方法名-->
            <aop:after-throwing method="myAfterThrowing" pointcut-ref="mypointcut" throwing="e"></aop:after-throwing>
        </aop:aspect>
    </aop:config>
</beans>
```

**4.测试类**

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.deleteUser();
    }
}
```

```
前置通知--deleteUser
环绕通知--开启事务...deleteUser
删除用户
后置通知--deleteUser
异常通知:deleteUser===/ by zero

java.lang.ArithmeticException: / by zero
```

### 最终通知

```java
//自定义最终通知--不管是否异常都会执行
public void myAfter(){
    System.out.println("最终通知--");
}
```

```xml
<!-- 最终通知 -->
<aop:after method="myAfter" pointcut-ref="mypointcut"></aop:after>
```

```
删除用户
最终通知--
```

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
         //制造一个异常
        int i = 10/0;
    }
}
```

**2.切面类**

```java
public class MyAspect{
    //自定义的前置通知
    public void myBefore(JoinPoint jp){
        System.out.println("前置通知--"+jp.getSignature().getName());
    }

    //自定义的后置通知
    public void myAfterReturning(JoinPoint jp){
        System.out.println("后置通知--"+jp.getSignature().getName());
    }

    //自定义环绕通知
    public void myAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知--开启事务..."+pjp.getSignature().getName());
        Object reobj = pjp.proceed();
        System.out.println("环绕通知--提交事务..."+pjp.getSignature().getName());
    }

    //自定义异常通知
    public void myAfterThrowing(JoinPoint jp,Throwable e){
        System.out.println("异常通知:" + jp.getSignature().getName() + "===" + e.getMessage());
        
    }
    //自定义最终通知
    public void myAfter(){
        System.out.println("最终通知--");
    }
}
```

**3.配置文件**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd">
    <!-- 配置目标类 -->
    <bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
    <!-- 配置切面类  -->
    <bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>

    <!-- 配置aop -->
    <aop:config>
        <!-- aop:指定切面-->
        <aop:aspect ref="myAspect">
            <!-- 定义一个切入点 -->
            <aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>

            <!-- 前置通知 -->
            <aop:before method="myBefore" pointcut-ref="mypointcut"></aop:before>
            <!-- 后置通知 -->
            <aop:after-returning method="myAfterReturning" pointcut-ref="mypointcut"></aop:after-returning>

            <!-- 环绕通知 -->
            <aop:around method="myAround" pointcut-ref="mypointcut"></aop:around>

            <!-- 异常通知 throwing 异常方法名-->
            <aop:after-throwing method="myAfterThrowing" pointcut-ref="mypointcut" throwing="e"></aop:after-throwing>
            
            <!-- 最终通知 -->
            <aop:after method="myAfter" pointcut-ref="mypointcut"></aop:after>
        </aop:aspect>
    </aop:config>
</beans>
```

**4.测试类**

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.deleteUser();
    }
}
```

```
前置通知--deleteUser
环绕通知--开启事务...deleteUser
删除用户
异常通知:deleteUser===/ by zero
最终通知--

java.lang.ArithmeticException: / by zero
```

### 后置通知返回值

```java
public String deleteUser(String id) {
   System.out.println("通过id删除用户");
   return id;
}
```

```java
//自定义的后置通知
public void myAfterReturning(JoinPoint jp, Object retValue){
    System.out.println("后置通知--"+jp.getSignature().getName());
    System.out.println("返回值:" + retValue);
}
```

```xml
<!-- 后置通知 returning:返回值对象名-->
<aop:after-returning method="myAfterReturning" pointcut-ref="mypointcut" returning="retValue"></aop:after-returning>
```

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans10.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.deleteUser("2");
    }
}
```

```
通过id删除用户
返回值:2
```

### 使用注解配置

**第1步：声明使用注解**

```xml
<!-- 扫描注解 -->
<context:component-scan base-package="com.zh"></context:component-scan>
<!-- 确定AOP注解生效 -->
<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```

**第2步：用注解替换service和 切面 bean**

```
<!-- 配置目标类 -->
<bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
<!-- 配置切面类  -->
<bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>
```

**用注解代替**

```java
//<bean name="userService" class="com.zh.service.UserServiceImpl"></bean>
@Service("userService")
public class UserServiceImpl implements IUserService{
    @Override
    public void addUser() {
        System.out.println("添加用户");
    }
}
```

```java
//<bean id="myAspect" class="com.zh.aspect.MyAspect"></bean>
@Component
public class MyAspect{
    .....
}
```

**第3步：声明切面**

```XML
<!-- aop:指定切面-->
<aop:aspect ref="myAspect"></aop:aspect>
```

```java
@Component
//<aop:aspect ref="myAspect"></aop:aspect>
@Aspect
public class MyAspect{
	......
}
```

**第4步：声明前置通知**

```xml
<!-- 定义一个切入点 -->
<aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>
<!-- 前置通知 -->
<aop:before method="myBefore" pointcut-ref="mypointcut"></aop:before>
```

```java
@Before("execution(* com.zh.service.*.*(..))")
public void myBefore(JoinPoint jp){
	System.out.println("前置通知--"+jp.getSignature().getName());
}
```

**第5步：声明公共切入点**

```xml
<!-- 定义一个切入点 -->
<aop:pointcut id="mypointcut" expression="execution(* com.zh.service.*.*(..))"/>
```

```java
 //声明公共切入点
@Pointcut("execution(* com.zh.service.*.*(..))")
public void myPoinCut(){
}

//自定义的前置通知
//@Before("execution(* com.zh.service.*.*(..))")
@Before(value = "myPoinCut()")
public void myBefore(JoinPoint jp){
   System.out.println("前置通知--"+jp.getSignature().getName());
}
```

**第6步：声明后置通知**

```xml
<!-- 后置通知 -->
<aop:after-returning method="myAfterReturning" pointcut-ref="mypointcut" returning="retValue"></aop:after-returning>
```

```java
//自定义的后置通知
@AfterReturning(value = "myPoinCut()",returning = "retValue")
public void myAfterReturning(JoinPoint jp, Object retValue){
	System.out.println("后置通知--"+jp.getSignature().getName());
	System.out.println("返回值:" + retValue);
}
```

**第7步：声明环绕通知**

```xml
<!-- 环绕通知 -->
<aop:around method="myAround" pointcut-ref="mypointcut"></aop:around>
```

```java
//自定义环绕通知
@Around(value = "myPoinCut()")
public void myAround(ProceedingJoinPoint pjp) throws Throwable {
	System.out.println("环绕通知--开启事务..."+pjp.getSignature().getName());
	Object reobj = pjp.proceed();
	System.out.println("环绕通知--提交事务..."+pjp.getSignature().getName());
}
```

**第8步：声明异常通知**

```xml
<!-- 异常通知 throwing 异常方法名-->
<aop:after-throwing method="myAfterThrowing" pointcut-ref="mypointcut" throwing="e"></aop:after-throwing>
```

```java
//自定义异常通知
@AfterThrowing(value = "myPoinCut()",throwing = "e")
public void myAfterThrowing(JoinPoint jp,Throwable e){
	System.out.println("异常通知:" + jp.getSignature().getName() + "===" + e.getMessage());
}
```

**第9步：声明最终通知**

```xml
<!-- 最终通知 -->
<aop:after method="myAfter" pointcut-ref="mypointcut"></aop:after>
```

```java
//自定义最终通知
@After(value = "myPoinCut()")
public void myAfter(){
	System.out.println("最终通知--");
}
```

### 注解配置总

**1.目标类**

```java
//目标类接口
package com.zh.service;

public interface IUserService {
    public void addUser();
    public void updateUser();
    public void deleteUser();
}
```

```java
//目标类实现
@Service("userService")
public class UserServiceImpl implements IUserService{

    @Override
    public void addUser() {
        System.out.println("添加用户");
        //int i = 10/0;
    }

    @Override
    public void updateUser() {
        System.out.println("更新用户");
    }

    @Override
    public void deleteUser() {
        System.out.println("删除用户");
    }
}
```

**2.切面类**

```java
@Component
@Aspect
public class MyAspect{
    //声明公共切入点
    @Pointcut("execution(* com.zh.service.*.*(..))")
    public void myPoinCut(){
    }

    //自定义的前置通知
    //@Before("execution(* com.zh.service.*.*(..))")
    @Before(value = "myPoinCut()")
    public void myBefore(JoinPoint jp){
        System.out.println("前置通知--"+jp.getSignature().getName());
    }

    //自定义的后置通知
    @AfterReturning(value = "myPoinCut()",returning = "retValue")
    public void myAfterReturning(JoinPoint jp, Object retValue){
        System.out.println("后置通知--"+jp.getSignature().getName());
        System.out.println("返回值:" + retValue);
    }

    //自定义环绕通知
    @Around(value = "myPoinCut()")
    public void myAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕通知--开启事务..."+pjp.getSignature().getName());
        Object reobj = pjp.proceed();
        System.out.println("环绕通知--提交事务..."+pjp.getSignature().getName());
    }

    //自定义异常通知
    @AfterThrowing(value = "myPoinCut()",throwing = "e")
    public void myAfterThrowing(JoinPoint jp,Throwable e){
        System.out.println("异常通知:" + jp.getSignature().getName() + "===" + e.getMessage());
    }

    //自定义最终通知
    @After(value = "myPoinCut()")
    public void myAfter(){
        System.out.println("最终通知--");
    }
}
```

**3.配置文件**

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
                        http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/aop
                        http://www.springframework.org/schema/aop/spring-aop.xsd
                        http://www.springframework.org/schema/context
                        http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 扫描注解 -->
    <context:component-scan base-package="com.zh"></context:component-scan>
    <!-- 确定AOP注解生效 -->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>
```

**4.测试类**

```java
public class lesson11 {
    @Test
    public void test1(){
        //AspectJ全自动代理
        ApplicationContext context = new ClassPathXmlApplicationContext("beans11.xml");

        //直接创建userService
        IUserService userService = (IUserService) context.getBean("userService");
        userService.addUser();
    }
}
```

```
环绕通知--开启事务...addUser
前置通知--addUser
添加用户
环绕通知--提交事务...addUser
最终通知--
后置通知--addUser
返回值:null
```

## 事务管理

### AOP的事务配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 获取db.properties类路径 -->
    <context:property-placeholder location="classpath:db.properties"></context:property-placeholder>
    <!-- 配置c3p0数据源对象 -->
    <bean name="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${driverClass}"></property>
        <property name="jdbcUrl" value="${jdbcUrl}"></property>
        <property name="user" value="${user}"></property>
        <property name="password" value="${password}"></property>
    </bean>

    <!-- 配置dao -->
    <bean name="accountDao" class="com.zh.dao.Impl.AccountDaoImpl">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置service -->
    <bean name="accountService" class="com.zh.service.Impl.AccountServiceImpl">
        <property name="accountDao" ref="accountDao"></property>
    </bean>
<!-- ................................................................................. -->
    <!-- 配置事务管理器 -->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!--配置dataSource-->
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 基于AOP事务配置 -->
    <!-- 1.配置通知
        propagation 传播行为
        isolation 隔离级别
		transaction-manager事务管理器
    -->
    <tx:advice id="txAdvice" transaction-manager="txManager">
        <tx:attributes>
            <tx:method name="transer" isolation="DEFAULT" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>
    <!-- 2.切面点关联 -->
    <aop:config>
        <aop:advisor advice-ref="txAdvice" pointcut="execution(* com.zh.service.*.*(..))"></aop:advisor>
    </aop:config>
</beans>
```

```java
public class lesson04 {
    @Test
    public void test1() {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans5.xml");
        //获取service
        IAccountService accountService = (IAccountService) context.getBean("accountService");
        //转账
        accountService.transfer("jack","rose",100);
    }
}
```

```
1	jack	9400
2	rose	10600
```

### 注解的事务配置

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx" xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd">

    <!-- 获取db.properties类路径 -->
    <context:property-placeholder location="classpath:db.properties"></context:property-placeholder>
    <!-- 配置c3p0数据源对象 -->
    <bean name="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${driverClass}"></property>
        <property name="jdbcUrl" value="${jdbcUrl}"></property>
        <property name="user" value="${user}"></property>
        <property name="password" value="${password}"></property>
    </bean>

    <!-- 配置dao -->
    <bean name="accountDao" class="com.zh.dao.Impl.AccountDaoImpl">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置service -->
    <bean name="accountService" class="com.zh.service.Impl.AccountServiceImpl">
        <property name="accountDao" ref="accountDao"></property>
    </bean>
<!-- ................................................................................. -->
    <!-- 注解事务管理器配置 -->
    <!-- 1.配置事务管理器 -->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!--配置dataSource-->
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 2.开始注解事务驱动 -->
    <tx:annotation-driven transaction-manager="txManager"></tx:annotation-driven>
</beans>
```

```java
//@Transactional配置在类上所有方法有效,可以配置到方法上,默认配置可以省略参数
@Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.DEFAULT)
public class AccountServiceImpl implements IAccountService{
    public IAccountDao accountDao;

    public void setAccountDao(IAccountDao accountDao) {
        this.accountDao = accountDao;
    }
    @Override
    public void transfer(final String outer, final String innter, final Integer money) {
        //扣钱
        accountDao.out(outer,money);
        //int i = 10/0;
        //进帐
        accountDao.in(innter,money);
    }
}
```

```java
public class lesson04 {
    @Test
    public void test1() {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans6.xml");
       //获取代理类
        IAccountService accountService = (IAccountService) context.getBean("accountService");
        //转账
        accountService.transfer("jack","rose",100);
    }
}
```

```
1	jack	9400
2	rose	10600
```

## Spring整合mybatis

### 1.创建Model

```java
package bean;
 
public class User {
    int id;
    String name;
    int age;
    String sex;
    String school;
 	...get set 
    @Override
    public String toString() {
        return ("姓名："+name+"\n年龄："+age+"\n性别"+sex+"\n学校"+school);
    }
}
```

### 2.写出这个类的映射接口

```java
package dao;
 
import bean.User;
 
public interface IUser {
    User getUserByID (int id);
}
```

### 3.写出这个类的映射Mapper文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="dao.IUser">
    <select id="getUserByID" resultType="User" parameterType="int">
        SELECT * from user where id = #{id}
    </select>
</mapper>
```

### 4.准备mysql.properteis的参数配置文件

```properties
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost/test?useUnicode=true&characterEncoding=UTF-8
jdbc.uid=root
jdbc.password=123456
```

### 5.mybatis配置文件

mybatis文件与之前不同，之前实在**mybatis-config.xml**中配置数据库连接的，现在要把这些放在spring的配置文件中，所以mybatis配置文件中只写类的别名和引用的Mapper

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
 
<configuration>
    <typeAliases>
        <typeAlias alias="User" type="bean.User"/>
    </typeAliases>

    <mappers>
        <!-- // power by http://www.yiibai.com -->
        <mapper resource="xml/User.xml"/>
    </mappers>
 
</configuration>
```

### 6.spring配置文件

在**spring-config.xml中，**我们要配置数据库连接池，和sqlSessionFactory对象，以及UserMapper对象。

- sqlSessionFactory中引用mybatis-config.xml文件
- userMapper中标明要实现的接口

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans  xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:p="http://www.springframework.org/schema/p"
        xmlns:aop="http://www.springframework.org/schema/aop"
        xmlns:context="http://www.springframework.org/schema/context"
        xmlns:tx="http://www.springframework.org/schema/tx"
        xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context-4.2.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-4.3.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-4.3.xsd">
 
    <!--表明引用的参数配置文件是mysql-local.properties-->
    <bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <property name="locations">
            <list>
                <value>
                    mysql-local.properties
                </value>
            </list>
        </property>
    </bean>
 
 
    <!--数据库连接池-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${jdbc.driver}"/>
        <property name="jdbcUrl" value="${jdbc.url}"/>
        <property name="user" value="${jdbc.uid}"/>
        <property name="password" value="${jdbc.password}"/>
        <!-- 初始连接池大小 -->
        <property name="initialPoolSize" value="10"/>
        <!-- 连接池中连接最小个数 -->
        <property name="minPoolSize" value="5"/>
        <property name="maxPoolSize" value="20"/>
     </bean>
 
 
    <!-- 配置SqlSessionFactory对象 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 注入数据库连接池 -->
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="mybatis-spring-config.xml"/> 
    </bean>
 
    <!--配置userMapper对象-->
    <bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="mapperInterface" value="dao.IUser"/>
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>
 
</beans>
```

### 7.测试

```java
package bean;
 
import dao.IUser;
import org.apache.ibatis.session.SqlSession;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
 
public class DemoTest {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("spring-config.xml");
        IUser userMapper = (IUser)context.getBean("userMapper");
        User user = userMapper.getUserByID(2);
        System.out.println(user);
 
    }
 
}
```

