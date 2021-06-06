---
sidebar: true
sidebarDepth: 2
title: IO流
---
# 四、字节输出流

## 4.1 字节输出流的所有类的超类

**输出流共有的方法**

| Modifier and Type | Method and Description                                       |
| ----------------- | ------------------------------------------------------------ |
| `void`            | `close()`  关闭此输出流并释放与此流相关联的任何系统资源。    |
| `void`            | `flush()`  刷新此输出流并强制任何缓冲的输出字节被写出。      |
| `void`            | `write(byte[] b)`  将 `b.length`字节从指定的字节数组写入此输出流。 |
| `void`            | `write(byte[] b,  int off, int len)`  从指定的字节数组写入 `len`个字节，从偏移 `off`开始输出到此输出流。 |
| `abstract void`   | `write(int b)`  将指定的字节写入此输出流。                   |

**已知直接子类：** 
ByteArrayOutputStream ， FileOutputStream ， FilterOutputStream ， ObjectOutputStream ， OutputStream ， PipedOutputStream

## 4.2 文件字节输出流

**构造方法摘要**

| Constructor and Description                                  |
| ------------------------------------------------------------ |
| `FileOutputStream(File file)`  创建文件输出流以写入由指定的 `File`对象表示的文件。 |
| `FileOutputStream(File file,  boolean append)`  创建文件输出流以写入由指定的 `File`对象表示的文件。 |
| `FileOutputStream(FileDescriptor fdObj)`  创建文件输出流以写入指定的文件描述符，表示与文件系统中实际文件的现有连接。 |
| `FileOutputStream(String name)`  创建文件输出流以指定的名称写入文件。 |
| `FileOutputStream(String name,  boolean append)`  创建文件输出流以指定的名称写入文件。 |

## 4.3 写入一个字节

```java
//字节流写入数据到文件
public class Demo01 {
    public static void main(String[] args) throws IOException {
        //1.FileOutputStream(String name)
        // 创建文件输出流以指定的名称写入文件。
        FileOutputStream fos = new FileOutputStream("src\\a.txt");
        //2.void---write(byte[] b)
        //将 b.length个字节从指定的字节数组写入此文件输出流。
        fos.write(97);
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
项目src下生成了一个a.txt
内容:a
```

## 4.4 写入多个字节

```java
//写入多个字节
public class Demo02 {
    public static void main(String[] args) throws IOException {
        //1.FileOutputStream(String name)
        // 创建文件输出流以指定的名称写入文件。
        FileOutputStream fos = new FileOutputStream("src\\a.txt");
        //2.void---write(byte[] b)
        //将 b.length个字节从指定的字节数组写入此文件输出流。
        byte[] bytes = {97,98,99,100};
        fos.write(bytes);
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
文件:
abcd
```

```java
//指定字节数组写入此文件输出流
public class Demo02 {
    public static void main(String[] args) throws IOException {
        //1.FileOutputStream(String name)
        // 创建文件输出流以指定的名称写入文件。
        FileOutputStream fos = new FileOutputStream("src\\a.txt");
        //2.void--write(byte[] b, int off, int len)
        //将 len字节从位于偏移量 off的指定字节数组写入此文件输出流。
        byte[] bytes = {97,98,99,100};
        fos.write(bytes,1,2);
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
文件
bc
```

```java
//字符串转字节流输出到文件
public class Demo02 {
    public static void main(String[] args) throws IOException {
        //1.FileOutputStream(String name)
        // 创建文件输出流以指定的名称写入文件。
        FileOutputStream fos = new FileOutputStream("src\\a.txt");
        //2.void---write(byte[] b)
        //将 b.length个字节从指定的字节数组写入此文件输出流。
        //3.字符串转字节
        byte[] bytes = "你好".getBytes();
        fos.write(bytes);
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
文件
你好
```

## 4.3 字节流的续写和换行

