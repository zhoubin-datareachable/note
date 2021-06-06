---
sidebar: true
sidebarDepth: 2
title: mybatis
---
## Mybatis 入门

**1.创建demo类**

```java
public class User implements Serializable {
	private int id;
	private String username;// 用户姓名
	private String sex;// 性别
	private Date birthday;// 生日
	private String address;// 地址
}
```

**2.创建SqlMapConfig.xml(src)**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 配置mybatis的环境信息 -->
    <environments default="development">
        <environment id="development">
            <!-- 配置JDBC事务控制，由mybatis进行管理 -->
            <transactionManager type="JDBC"></transactionManager>
            <!-- 配置数据源，采用dbcp连接池 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useUnicode=true&amp;characterEncoding=utf8"/>
                <property name="username" value="root"/>
                <property name="password" value="root"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```

**3.映射文件**

在classpath下，创建sqlmap文件夹。在com.zh.sqlmap目录下，创建User.xml映射文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!--
	namespace：命名空间，它的作用就是对SQL进行分类化管理，可以理解为SQL隔离
	注意：使用mapper代理开发时，namespace有特殊且重要的作用
 -->
<mapper namespace="test">
    <!--
        [id]：statement的id，要求在命名空间内唯一
        [parameterType]：入参的java类型
        [resultType]：查询出的单条结果集对应的java类型
        [#{}]： 表示一个占位符?
        [#{id}]：表示该占位符待接收参数的名称为id。注意：如果参数为简单类型时，#{}里面的参数名称可以是任意定义
     -->
    <select id="findUserById" parameterType="int" resultType="com.zh.demol.User">
        SELECT * FROM USER WHERE id = #{id}
    </select>
</mapper>
```

**4.配置文件加载映射文件**

```xml
<!-- 加在配置文件 SqlMapConfig.xml(src)-->
<mappers>
	<mapper resource="com/zh/sqlmap/User.xml"></mapper>
</mappers>
```

**5.测试类**

```java
public class demo01 {
    @Test
    public void test1() throws IOException {
        //1.读取配置文件
        InputStream is = Resources.getResourceAsStream("sqlMapConfig.xml");
        //2.通过SqlSessionFactoryBuilder创建SqlSessionFactory会话工厂。
        SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(is);
        //3.通过SqlSessionFactory创建SqlSession。
        SqlSession session = sessionFactory.openSession();
        //4.调用SqlSession的操作数据库方法。
        User user = session.selectOne("findUserById",10);
        System.out.println(user);
        //5.关闭session
        session.close();
    }
}
```

```
User [id=10, username=张三, sex=1, birthday=Thu Jul 10 00:00:00 CST 2014, address=北京市]
```

## Mybatis CRUD

**1.模糊查询用户信息**

```xml
<!--
	[${}]：表示拼接SQL字符串
	[${value}]：表示要拼接的是简单类型参数。
	注意：
	1、如果参数为简单类型时，${}里面的参数名称必须为value
	2、${}会引起SQL注入，一般情况下不推荐使用。但是有些场景必须使用${}，比如order by ${colname}
-->
<select id="findUserByName" parameterType="String" resultType="com.zh.demol.User">
	SELECT * FROM user WHERE username LIKE '%${value}%'
</select>
```

```java
//调用模糊查询方法
List<User> users = session.selectList("findUserByName","张");
System.out.println(users);
```

```
[User [id=10, username=张三, sex=1, birthday=Thu Jul 10 00:00:00 CST 2014, address=北京市], User [id=16, username=张小明, sex=1, birthday=null, address=河南郑州], User [id=24, username=张三丰, sex=1, birthday=null, address=河南郑州]]
```

**2.插入用户信息**

```xml
<!-- 插入用户 -->
<insert id="insertUser" parameterType="com.zh.demol.User">
	INSERT INTO USER (username,sex,birthday,address)
	VALUES (#{username},#{sex},#{birthday},#{address})
</insert>
```

```java
//调用插入方法
session.insert("insertUser",new User("李四","1",new Date(),"湖北武汉"));
//增删改要提交事务
session.commit();
```

```
28	李四	2020-02-25	1	湖北武汉
```

**3.删除用户**

```xml
<!-- 删除用户 -->
<delete id="deletUser" parameterType="int">
	delete from user where id = #{id}
</delete>
```

```java
//删除方法
session.delete("deletUser",26);
//增删改要提交事务
session.commit();
```

**4.更新用户**

```xml
<!-- 更新用户 -->
<update id="updateUser" parameterType="com.zh.demol.User">
	update user set username=#{username},sex=#{sex} where id=#{id}
</update>
```

