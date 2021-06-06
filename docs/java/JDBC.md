---
sidebar: true
sidebarDepth: 2
title: JDBC
---
# 一、JDBC详解

## 1.快速入门

```java
        //2.注册驱动
        Class.forName("com.mysql.jdbc.Driver");
        //3.获取数据库连接对象
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db3", "root", "root");
        //4.定义sql语句
        String sql = "update account set balance = 500 where id = 1";
        //5.获取执行sql的对象 Statement
        Statement stmt = conn.createStatement();
        //6.执行sql
        int count = stmt.executeUpdate(sql);
        //7.处理结果
        System.out.println(count);
        //8.释放资源
        stmt.close();
        conn.close();
```

## 2.详解各个对象：

**2.1DriverManager：驱动管理对象**

**功能：注册驱动：告诉程序该使用哪一个数据库驱动jar**

```java
//加载类到内存
Class.forName("com.mysql.jdbc.Driver");
```

```java
//com.mysql.jdbc.Driver
public class Driver extends NonRegisteringDriver implements java.sql.Driver {
    public Driver() throws SQLException {
    }

    static {
        try {
            //注册驱动
            DriverManager.registerDriver(new Driver());
        } catch (SQLException var1) {
            throw new RuntimeException("Can't register driver!");
        }
    }
}
```

**注意：mysql5之后的驱动jar包可以省略注册驱动的步骤。**

```
//在jar包META-INF/services/java.sql.Driver
com.mysql.jdbc.Driver
com.mysql.fabric.jdbc.FabricMySQLDriver
```

**2.2获取数据库连接：**

```java
//DriverManager下的静态方法
//方法：public static Connection getConnection(String url,String user, String password)
Connection conn = DriverManager.getConnection("jdbc:mysql:///dbs","root","root");
```

**2.3Connection：数据库连接对象**

```java
//Statement对象
String sql = "update account set balance = 500 where id = 1";
//获取执行sql的对象 Statement
Statement statement = connection.createStatement();
//1.execute方法,返回值为是否执行成功(一般不用)
boolean execute(String sql) 
//2.executeUpdate,返回更新的行数
int executeUpdate(String sql) 
//3.executeQuery,返回查询到的结果集
ResultSet executeQuery(String sql)  
```

**2.4 ResultSet：结果集对象,封装查询结果**

```java
//next方法：下移动一行，判断是否是最后一行(默认在第0行)
boolean next()
//参数：
//1. int：代表列的编号,从1开始
getString(1)
//2. String：代表列名称。  
getDouble("balance")
```

```java
while(rs.next()){
	int id = rs.getInt(1);
	String name = rs.getString("name");
	double balance = rs.getDouble(3);
}
```

## 3.prepareStatement对象

```
String sql = "update account set balance = balance - ? where id = ?";
//1.获取执行sql对象
prepareStatement pstmt = conn.prepareStatement(sql1);
//2. 设置参数
pstmt1.setDouble(1,500);
pstmt1.setInt(2,1);
//3.执行sql
pstmt1.executeUpdate();
```



# 二、JDBC工具类 

```properties
url=jdbc:mysql:///test
user=root
password=root
driver=com.mysql.jdbc.Driver
```