```java
//字节流的续写
public class Demo03 {
    public static void main(String[] args) throws IOException {
        //FileOutputStream(String name, boolean append)
        //创建文件输出流以指定的名称写入文件。append是否续写
        FileOutputStream fos = new FileOutputStream("src\\a.txt",true);
        //2.void---write(byte[] b)
        //将 b.length个字节从指定的字节数组写入此文件输出流。
        fos.write("你好".getBytes());
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
运行三次
你好你好你好
```

```java
//字节流的换行
public class Demo03 {
    public static void main(String[] args) throws IOException {
        //FileOutputStream(String name, boolean append)
        //创建文件输出流以指定的名称写入文件。append是否续写
        FileOutputStream fos = new FileOutputStream("src\\b.txt",true);
        //2.void---write(byte[] b)
        //将 b.length个字节从指定的字节数组写入此文件输出流。
        //换行 windows \r\n linux /n mar /r
        for (int i = 0; i < 5; i++) {
            fos.write("你好".getBytes());
            fos.write("\r\n".getBytes());
        }
        //void close()
        //关闭此文件输出流并释放与此流相关联的任何系统资源。
        fos.close();
    }
}
```

```
你好
你好
你好
你好
你好
```

# 五、字节输入流

## 4.1 字节输入流的所有类的超类

**输入流共有的方法**

| Modifier and Type | Method and Description                                       |
| ----------------- | ------------------------------------------------------------ |
| `int`             | `available()`  返回从该输入流中可以读取（或跳过）的字节数的估计值，而不会被下一次调用此输入流的方法阻塞。 |
| `void`            | `close()`  关闭此输入流并释放与流相关联的任何系统资源。      |
| `void`            | `mark(int readlimit)`  标记此输入流中的当前位置。            |
| `boolean`         | `markSupported()`  测试这个输入流是否支持 `mark`和 `reset`方法。 |
| `abstract int`    | `read()`  从输入流读取数据的下一个字节。                     |
| `int`             | `read(byte[] b)`  从输入流读取一些字节数，并将它们存储到缓冲区 `b` 。 |
| `int`             | `read(byte[] b,  int off, int len)`  从输入流读取最多 `len`字节的数据到一个字节数组。 |
| `void`            | `reset()`  将此流重新定位到上次在此输入流上调用 `mark`方法时的位置。 |
| `long`            | `skip(long n)`  跳过并丢弃来自此输入流的 `n`字节数据。       |

**已知直接子类：** 
AudioInputStream ， ByteArrayInputStream ， FileInputStream ， FilterInputStream ， InputStream ， ObjectInputStream ， PipedInputStream ， SequenceInputStream ， StringBufferInputStream 

## 4.2 一次读入一个字节

```java
//读取一个字节
public class Demo04 {
    public static void main(String[] args) throws IOException {
        //1.FileInputStream(String name) 构造字节输入流
        // 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的路径名 name命名。
        FileInputStream fis = new FileInputStream("src\\a.txt");
        //int--read() 从该输入流读取一个字节的数据。
        int b = fis.read();
        System.out.println(b);
        System.out.println((char)b);
    }
}
```

```
控制台
97
a
```

```java
//读取一个字节
public class Demo04 {
    public static void main(String[] args) throws IOException {
        //1.FileInputStream(String name) 构造字节输入流
        // 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的路径名 name命名。
        FileInputStream fis = new FileInputStream("src\\a.txt");
        //int--read() 从该输入流读取一个字节的数据。
        int len = 0;//将读入的字节存到变量中
        while ((len=fis.read())!=-1){
            System.out.println(len);
        }
    }
}
```

```
控制台
97
98
99
100
101
102
```

## 4.3 一次读入多个字节

```java
//一次读取多个字节
public class Demo05 {
    public static void main(String[] args) throws IOException {
        //int---read(byte[] b) 从该输入流读取最多 b.length个字节的数据为字节数组。
        //返回值为有效的字节个数
        //1.定义字节输入流
        FileInputStream fis = new FileInputStream("src\\a.txt");
        //2.定义字节数组
        byte[] bytes = new byte[1024];
        int len=0;
        while((len=fis.read(bytes))!=-1){
            System.out.println("有效长度:"+len);
            System.out.println(new String(bytes));
        }
    }
}
```