```java
//修改方法
User user = new User();
user.setId(29);
user.setUsername("王五");
user.setSex("2");
session.update("updateUser",user);
//增删改要提交事务
session.commit();
```

```
29	王五	2020-02-25	2	湖北武汉
```

**5.主键返回之MySQL自增主键**

```xml
<!-- 
[selectKey标签]：通过select查询来生成主键
[keyProperty]：指定存放生成主键的属性
[resultType]：生成主键所对应的Java类型
[order]：指定该查询主键SQL语句的执行顺序，相对于insert语句
[last_insert_id]：MySQL的函数，要配合insert语句一起使用 
-->
<insert id="insertUser" parameterType="com.zh.demol.User">
	<selectKey keyProperty="id" resultType="int" order="AFTER">
		SELECT  LAST_INSERT_ID()
	</selectKey>
	INSERT INTO USER (username,sex,birthday,address)
	VALUES(#{username},#{sex},#{birthday},#{address})
</insert>
```

```java
 //调用插入方法
User user = new User("李四","1",new Date(),"湖北武汉");
int afterRow = session.insert("insertUser",user);
//增删改要提交事务
session.commit();
System.out.println("收影响的行数:"+afterRow);
System.out.println("用户id:"+user.getId());
```

```
//返回插入后的id
收影响的行数:1
用户id:31
```

**6.主键返回之MySQL自增UUID**

```xml
<insert id="insertUser" parameterType="com.gyf.domain.User">
		<selectKey keyProperty="id" resultType="String" order="BEFORE">
			SELECT UUID()
		</selectKey>
		INSERT INTO USER (username,sex,birthday,address) 
		VALUES(#{username},#{sex},#{birthday},#{address})
</insert>
```

**7.MyBatis的Dao编写【mapper代理方式实现】**  

**第一步**重新写个UserMapper配置文件和定义mapper映射文件UserMapper.xml（内容同Users.xml，**除了namespace的值**），放到新创建的目录mapper下。

```java
//com.zh.mapper.UserMapper
package com.zh.mapper;

import com.zh.demol.User;

public interface UserMapper {
    public User findUserById(int id);
}
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- 
namespace:接口全类名
id:接口方法名
parameterType:接口传入参数类型
resultType:接口返回值类型
-->
<mapper namespace="com.zh.mapper.UserMapper">
    <select id="findUserById" parameterType="int" resultType="com.zh.demol.User">
        SELECT * FROM USER WHERE id = #{?}
    </select>
</mapper>
```

```xml
<!-- 加在配置文件 -->
<mappers>
	<mapper resource="com/zh/mapper/UserMapper.xml"></mapper>
</mappers>
```

```java
public class demo02 {
    @Test
    public void test1() throws IOException {
        //1.读取配置文件
        InputStream is = Resources.getResourceAsStream("sqlMapConfig.xml");
        //2.通过SqlSessionFactoryBuilder创建SqlSessionFactory会话工厂。
        SqlSessionFactory sessionFactory = new SqlSessionFactoryBuilder().build(is);
        //3.获取session
        SqlSession session = sessionFactory.openSession();
        //4.通过session获取代理
        UserMapper userMapper = session.getMapper(UserMapper.class);
        User user = userMapper.findUserById(24);
        System.out.println(user);
    }
}
```

```
User [id=24, username=张三丰, sex=1, birthday=null, address=河南郑州]
```

## Mybatis 全局配置文件

**properties数据库文件配置**

```properties
# src/db.properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis?useUnicode=true&amp;characterEncoding=utf8
username=root
password=root
```

```xml
<configuration>
    <!-- 引用数据连接信息 -->
    <properties resource="db.properties"></properties>
    <!-- 配置mybatis的环境信息 -->
    <environments default="development">
        <environment id="development">
            <!-- 配置JDBC事务控制，由mybatis进行管理 -->
            <transactionManager type="JDBC"></transactionManager>
            <!-- 配置数据源，采用dbcp连接池 -->
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
<configuration>
```

**setting【了解】**

```xml
<settings>
	<setting name="" value=""/>
</settings>
```

**typeAliases(别名)**

```xml
<!--src/SqlMapConfig.xml-->
<!-- 第一种方式:别名方式 -->
<typeAliases>
    <typeAlias type="com.zh.demol.User" alias="u"></typeAlias>
</typeAliases>
```

```xml
<!--com/zh/mapper/UserMapper.xml-->
<mapper namespace="com.zh.mapper.UserMapper">
    <select id="findUserById" parameterType="int" resultType="u">
        SELECT * FROM USER WHERE id = #{?}
    </select>
</mapper>
```