```java
public class JDBCUtils2 {
    private static String driver;
    private static String url;
    private static String user;
    private static String password;
    static{
        try {
            //1.创建properties集合类
            Properties pro = new Properties();
            //2.加载文件
            //获取类加载器
            ClassLoader classLoader = JDBCUtils2.class.getClassLoader();
            URL res = classLoader.getResource("jdbc.properties");
            String path = res.getPath();
            pro.load(new FileReader(path));
            //3.获取数据
            driver = pro.getProperty("driver");
            url = pro.getProperty("url");
            user = pro.getProperty("user");
            password = pro.getProperty("password");
            //4.注册驱动
            try {
                Class.forName(driver);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //获取connection对象
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url,user,password);
    }

    //释放资源
    public static void close(Statement stmt,Connection conn){
        close(null,stmt,conn);
    }

    public static void close(ResultSet rs,Statement stmt,Connection conn){
        if(rs!=null){
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(stmt!=null){
            try {
                stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(conn!=null){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**测试**

```java
public class test {
    @Test
    public void test1(){
        Connection conn = null;
        Statement stmt = null;
        try {
            conn = JDBCUtils2.getConnection();
            stmt = conn.createStatement();
            stmt.execute("select * from account");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JDBCUtils2.close(stmt,conn);
        }
    }
}
```

# 一、C3P0连接池

* 步骤：
  1. **导入jar包 (两个) c3p0-0.9.5.2.jar mchange-commons-java-0.2.12.jar 。**要导入数据库驱动jar包
  2. 定义配置文件：
     * 名称： c3p0.properties 或者 c3p0-config.xml
     * 路径：直接将文件放在src目录下即可。

## 1.c3p0基本使用

```xml
<c3p0-config>
  <!-- 使用默认的配置读取连接池对象 -->
  <default-config>
  	<!--  连接参数 -->
    <property name="driverClass">com.mysql.jdbc.Driver</property>
    <property name="jdbcUrl">jdbc:mysql://localhost:3306/test</property>
    <property name="user">root</property>
    <property name="password">root</property>
    
    <!-- 连接池参数 -->
    <!--初始化申请的连接数量-->
    <property name="initialPoolSize">2</property>
    <!--最大的连接数量-->
    <property name="maxPoolSize">3</property>
    <!--超时时间-->
    <property name="checkoutTimeout">3000</property>
  </default-config>

  <!-- 一般不使用 -->
  <named-config name="otherc3p0"> 
    <!--  连接参数 -->
    <property name="driverClass">com.mysql.jdbc.Driver</property>
    <property name="jdbcUrl">jdbc:mysql://localhost:3306/test</property>
    <property name="user">root</property>
    <property name="password">root</property>
    
    <!-- 连接池参数 -->
    <property name="initialPoolSize">5</property>
    <property name="maxPoolSize">8</property>
    <property name="checkoutTimeout">1000</property>
  </named-config>
</c3p0-config>
```

```java
public class Main {

    public static void main(String[] args) throws SQLException {
	    //1.创建数据库连接池对象
        DataSource ds = new ComboPooledDataSource();
        //2.获取连接对象
        Connection conn = ds.getConnection();
        //3.打印对象
        System.out.println(conn);

    }
}
```

```
com.mchange.v2.c3p0.impl.NewProxyConnection@de0a01f [wrapping: com.mysql.jdbc.JDBC4Connection@4c75cab9]
```

## 2.c3p0最大连接数量

```java
public class Main {

    public static void main(String[] args) throws SQLException {
	    //1.创建数据库连接池对象
        DataSource ds = new ComboPooledDataSource();
        //2.获取连接对象
        for (int i = 1; i <=4 ; i++) {
            Connection conn = ds.getConnection();
            System.out.println("第"+i+"个"+conn);
        }
    }
}
```

```
第1个com.mchange.v2.c3p0.impl.NewProxyConnection@5f5a92bb [wrapping: com.mysql.jdbc.JDBC4Connection@6fdb1f78]
第2个com.mchange.v2.c3p0.impl.NewProxyConnection@29444d75 [wrapping: com.mysql.jdbc.JDBC4Connection@2280cdac]
第3个com.mchange.v2.c3p0.impl.NewProxyConnection@4fccd51b [wrapping: com.mysql.jdbc.JDBC4Connection@44e81672]
Exception in thread "main" java.sql.SQLException: An attempt by a client to checkout a Connection has timed out.   ---超出定义的最大连接数量报错
```

## 3.归还连接到连接池

```java
public class Main {

    public static void main(String[] args) throws SQLException {
	    //1.创建数据库连接池对象
        DataSource ds = new ComboPooledDataSource();
        //2.获取连接对象
        for (int i = 1; i <=4 ; i++) {
            Connection conn = ds.getConnection();
            System.out.println("第"+i+"个"+conn);
            if(i==2){
                conn.close(); //归还到连接池
            }
        }
    }
}
```

```
第1个com.mchange.v2.c3p0.impl.NewProxyConnection@de0a01f [wrapping: com.mysql.jdbc.JDBC4Connection@4c75cab9]
第2个com.mchange.v2.c3p0.impl.NewProxyConnection@6f79caec [wrapping: com.mysql.jdbc.JDBC4Connection@67117f44]  --归还到连接池
第3个com.mchange.v2.c3p0.impl.NewProxyConnection@6979e8cb [wrapping: com.mysql.jdbc.JDBC4Connection@763d9750]
第4个com.mchange.v2.c3p0.impl.NewProxyConnection@2be94b0f [wrapping: com.mysql.jdbc.JDBC4Connection@67117f44]  --从连接池中重新获取
```

## 4.指定名称配置

```java
public class Main {