```
控制台:
有效长度:6
abcdef(后面许多空格)
```

```java
//一次读取多个字节
public class Demo06 {
    public static void main(String[] args) throws IOException {
        //int---read(byte[] b) 从该输入流读取最多 b.length个字节的数据为字节数组。
        //返回值为有效的字节个数
        //1.定义字节输入流
        FileInputStream fis = new FileInputStream("src\\a.txt");
        //2.定义字节数组
        byte[] bytes = new byte[1024];
        int len=0;
        while((len=fis.read(bytes))!=-1){
            //字节转换为字符串
            //String(byte[] bytes, int offset, int length, String charsetName)
            //构造一个新的 String通过使用指定的字符集解码指定的字节子阵列。
            String str = new String(bytes,0,len);
            System.out.println(str);
        }
    }
}
```

```
abcdef(没有空格)
```

## 4.4 文件的复制

```java
//单字节复制
public class Demo07 {
    public static void main(String[] args) throws IOException {
        //1.创建字节输入流对象
        FileInputStream fis = new FileInputStream("E:\\1.mp4");
        //2.创建字节输出流对象
        FileOutputStream fos = new FileOutputStream("D:\\1.mp4");
        //3.定义存储字节的变量
        int len = 0;
        //4.读取字节和写入字节
        //开始时间
        long start = System.currentTimeMillis();
        while ((len=fis.read())!=-1){
            fos.write(len);
        }
        //5.关闭流对象
        fos.close();
        fis.close();
        //结束时间
        long end = System.currentTimeMillis();
        System.out.println("总共耗时:"+(end-start)+"毫秒");
    }
}
```

```
总共耗时:58631毫秒
```

```java
//多字节复制
public class Demo07 {
    public static void main(String[] args) throws IOException {
        //1.创建字节输入流对象
        FileInputStream fis = new FileInputStream("E:\\1.mp4");
        //2.创建字节输出流对象
        FileOutputStream fos = new FileOutputStream("D:\\1.mp4");
        //3.定义存储字节数组
        byte[] bytes = new byte[1024];
        //4.读取字节和写入字节
        //开始时间
        long start = System.currentTimeMillis();
        int len = 0; //有效个数的长度
        while((len=fis.read(bytes))!=-1){
            fos.write(bytes,0,len);
        }
        //5.关闭流对象
        fos.close();
        fis.close();
        //结束时间
        long end = System.currentTimeMillis();
        System.out.println("总共耗时:"+(end-start)+"毫秒");
    }
}
```

```
总共耗时:107毫秒
```

## 4.5 字节流存在问题

```
中文站3个字节,字节流每次只读取一个字节会产生乱码
下面是读取
你好
```

```java
//读取多个字节流
public class Demo04 {
    public static void main(String[] args) throws IOException {
        //1.FileInputStream(String name) 构造字节输入流
        // 通过打开与实际文件的连接来创建一个 FileInputStream ，该文件由文件系统中的路径名 name命名。
        FileInputStream fis = new FileInputStream("src\\a.txt");
        //int--read() 从该输入流读取一个字节的数据。
        int len = 0;//将读入的字节存到变量中
        while ((len=fis.read())!=-1){
            System.out.println(len);
        }
    }
}
```

```
228
189
160
229
165
189
```

# 六、字符流输入流

## 6.1 字符输入流的所有类的超类

**共有的方法**