```xml
<!--src/SqlMapConfig.xml-->
<!-- 第二种方式:包方式 -->
<typeAliases>
	<package name="com.zh.demol"/>
</typeAliases>
```

```xml
<!--com/zh/mapper/UserMapper.xml-->
<!-- 大小写均可(User,user)-->
<mapper namespace="com.zh.mapper.UserMapper">
    <select id="findUserById" parameterType="int" resultType="User">
        SELECT * FROM USER WHERE id = #{?}
    </select>
</mapper>
```

**加载配置文件mappers**

```xml
<!-- 加在配置文件 -->
<mappers>
	<!--第一种:写映射文件的名字-->
	<mapper resource="com/zh/mapper/UserMapper.xml"></mapper>
	<!--第二种:写类名,一定要有映射文件UserMapper.xml-->
	<mapper class="com.zh.mapper.UserMapper"></mapper>
	<!--第三种：可以写包名（推荐）-->
	<package name="com.zh.mapper"/>
</mappers>
```

## Mybatis 映射文件

### 输入映射

**ParameterType**

**1.传递简单类型**

```xml
<select id="findUserById" parameterType="int" resultType="com.zh.demol.User">
	SELECT * FROM USER WHERE id = #{id}
</select>
```

**2.传递demol对象**

```xml
<!-- 更新用户 -->
<update id="updateUser" parameterType="com.zh.demol.User">
	update user set username=#{username},sex=#{sex} where id=#{id}
</update>
```

**3.传递包装对象**

```java
//1.定义包装类
package com.zh.vo;

import com.zh.demol.User;

public class UserQueryVo {
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
```

```java
//2.修改userMapper.java
package com.zh.mapper;

import com.zh.demol.User;
import com.zh.vo.UserQueryVo;

import java.util.List;

public interface UserMapper {
    public User findUserById(int id);
    //声明包装
    public List<User> findUserList(UserQueryVo userQueryVo);
}
```

```xml
<!-- 修改UsrMappler.xml -->
<!--通过包装类查询用户-->
<select id="findUserList" parameterType="userQueryVo" resultType="user">
	SELECT * FROM user WHERE sex=#{user.sex} AND username LIKE '%${user.username}%'
</select>
```

```java
//测试
//构造查询对象
UserQueryVo vo = new UserQueryVo();

//设置set
User user = new User();
user.setSex("1");
user.setUsername("张");
vo.setUser(user);

//查询
List<User> users = userMapper.findUserList(vo);
System.out.println(users);
session.close();
```

```
[User [id=10, username=张三, sex=1, birthday=Thu Jul 10 00:00:00 CST 2014, address=北京市], User [id=16, username=张小明, sex=1, birthday=null, address=河南郑州], User [id=24, username=张三丰, sex=1, birthday=null, address=河南郑州], User [id=35, username=张三, sex=1, birthday=Wed Feb 26 00:00:00 CST 2020, address=湖北武汉]]
```

**4传递Map对象**

```java
public interface UserMapper {
    public List<User> findUserByMap(Map<String,Object> map);
}
```

```xml
<!--通过Map查询数据-->
<select id="findUserByMap" parameterType="hashmap" resultType="user">
	SELECT * FROM user WHERE username = #{username} AND sex = #{sex}
</select>
```

```java
Map<String,Object> map = new HashMap<String,Object>();
map.put("username","张三");
map.put("sex","1");

List<User> list = userMapper.findUserByMap(map);
System.out.println(list);
```

```
[User [id=10, username=张三, sex=1, birthday=Thu Jul 10 00:00:00 CST 2014, address=北京市], User [id=35, username=张三, sex=1, birthday=Wed Feb 26 00:00:00 CST 2020, address=湖北武汉]]
```

### 输出映射 

**resultType/resultMap**

**1.输出简单类型**

```java
public int findUserCount(UserQueryVo vo);
```

```xml
<select id="findUserCount" parameterType="userQueryVo" resultType="int">
	SELECT COUNT(*) FROM  user WHERE sex = #{user.sex}
</select>
```

```java
//构造查询对象
UserQueryVo vo = new UserQueryVo();

//设置set
User user = new User();
user.setSex("2");
vo.setUser(user);

//查询
int count = userMapper.findUserCount(vo);
System.out.println(count);
```

```
3
```

**2.输出POJO单个对象+列表**

```xml
<select id="findUserById" parameterType="int" resultType="User">
	SELECT * FROM USER WHERE id = #{?}
</select>
```

**3.resultMap**

如果查询出来的列名和属性名不一致，通过定义一个**resultMap将列名和pojo属性名**之间作一个映射关系。