    public static void main(String[] args) throws SQLException {
	    //1.创建数据库连接池对象(指定名称配置)
        DataSource ds = new ComboPooledDataSource("otherc3p0");
        //2.获取连接对象
        for (int i = 1; i <=5 ; i++) {
            Connection conn = ds.getConnection();
            System.out.println("第"+i+"个"+conn);
        }

    }
}
```

```
第1个com.mchange.v2.c3p0.impl.NewProxyConnection@ba4d54 [wrapping: com.mysql.jdbc.JDBC4Connection@12bc6874]
第2个com.mchange.v2.c3p0.impl.NewProxyConnection@4c75cab9 [wrapping: com.mysql.jdbc.JDBC4Connection@1ef7fe8e]
第3个com.mchange.v2.c3p0.impl.NewProxyConnection@67117f44 [wrapping: com.mysql.jdbc.JDBC4Connection@5d3411d]
第4个com.mchange.v2.c3p0.impl.NewProxyConnection@5fe5c6f [wrapping: com.mysql.jdbc.JDBC4Connection@6979e8cb]
第5个com.mchange.v2.c3p0.impl.NewProxyConnection@5c0369c4 [wrapping: com.mysql.jdbc.JDBC4Connection@2be94b0f]
```

# 二、Druid连接池 

Druid：数据库连接池实现技术，由阿里巴巴提供的
	1. 步骤：
		1. 导入jar包 druid-1.0.9.jar
		2. 定义配置文件：
			* 是properties形式的
			* 可以叫任意名称，可以放在任意目录下
		3. 加载配置文件。Properties
		4. 获取数据库连接池对象：通过工厂来来获取  DruidDataSourceFactory
		5. 获取连接：getConnection

## 1.druid基本使用

```properties
# Druid.properties
driverClassName=com.mysql.jdbc.Driver
url=jdbc:mysql://127.0.0.1:3306/test
username=root
password=root
initialSize=5
maxActive=10
maxWait=3000
```

```java
public class Main {

    public static void main(String[] args) throws Exception {
	    //1.加载配置文件
        Properties pro = new Properties();
        InputStream is = Main.class.getClassLoader().getResourceAsStream("druid.properties");
        pro.load(is);
        //2.获取连接池对象
        DataSource ds = DruidDataSourceFactory.createDataSource(pro);
        //3.获取连接
        Connection conn = ds.getConnection();
        System.out.println(conn);
    }
}
```

```
com.mysql.jdbc.JDBC4Connection@2280cdac
```

## 2.druid工具类

```java
public class JDBCUtils {
    //1.定义静态连接池对象
    private static DataSource ds;

    //2.加载配置文件，获取连接池
    static {
        try {
            //1.加载配置文件
            Properties pro = new Properties();
            InputStream is = JDBCUtils.class.getClassLoader().getResourceAsStream("druid.properties");
            pro.load(is);
            //2.获取连接池对象
            ds = DruidDataSourceFactory.createDataSource(pro);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //3.获取连接
    public static Connection getConnection() throws SQLException {
        return ds.getConnection();
    }

    //4.释放资源Statement和Connection
    public static void close(Statement stmt, Connection conn){
        //调用重载的方法
        close(null,stmt,conn);
    }

    public static void close(ResultSet rs,Statement stmt, Connection conn){
        if(rs!=null){
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(stmt!=null){
            try {
                stmt.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if(conn!=null){
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    //5.获取连接池方法
    public static DataSource getDataSource(){
        return ds;
    }
}
```

## 3.测试工具类

```java
public class Main {

    public static void main(String[] args){
        Connection conn = null;
        PreparedStatement pstmt =null;
        try {
            //1.获取连接
            conn = JDBCUtils.getConnection();
            //2.定义sql
            String sql = "insert into account values(?,?)";
            //3.获取pstmt对象
            pstmt = conn.prepareStatement(sql);
            //4.给？赋值
            pstmt.setString(1,"张三");
            pstmt.setDouble(2,5000);
            //5.执行sql
            int count = pstmt.executeUpdate();
            System.out.println(count);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            //6.释放资源
            JDBCUtils.close(pstmt,conn);
        }

    }
}
```