| Modifier and Type | Method and Description                                       |
| ----------------- | ------------------------------------------------------------ |
| `abstract void`   | `close()`  关闭流并释放与之相关联的任何系统资源。            |
| `void`            | `mark(int readAheadLimit)`  标记流中的当前位置。             |
| `boolean`         | `markSupported()`  告诉这个流是否支持mark（）操作。          |
| `int`             | `read()`  读一个字符                                         |
| `int`             | `read(char[] cbuf)`  将字符读入数组。                        |
| `abstract int`    | `read(char[] cbuf,  int off, int len)`  将字符读入数组的一部分。 |
| `int`             | `read(CharBuffer target)`  尝试将字符读入指定的字符缓冲区。  |
| `boolean`         | `ready()`  告诉这个流是否准备好被读取。                      |
| `void`            | `reset()`  重置流。                                          |
| `long`            | `skip(long n)`  跳过字符                                     |

**已知直接子类：** 
BufferedReader ， CharArrayReader ， FilterReader ， InputStreamReader ， PipedReader ， StringReader 

## 6.2 一次读入一个字符

```java
//一次读入一个字符
public class Demo08 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输入流对象FileReader(String fileName)
        //创建一个新的 FileReader ，给定要读取的文件的名称。
        FileReader fr = new FileReader("src\\a.txt");
        //2.int---read() 读一个字符
        int len = 0;//把读入的字符存到变量
        while ((len=fr.read())!=-1){
            System.out.print((char)len);
        }
        //3.关闭流
        fr.close();
    }
}
```

```
你好aa123##
```

## 6.3 一次读入多个字符

```java
//一次读入多个字符
public class Demo09 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输入流对象FileReader(String fileName)
        //创建一个新的 FileReader ，给定要读取的文件的名称。
        FileReader fr = new FileReader("src\\a.txt");
        //2.int---read(char[] cbuf)
        int len = 0;//字符有效个数
        //3.存入的字符数组
        char[] chars = new char[1024];
        while ((len=fr.read(chars))!=-1){
            //字符转换为字符串
            String str = new String(chars,0,len);
            System.out.println(str);
        }
    }
}
```

```
你好aa123##
```

# 七、字符输出流

## 7.1 字符输出流的所有类的超类

**共有方法**

| Modifier and Type | Method and Description                                       |
| ----------------- | ------------------------------------------------------------ |
| `Writer`          | `append(char c)`  将指定的字符附加到此作者。                 |
| `Writer`          | `append(CharSequence csq)`  将指定的字符序列附加到此作者。   |
| `Writer`          | `append(CharSequence csq, int start,  int end)`  将指定字符序列的子序列附加到此作者。 |
| `abstract void`   | `close()`  关闭流，先刷新。                                  |
| `abstract void`   | `flush()`  刷新流。                                          |
| `void`            | `write(char[] cbuf)`  写入一个字符数组。                     |
| `abstract void`   | `write(char[] cbuf,  int off, int len)`  写入字符数组的一部分。 |
| `void`            | `write(int c)`  写一个字符                                   |
| `void`            | `write(String str)`  写一个字符串                            |
| `void`            | `write(String str,  int off, int len)`  写一个字符串的一部分。 |

**已知直接子类：** 
BufferedWriter ， CharArrayWriter ， FilterWriter ， OutputStreamWriter ， PipedWriter ， PrintWriter ， StringWriter 

## 7.1 一次写入单个字符

```java
//一次写入一个字符
public class Demo10 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(String fileName)
        //构造一个给定文件名的FileWriter对象。
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.void---write(int c) 写一个字符
        fw.write(5678);
        //3.abstract---void flush() 刷新流。将内存中的数据刷新到硬盘
        fw.flush();
        //4.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
ᘮ
```

## 7.2 flush和close方法的区别

**flush: 刷新缓冲区，刷新之后流可以继续使用**

**close: 刷新缓冲区，通知系统释放资源，流不能继续使用**

## 7.3 一次写多个字符

```java
//一次写入一个字符数组
public class Demo11 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(String fileName)
        //构造一个给定文件名的FileWriter对象。
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.void write(char[] cbuf)
        //写入一个字符数组。
        char[] c = {'a','b','中'};
        fw.write(c);
        //3.abstract---void flush() 刷新流。将内存中的数据刷新到硬盘
        //fw.flush();
        //4.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
ab中
```