```java
public User findUserByIdResultMap(int id);
```

```xml
<!--1.设置返回数据为resultMap -->
<resultMap id="userResultMap" type="user">
	<id property="id" column="id_"></id>
	<result property="username" column="username_"></result>
	<result property="sex" column="sex_"></result>
	<result property="birthday" column="birthday_"></result>
	<result property="address" column="address_"></result>
</resultMap>

<!--2.使用resultMap -->
<select id="findUserByIdResultMap" parameterType="int" resultMap="userResultMap">
	SELECT id id_, username username_, sex sex_, birthday birthday_, address address_ FROM user WHERE id = #{id}
</select>
```

```java
User user = userMapper.findUserByIdResultMap(1);
System.out.println(user);
```

```
User [id=1, username=王五, sex=2, birthday=null, address=null]
```

## Mybatis 动态SQL

### if和where

If标签：作为判断入参来使用的，如果符合条件，则把if标签体内的SQL拼接上。

**注意：用if** **进行判断是否为空时，不仅要判断null** ，也要判断空字符串

Where标签：会去掉条件中的第一个and符号。

```xml
public List<User> findUserList(UserQueryVo userQueryVo);
```

```xml
<select id="findUserList" parameterType="userQueryVo" resultType="user">
	SELECT * FROM user
	<!-- if和where的使用 -->
	<where>
		<if test="user != null">
			<if test="user.sex != null and user.sex != ''">
				sex=#{user.sex}
 			</if>
			<if test="user.username != null and user.username != null">
				AND username LIKE '%${user.username}%'
			</if>
		</if>
	</where>
</select>
```

```java
//构造查询对象
UserQueryVo vo = new UserQueryVo();

//设置set
User user = new User();
user.setUsername("小");
vo.setUser(user);

//查询
List<User> users = userMapper.findUserList(vo);
System.out.println(users);
```

```
SELECT * FROM user WHERE username LIKE '%小%' 

[User [id=16, username=张小明, sex=1, birthday=null, address=河南郑州]]
```

### SQL片断

```xml
<!-- sql片段 -->
<sql id="select_user_where">
	<if test="user != null">
		<if test="user.sex != null and user.sex != ''">
             sex=#{user.sex}
        </if>
        <if test="user.username != null and user.username != null">
            AND username LIKE '%${user.username}%'
        </if>
    </if>
</sql>

<select id="findUserList" parameterType="userQueryVo" resultType="user">
	SELECT * FROM user
	<where>
	<!-- 引用sql -->
		<include refid="select_user_where"/>
	</where>
</select>
```

### foreach 遍历

**案例：查询指定id的用户 `SELECT * FROM user where id in (31,32,33);`** 

```java
//UserQueryVO.java
public class UserQueryVo {
    private User user;
    private List<Integer> ids; //get,set
}
```

```xml
<select id="findUserList" parameterType="userQueryVo" resultType="user">
	SELECT * FROM user
	<where>
		<if test="ids!=null and ids.size > 0">
			<!-- collection:集合,写集合属性,item:遍历接收变量,open:遍历开始,close：遍历结束
				separator:拼接格式 相当于for(Integer id : ids){ }
			-->
			<foreach collection="ids" item="id" open="AND id IN(" close=")" separator=",">
				${id}
			</foreach>
        </if>
    </where>
</select>
```

```java
//构造查询对象
UserQueryVo vo = new UserQueryVo();

//设置list
List<Integer> ids = new ArrayList<>();
ids.add(25);
ids.add(28);
ids.add(29);
vo.setIds(ids);
//查询
List<User> users = userMapper.findUserList(vo);
System.out.println(users);
```

```
SELECT * FROM user WHERE id IN( 25 , 28 , 29 ) 

[User [id=25, username=陈小明, sex=1, birthday=null, address=河南郑州], 
User [id=28, username=李四, sex=1, birthday=null, address=湖北武汉], 
User [id=29, username=王五, sex=2, birthday=null, address=湖北武汉]]
```

## Mybatis 多表查询

### 一对一 

#### resultType实现

复杂查询时，单表对应的po类已不能满足输出结果集的映射。所以要根据需求建立一个**扩展类来作为resultType的类型**。

```java
public class Orders {
    //提供get,set方法,toString
    private Integer id;
    private Integer userId;
    private String number;
    private Date createtime;
    private String note;
}
```

**第一步：写个定单的扩展类**

```java
public class OrdersExt extends Orders{
    //提供get,set,toString和父类方法
    private String username;
    private String address;
    public String toString() {
        return "OrdersExt{" +
                "username='" + username + '\'' +
                ", address='" + address + '\'' +
                '}'+super.toString();
    }
}
```