```java
//一次写入字符数组一部分
public class Demo12 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(String fileName)
        //构造一个给定文件名的FileWriter对象。
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.abstract void write(char[] cbuf, int off, int len)
        //写入字符数组的一部分。
        char[] c = {'a','b','中'};
        fw.write(c,0,2);
        //3.abstract---void flush() 刷新流。将内存中的数据刷新到硬盘
        //fw.flush();
        //4.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
ab
```

```java
//一次写入字符串
public class Demo12 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(String fileName)
        //构造一个给定文件名的FileWriter对象。
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.void write(String str) 写一个字符串
        fw.write("你好");
        //3.abstract---void flush() 刷新流。将内存中的数据刷新到硬盘
        //fw.flush();
        //4.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
你好
```

```java
//一次字符串的一部分。
public class Demo12 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(String fileName)
        //构造一个给定文件名的FileWriter对象。
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.void write(String str, int off, int len) 写一个字符串的一部分。
        fw.write("你好啊",1,2);
        //3.abstract---void flush() 刷新流。将内存中的数据刷新到硬盘
        //fw.flush();
        //4.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
好啊
```

## 7.4 字符输出流的续写和换行

```java
//字符输出流的续写和换行
public class Demo13 {
    public static void main(String[] args) throws IOException {
        //1.创建字符输出流对象FileWriter(File file, boolean append) 续写
        FileWriter fw = new FileWriter("src\\a.txt",true);
        //2.void write(String str, int off, int len) 写一个字符串的一部分。
        for (int i = 0; i < 3; i++) {
            fw.write("你好");
            fw.write("\r\n");
        }
        //3.关闭流---关闭流之前也会刷新流
        fw.close();
    }
}
```

```
你好
你好
你好
```

## 7.5 try catch处理流中的异常

```java
//流的try catch
public class Demo14 {
    public static void main(String[] args){
        FileWriter fw = null;
        try {
            fw = new FileWriter("srcc\\a.txt",true);
            for (int i = 0; i < 3; i++) {
                fw.write("你好");
                fw.write("\r\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(fw!=null){
                try {
                    fw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }  
            }
        }
    }
}
```

# 八、properties 集合

```
Map接口->Hashtable实现map接口->Properties继承Hashtable
```

## 8.1 properties 的存储和遍历

```java
public class Demo01 {
    public static void main(String[] args) {
        //1.Properties() 创建一个没有默认值的空属性列表。
        Properties prop = new Properties();
        //2.Object---setProperty(String key, String value)与Hashtable方法 put用法相同
        prop.setProperty("张三","123");
        prop.setProperty("李四","456");
        prop.setProperty("王五","788");
        //3.Set<String> stringPropertyNames()
        //把properties中的key取出存到set中
        Set<String> keys = prop.stringPropertyNames();
        for (String key : keys) {
            String value = prop.getProperty(key);
            System.out.println(key+":"+value);
        }
    }
}
```

```
王五:788
张三:123
李四:456
```

## 8.2 properties中的store方法

```java
//properties中的store
public class Demo02 {
    public static void main(String[] args) throws IOException {
        //1.创建对象并存入数据
        Properties prop = new Properties();
        prop.setProperty("张三","123");
        prop.setProperty("李四","456");
        prop.setProperty("王五","788");
        //2.创建字符输出流
        FileWriter fw = new FileWriter("src//c.txt");
        //3.void store(Writer writer, String comments)
        //写到硬盘,comments注释,不能写中文，一般用""
        prop.store(fw,"test properties");
        //4.关闭流
        fw.close();
    }
}
```

```
c.txt文件里的内容:
#test properties
#Tue Mar 03 14:56:54 CST 2020
王五=788
张三=123
李四=456
```

## 8.3 properties中的load方法

```
#test properties
#Tue Mar 03 14:56:54 CST 2020
#c.txt里的内容 分割可以是=,空格,其他符号
王五=788
张三=123
李四=456
```