**第二步：声明定单接口**

```java
package com.zh.mapper;

import com.zh.demol.OrdersExt;

public interface OrderMapper {
    //根据id信息查询,返回扩展类对象
    public OrdersExt findOrderById(int id);
}
```

**第三步：声明定单配置文件**

```xml
<mapper namespace="com.zh.mapper.OrderMapper">
    <select id="findOrderById" parameterType="int" resultType="OrdersExt">
        SELECT o.*,u.username,u.address
        FROM  orders o,user u
        WHERE o.user_id = u.id AND o.id = #{id}
    </select>
</mapper>
```

**第四步：加载映射文件**

```xml
<mapper resource="com/zh/mapper/OrderMapper.xml"></mapper>
```

**第五步：测试**

```java
//1.通过session获取代理
OrderMapper orderMapper = session.getMapper(OrderMapper.class);

//2.ordersExt
OrdersExt ordersExt = orderMapper.findOrderById(5);
System.out.println(ordersExt);
session.close();
```

```
OrdersExt{username='张三', address='北京市'}Orders{id=5, userId=null, number='1000012', createtime=Thu Feb 12 16:13:23 CST 2015, note='null'}
```

#### resultMap实现

**第一步：在orders里添加一个user对象**

```java
public class Orders {
    private Integer id;
    private Integer userId;
    private String number;
    private Date createtime;
    private String note;

    private User user;

    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}
```

**第二步：声明定单接口**

```java
package com.zh.mapper;

import com.zh.demol.OrdersExt;

public interface OrderMapper {
    //根据id信息查询,返回扩展类对象
    public Orders findOrdersByResultMap(int ordersId);
}
```

**第三步：声明定单配置文件**

```xml
<resultMap id="ordersRslMap" type="orders">
	<result column="id" property="id"></result>
	<result column="number" property="number"></result>
	<result column="createtime" property="createtime"></result>
	<result column="note" property="note"></result>
	<!--关联内部对象-->
	<association property="user" javaType="com.zh.demol.User">
		<result column="username" property="username"></result>
		<result column="address" property="address"></result>
	</association>
</resultMap>

<select id="findOrdersByResultMap" parameterType="int" resultMap="ordersRslMap">
	SELECT o.*,u.username,u.address
	FROM  orders o,user u
	WHERE o.user_id = u.id AND o.id = #{id}
</select>
```

**第四步：加载映射文件**

```xml
<mapper resource="com/zh/mapper/OrderMapper.xml"></mapper>
```

**第五步：测试**

```java
//1.通过session获取代理
OrderMapper orderMapper = session.getMapper(OrderMapper.class);

//2.ordersExt
Orders orders = orderMapper.findOrdersByResultMap(5);
System.out.println(orders);
System.out.println(orders.getUser());
```

### 一对多

根据定单ID查找定单信息、用户信息和定单明细信息

```java
//订单明细模型
package com.zh.demol;

public class OrderDetail {
    private Integer id;//定单详情ID
    private Integer itemsId;//商品ID
    private Integer itemsNum;//商品购买数量
}
```

**第一步：在Orders中添加定单明细**

```java
public class Orders {
    private Integer id;
    private Integer userId;
    private String number;
    private Date createtime;
    private String note;

    //用户信息
    private User user;
    //订单明细
    private List<OrderDetail> orderDetails;
}
```

**第二步：Mapper接口**

```java
public interface OrderMapper {
    //一对多查询
    public Orders findOrdersByRsltMap(int ordersId);
}
```

**第三步：OrderMapper.xml**

```xml
<resultMap id="ordersRslMap" type="orders">
        <!--匹配orders-->
        <result column="id" property="id"></result>
        <result column="number" property="number"></result>
        <result column="createtime" property="createtime"></result>
        <result column="note" property="note"></result>
        <!--匹配orders里的user 一对一-->
        <association property="user" javaType="com.zh.demol.User">
            <id column="user_id" property="id"></id>
            <result column="username" property="username"></result>
            <result column="address" property="address"></result>
        </association>
        <!--匹配orders里的orderdetail 一对多
        注意：集合里类型使用ofType,而不javaType
        property: orders里的private List<OrderDetail> orderDetails;
        -->
        <collection property="orderDetails" ofType="OrderDetail">
            <id column="detail_id" property="id"></id>
            <result column="items_id" property="itemsId"></result>
            <result column="items_num" property="itemsNum"></result>
        </collection>
    </resultMap>

    <select id="findOrdersByRsltMap" parameterType="int" resultMap="ordersRslMap">
        Select
			orders.id,orders.user_id,orders.number,
			orders.createtime,orders.note,
			user.username,user.address,
			orderdetail.id detail_id,orderdetail.items_id,orderdetail.items_num
		from
			orders,user,orderdetail
		where
			orders.user_id = user.id
			and orders.id = orderdetail.orders_id
  			and orders.id = #{?};

	</select>
```

**第四步：测试**

```java
 //1.通过session获取代理
OrderMapper orderMapper = session.getMapper(OrderMapper.class);

//2.ordersExt
Orders orders = orderMapper.findOrdersByRsltMap(3);
System.out.println(orders);
System.out.println(orders.getUser());
for(OrderDetail orderDetail:orders.getOrderDetails()){
	System.out.println(orderDetail);
}
```

```
Orders{id=3, userId=null, number='1000010', createtime=Wed Feb 04 13:22:35 CST 2015, note='null'}
User [id=1, username=王五, sex=null, birthday=null, address=null]
OrderDetail{id=1, itemsId=1, itemsNum=1}
OrderDetail{id=2, itemsId=2, itemsNum=3}
```

### 多对多

**映射思路**

⭐ 将用户信息映射到user中。

⭐ 在user类中添加订单列表属性`List<Orders> orderslist`，将用户创建的订单映射到orderslist

⭐ 在Orders中添加订单明细列表属性`List<Orderdetail> detailList`，将订单的明细映射到detailList

⭐ 在Orderdetail中添加Items属性，将订单明细所对应的商品映射到Items**第一步：UserMapper.java**

```java
public interface UserMapper {
    //查找用户购买的商品信息
    public List<User> findUserAndOrderInfo();
}
```

**第二步：User/Orders/Orderdetail.java**

```java
//user模型:一个用户有多个订单
public class User implements Serializable {
   private int id;
   private String username;// 用户姓名
   private String sex;// 性别
   private Date birthday;// 生日
   private String address;// 地址
   private List<Orders> orderList; //一个用户有多个订单
}
```

```java
//orders模型:一个订单有多张明细
public class Orders {
    private Integer id;
    private Integer userId;
    private String number;
    private Date createtime;
    private String note;
    //订单明细
    private List<OrderDetail> orderDetails;
}
```

```java
//OrderDetail:详情对应的商品
public class OrderDetail {
    private Integer id;//定单详情ID
    private Integer itemsId;//商品ID
    private Integer itemsNum;//商品购买数量
    private Items items; //订单详情对应的商品
}
```

```java
//商品购买信息
package com.zh.demol;

public class Items {
    private Integer id;
    private String name;
    private String price;
    private String detail;
}
```

**第三步：UserMapper.xml**

```xml
<resultMap id="userRslMap" type="user">
    <id column="id" property="id"></id>
    <result column="address" property="address"></result>
    <!-- 2.匹配user的orderList -->
    <collection property="orderList" ofType="orders">
        <id column="order_id" property="id"></id>
        <result column="number" property="number"/>
        <result column="createtime" property="createtime"/>
        <result column="note" property="note"/>

        <!-- 3.匹配Orders里有orderDetails-->
        <collection property="orderDetails" ofType="orderDetail">
            <id column="detail_id" property="id"></id>
            <result column="items_id" property="itemsId"></result>
            <result column="items_num" property="itemsNum"></result>

            <!-- 4.配置定单详情的商品信息-->
            <association property="items" javaType="items">
                <id column="name" property="name"></id>
                <result column="price" property="price"></result>
                <result column="detail" property="detail"></result>
            </association>
        </collection>
    </collection>

</resultMap>
<select id="findUserAndOrderInfo" resultMap="userRslMap">
    SELECT u.id,u.username,u.address,
           o.id order_id,o.number,o.createtime,o.note,
        od.id detail_id,od.items_id,od.items_num,
           it.name,it.price,it.detail
    FROM
     user u,orders o,orderdetail od,items it
    WHERE
        o.user_id = u.id
        AND o.id = od.orders_id
        AND od.items_id = it.id;
</select>
```

**第四步：测试**

```java
//1.通过session获取代理
UserMapper userMapper = session.getMapper(UserMapper.class);

//2.获取user集合
List<User> users = userMapper.findUserAndOrderInfo();
for (User user:users){
	System.out.println("用户信息:"+user);
	for(Orders order:user.getOrderList()){
		System.out.println("订单信息："+order);
		System.out.println("订单详情");
		for(OrderDetail orderDetail:order.getOrderDetails()){
			System.out.println(orderDetail+":"+orderDetail.getItems());
		}
	}
}
```