```java
//读取properties
public class Demo03 {
    public static void main(String[] args) throws IOException {
        //1.创建对象
        Properties prop = new Properties();
        //2.创建输入流对象
        FileReader fr = new FileReader("src\\c.txt");
        //3.读入void load(Reader reader) 以简单的线性格式从输入字符流读取属性列表（关键字和元素对）。
        prop.load(fr);
        //4.遍历读取到的数据
        Set<String> keys = prop.stringPropertyNames();
        for (String key : keys) {
            String value = prop.getProperty(key);
            System.out.println(key+":"+value);
        }
    }
}
```

```
王五:788
张三:123
李四:456
```

# 九、缓冲流

## 9.1 字节缓存流

```
BufferedOutputStream extends FilterOutputStream extends OutputStream
```

```java
//字节缓存输出流
public class Demo01 {
    public static void main(String[] args) throws IOException {
        //1.创建FileOutputStream
        FileOutputStream fos = new FileOutputStream("src\\d.txt");
        //2.BufferedOutputStream(OutputStream out)
        //创建一个新的缓冲输出流，以将数据写入指定的底层输出流。
        BufferedOutputStream bops = new BufferedOutputStream(fos);
        //3.写入缓存区
        bops.write("写入到内部缓存区".getBytes());
        //4.刷新缓存区
        bops.flush();
        //5.关闭缓存区
        bops.close();
        fos.close();
    }
}
```

```
写入到内部缓存区
```

```java
//字节缓存输入流
public class Demo02 {
    public static void main(String[] args) throws IOException {
        //1.创建FileInputStream
        FileInputStream fis = new FileInputStream("src\\d.txt");
        //2.BufferedInputStream(InputStream in)
        //创建一个 BufferedInputStream并保存其参数，输入流 in ，供以后使用。
        BufferedInputStream bops = new BufferedInputStream(fis);
        //3.从缓冲区读入数据
        int len = 0;
        while ((len=bops.read())!=-1){
            System.out.print((char) len);
        }
        //4.关闭缓存区
        bops.close();
        fis.close();
    }
}
```

```
adfdfe
```

## 9.2 字符缓冲流

```java
//字符缓存输入流
public class Demo03 {
    public static void main(String[] args) throws IOException {
        //1.创建FileWriter
        FileWriter fw = new FileWriter("src\\a.txt");
        //2.BufferedWriter(Writer out)
        //创建使用默认大小的输出缓冲区的缓冲字符输出流。
        BufferedWriter bw = new BufferedWriter(fw);
        //3.从缓冲区写入数据
       bw.write("你好！");
       //4.刷新缓冲流
       bw.flush();
       //5.关闭流
       bw.close();
       fw.close();
    }
}
```

```
你好！
```

```java
//字符缓存输出流
public class Demo04 {
    public static void main(String[] args) throws IOException {
        //1.创建FileReader
        FileReader fr = new FileReader("src\\a.txt");
        //2.BufferedReader(Reader in)
        //创建使用默认大小的输入缓冲区的缓冲字符输入流。
        BufferedReader br = new BufferedReader(fr);
        //3.从缓冲区读入数据
        int len=0;
        while ((len=br.read())!=-1){
            System.out.print((char)len);
        }
        //5.关闭流
       br.close();
       fr.close();
    }
}
```

```
你好！
```

```java
//读一行文字。
public class Demo05 {
    public static void main(String[] args) throws IOException {
        //1.创建FileReader
        FileReader fr = new FileReader("src\\a.txt");
        //2.BufferedReader(Reader in)
        //创建使用默认大小的输入缓冲区的缓冲字符输入流。
        BufferedReader br = new BufferedReader(fr);
        //3.String readLine()
        //读一行文字。
        String s = br.readLine();
        System.out.println(s);
        //4.关闭流
       br.close();
       fr.close();
    }
}
```

```
你好！
```