```
用户信息:User [id=1, username=null, sex=null, birthday=null, address=null]
订单信息：Orders{id=3, userId=null, number='1000010', createtime=Wed Feb 04 13:22:35 CST 2015, note='null'}
订单详情
OrderDetail{id=1, itemsId=1, itemsNum=1}:com.zh.demol.Items@2504df84
OrderDetail{id=2, itemsId=2, itemsNum=3}:com.zh.demol.Items@62ee6618
订单信息：Orders{id=4, userId=null, number='1000011', createtime=Tue Feb 03 13:22:41 CST 2015, note='null'}
订单详情
OrderDetail{id=3, itemsId=3, itemsNum=4}:com.zh.demol.Items@1170e466
OrderDetail{id=4, itemsId=2, itemsNum=3}:com.zh.demol.Items@aa2ed7c
```

## 一级缓存

![](https://ae01.alicdn.com/kf/H906d81dbd4e643e39067a93ce68ebd4ae.png)

**测试1**

```java
//使用一级缓存
UserMapper userMapper = session.getMapper(UserMapper.class);
User user1 = userMapper.findUserById(1);
System.out.println(user1);

//第二次不会执行sql
User user2 = userMapper.findUserById(1);
System.out.println(user2);
```

```
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ? 
DEBUG [main] - ==> Parameters: 1(Integer)
DEBUG [main] - <==      Total: 1
User [id=1, username=王五, sex=2, birthday=null, address=null]
User [id=1, username=王五, sex=2, birthday=null, address=null]
```

**测试2**

```java
//一级缓存
UserMapper userMapper = session.getMapper(UserMapper.class);
User user1 = userMapper.findUserById(1);
System.out.println(user1);

//保存，删除，更新后会清除一级缓存
User user = new User("张三", "1", new Date(), "湖北武汉");
userMapper.save(user);

//第二次将执行sql
User user2 = userMapper.findUserById(1);
System.out.println(user2);
```

```
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ?  --第一次执行sql
DEBUG [main] - ==> Parameters: 1(Integer)
DEBUG [main] - <==      Total: 1
User [id=1, username=王五, sex=2, birthday=null, address=null]
DEBUG [main] - ==>  Preparing: INSERT INTO USER (username,sex,birthday,address) VALUES(?,?,?,?)  --清除了缓存
DEBUG [main] - ==> Parameters: 张三(String), 1(String), 2020-02-28 12:15:32.777(Timestamp), 湖北武汉(String)
DEBUG [main] - <==    Updates: 1
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ?  --第二次执行sql
DEBUG [main] - ==> Parameters: 1(Integer)
DEBUG [main] - <==      Total: 1
User [id=1, username=王五, sex=2, birthday=null, address=null]
```

## 二级缓存

![](https://ae01.alicdn.com/kf/H1c78337261aa40b98ef3c4ade89dced2M.png)

**1.开启二级缓存总开关**

```xml
<settings>
    <!--开启二级缓存-->
    <setting name="cacheEnabled" value="true"/>
    <!--配置懒加载-->
    <setting name="lazyLoadingEnabled" value="true"/>
</settings>
```

**2.UserMapper中配置二级缓存**

```xml
<mapper namespace="com.zh.mapper.UserMapper">
    <cache></cache>
</mapper>
```

**3.User系列化**

```java
//实现Serializable序列化
public class User implements Serializable{
   private int id;
   private String username;// 用户姓名
   private String sex;// 性别
   private Date birthday;// 生日
   private String address;// 地址
}
```

**4.测试1**

```java
//获取session
SqlSession session1 = sessionFactory.openSession();
SqlSession session2 = sessionFactory.openSession();
//获取mapper
UserMapper userMapper1 = session1.getMapper(UserMapper.class);
UserMapper userMapper2 = session2.getMapper(UserMapper.class);

//二级缓存
User user1 = userMapper1.findUserById(1);
System.out.println(user1);
//session关闭会写入二级缓存
session1.close();

//第二次不会执行sql
User user2 = userMapper2.findUserById(1);
System.out.println(user2);
session2.close();
```

```
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ? --第一次执行sql
DEBUG [main] - ==> Parameters: 1(Integer)
DEBUG [main] - <==      Total: 1
User [id=1, username=王五, sex=2, birthday=null, address=null]
DEBUG [main] - Resetting autocommit to true on JDBC Connection [com.mysql.jdbc.JDBC4Connection@48f87a17]
DEBUG [main] - Closing JDBC Connection [com.mysql.jdbc.JDBC4Connection@48f87a17]
DEBUG [main] - Returned connection 1224243735 to pool.
DEBUG [main] - Cache Hit Ratio [com.zh.mapper.UserMapper]: 0.5 --从二级缓存中取
User [id=1, username=王五, sex=2, birthday=null, address=null]
```

**4.测试2**

```java
//获取session
SqlSession session1 = sessionFactory.openSession();
SqlSession session2 = sessionFactory.openSession();
SqlSession session3 = sessionFactory.openSession();
//获取mapper
UserMapper userMapper1 = session1.getMapper(UserMapper.class);
UserMapper userMapper2 = session2.getMapper(UserMapper.class);
UserMapper userMapper3 = session3.getMapper(UserMapper.class);

//二级缓存
User user1 = userMapper1.findUserById(1);
System.out.println(user1);
//session关闭会写入二级缓存
session1.close();


//保存，删除，更新后会清除二级缓存
userMapper3.save(user1);
session3.commit();

//第二次将执行sql
User user2 = userMapper2.findUserById(1);
System.out.println(user2);
```

```
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ?    
User [id=1, username=王五, sex=2, birthday=null, address=null]
DEBUG [main] - ==>  Preparing: INSERT INTO USER (username,sex,birthday,address) VALUES(?,?,?,?)                                                 --二级缓存被清除
DEBUG [main] - ==> Parameters: 王五(String), 2(String), null, null
DEBUG [main] - ==>  Preparing: SELECT * FROM USER WHERE id = ?  --第二次执行sql
User [id=1, username=王五, sex=2, birthday=null, address=null]  
```

**禁用指定方法二级缓存**

```xml
<select id="findUserById" parameterType="int" resultType="User" useCache="false">
    SELECT * FROM USER WHERE id = #{?}
</select>
```

**刷新缓存**

```xml
<!-- 刷新二级缓存,设置为false保存，删除，更新后不会清除二级缓存-->
<insert id="save" parameterType="user" flushCache="false">
    INSERT INTO USER (username,sex,birthday,address)
    VALUES(#{username},#{sex},#{birthday},#{address})
</insert>
```

### 整合ehcache

**整合思路**Cache是一个接口，它的默认实现是mybatis的PerpetualCache。如果想整合mybatis的二级缓存，那么实现Cache接口即可。

**1.添加jar包**

**ehcache-core-2.6.5.jar**

**mybatis-ehcache-1.0.2.jar**

**2.设置映射文件中cache标签**

```xml
<mapper namespace="com.zh.mapper.UserMapper">
    <cache type="org.mybatis.caches.ehcache.LoggingEhcache"></cache>
</mapper>
```

**3.在src下添加ehcache的配置文件**

```xml
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">

    <diskStore path="java.io.tmpdir"/>
    <defaultCache
            maxElementsInMemory="10000"
            eternal="false"
            timeToIdleSeconds="120"
            timeToLiveSeconds="120"
            maxElementsOnDisk="10000000"
            diskExpiryThreadIntervalSeconds="120"
            memoryStoreEvictionPolicy="LRU">
        <persistence strategy="localTempSwap"/>
    </defaultCache>
</ehcache>
```

**测试：用上面二级缓存例子即可**

## 逆向工程

**1.创建generator.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>

    <context id="mysqlTables" targetRuntime="MyBatis3">
        <!--数据库配置-->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/mybatis"
                        userId="root"
                        password="root">
        </jdbcConnection>

        <!-- java类型解析 -->
        <javaTypeResolver >
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <!-- 模型生成包名-->
        <javaModelGenerator targetPackage="com.zh.backoffice.model" targetProject=".\src">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>

        <!-- mybatis的映射.xml-->
        <sqlMapGenerator targetPackage="com.zh.backoffice.mapper"  targetProject=".\src">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>

        <!-- mybatis 的mapper接口生成的包路径-->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.zh.backoffice.mapper"  targetProject=".\src">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <!-- 配置生成表的模型-->
        <table tableName="item" domainObjectName="Item" ></table>
        <table tableName="orderdetail" domainObjectName="OrderDetail" ></table>
        <table tableName="orders" domainObjectName="Orders" ></table>
        <table tableName="user" domainObjectName="User" ></table>

    </context>
</generatorConfiguration>
```

**2.使用java类来执行逆向工程**

**需要导入mysql的驱动包和mybatis的逆向工程包**

```java
public class Main {
    public static void main(String[] args) throws Exception{
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;
        File configFile = new File("src/generator.xml");
        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = cp.parseConfiguration(configFile);
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config,
                callback, warnings);
        myBatisGenerator.generate(null);
    }
}
```

