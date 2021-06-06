---
sidebar: true
sidebarDepth: 2
title: File类
---
# 一、File类

## 1.1 File类的静态成员变量

```java
public class Demo01 {
    //四个静态常量
    public static void main(String[] args) {
        //路径分隔符 windows ; linux :
        // static String---pathSeparator
        //static char---pathSeparatorChar
        String pathSeparator = File.pathSeparator;
        char pathSeparatorChar = File.pathSeparatorChar;
        System.out.println(pathSeparator);
        System.out.println(pathSeparatorChar);
        //文件名称分隔符 windows \ linux /
        //static String---separator
        //static char---separatorChar
        String separator = File.separator;
        char separatorChar = File.separatorChar;
        System.out.println(separator);
        System.out.println(separatorChar);
    }
}
```

```
;
;
\
\
```

## 1.2 File类的构造方法

```java
public class Demo02 {
    //file类的构造方法
    public static void main(String[] args) {
        //File(String pathname)
        //通过将给定的路径名字符串转换为抽象路径名来创建新的 File实例。
        File f1 = new File("F:\\a.txt");
        System.out.println(f1);
        //File(String parent, String child)
        //从父路径名字符串和子路径名字符串创建新的 File实例。
        File f2 = new File("F:\\","a.txt");
        System.out.println(f2);
        //File(File parent, String child)
        //从父抽象路径名和子路径名字符串创建新的 File实例。
        File f3 = new File("F:\\");
        File f4 = new File(f3,"a.txt");
        System.out.println(f4);
    }
}
```

```
F:\a.txt
F:\a.txt
F:\a.txt
```

## 1.3 File类获取功能的方法

```java
public class Demo03 {
    // File类获取功能的方法
    public static void main(String[] args) {
        File f1 = new File("D:\\project\\zhoubin"); //绝对路径
        File f2 = new File("a.txt"); //相对路径
        //String getAbsolutePath() 返回此抽象路径名的绝对路径名字符串。
        System.out.println("绝对路径:"+f1.getAbsolutePath());
        System.out.println("绝对路径:"+f2.getAbsolutePath());
        System.out.println("-------------------------------------");
        //String getPath() 将此抽象路径名转换为路径名字符串。
        System.out.println("路径:"+f1.getPath());
        System.out.println("路径:"+f2.getPath());
        System.out.println("toString调用的是getPath方法:"+f1.toString());
        //String getName()返回由此抽象路径名表示的文件或目录的名称。
        System.out.println("---------------------------------------");
        System.out.println("目录名称:"+f1.getName());
        System.out.println("文件名称"+f2.getName());
        //long length() 返回由此抽象路径名表示的文件的大小。
        System.out.println("---------------------------------------");
        File f3 = new File("C:\\Users\\admin\\Pictures\\Camera Roll");
        System.out.println("文件大小为:"+f3.length()+"字节");
    }
}
```

```
绝对路径:D:\project\zhoubin
绝对路径:D:\project\zhoubin\a.txt
-------------------------------------
路径:D:\project\zhoubin
路径:a.txt
toString调用的是getPath方法:D:\project\zhoubin
---------------------------------------
目录名称:zhoubin
文件名称a.txt
---------------------------------------
文件大小为:4096字节
```

## 1.4 File类的判断方法

```java
public class Demo04 {
    //File类的判断方法
    public static void main(String[] args) {
        //boolean exists() 测试此抽象路径名表示的文件或目录是否存在。
        File f1 = new File("C:\\Users\\admin\\Pictures\\Camera Roll\\1.jpg");
        File f2 = new File("C:\\Users\\");
        System.out.println("文件是否存在:"+f1.exists());
        System.out.println("目录是否存在:"+f2.exists());
        System.out.println("-------------------------------------");
        //boolean isDirectory() 测试此抽象路径名表示的文件是否为目录。
        System.out.println("是否为目录:"+f1.isDirectory());
        System.out.println("是否为目录:"+f2.isDirectory());
        System.out.println("--------------------------------------");
        //boolean isFile() 测试此抽象路径名表示的文件是否为普通文件。
        System.out.println("是否是文件:"+f1.isFile());
        System.out.println("是否是文件:"+f2.isFile());
    }
}
```

```
文件是否存在:true
目录是否存在:true
-------------------------------------
是否为目录:false
是否为目录:true
--------------------------------------
是否是文件:true
是否是文件:false
```

## 1.5 File的创建和删除方法

```java
public class Demo05 {
    //File类的创建和删除方法
    public static void main(String[] args) throws IOException {
        //boolean createNewFile() 不存在时才创建
        //文件路径必须存在
        File f1 = new File("E:\\test\\a.txt");
        File f2 = new File("E:\\test\\single");
        File f3 = new File("E:\\test\\aa\\bb\\cc\\dd");
        File f4 = new File("E:\\test\\aa");
        boolean newFile = f1.createNewFile();
        System.out.println("文件是否创建成功:"+newFile);

        //boolean mkdir() 创建由此抽象路径名命名的目录。单层目录
        boolean mkdir = f2.mkdir();
        System.out.println("文件夹是否创建成功:"+mkdir);
        //boolean mkdirs() 创建由此抽象路径名命名的目录，包括任何必需但不存在的父目录。
        boolean mkdirs = f3.mkdirs();
        System.out.println("文件夹是否创建成功:"+mkdirs);
        //boolean delete() 删除由此抽象路径名表示的文件或目录。
        //注意：目录里有内容不会删除
        boolean delete = f4.delete();
        System.out.println("是否删除成功:"+delete);
    }
}
```

```
文件是否创建成功:true
文件夹是否创建成功:true
文件夹是否创建成功:true
是否删除成功:false
```

## 1.6 File类的目录的遍历

```java
public class Demo06 {
    //File类的目录的遍历
    public static void main(String[] args) {
        File file = new File("E:\\test");
        //String[] list() 返回一个字符串数组，命名由此抽象路径名表示的目录中的文件和目录。
        System.out.println("list遍历文件和目录");
        String[] list = file.list();
        for (String s : list) {
            System.out.println(s);
        }
        System.out.println("list遍历文件和目录");
        //File[] listFiles() 返回一个抽象路径名数组，表示由该抽象路径名表示的目录中的文件。
        File[] files = file.listFiles();
        for (File file1 : files) {
            System.out.println(file1);
        }
    }
}
```

```
list遍历文件和目录
a.txt
aa
single
list遍历文件和目录
E:\test\a.txt
E:\test\aa
E:\test\single
```

# 二、递归

## 2.1 递归求1-n的和

```java
package com.company.File;

//递归求1-n的和
public class Demo07 {
    public static void main(String[] args) {
        int s = sum(100);
        System.out.println(s);
    }
    public static int sum(int n){
        if(n==1){
            return 1;
        }
        return n + sum(n-1);
    }
}
```

```
5050
```

## 2.2 递归求阶乘

```java
//递归求阶乘
public class Demo08 {
    public static void main(String[] args) {
        int value = getValue(4);
        System.out.println(value);

    }
    public static int getValue(int n){
        if(n==1){
            return 1;
        }
        return n*getValue(n-1);
    }
}
```

```
24
```

## 2.3 递归打印多级目录

```java
//递归打印多级目录
public class Demo09 {
    public static void main(String[] args) {
        File file = new File("D:\\Program Files\\eclipse");
        getAllFille(file);
    }
    public static void getAllFille(File dir){
        System.out.println(dir);
        File[] files = dir.listFiles();
        for (File f : files) {
            if(f.isDirectory()){
                getAllFille(f);
            }else {
                System.out.println(f);
            }
        }
    }
}
```

```
D:\Program Files\eclipse
D:\Program Files\eclipse\.eclipseproduct
D:\Program Files\eclipse\artifacts.xml
D:\Program Files\eclipse\configuration
D:\Program Files\eclipse\configuration\.settings
D:\Program Files\eclipse\configuration\.settings\org.eclipse.core.net.prefs
D:\Program Files\eclipse\configuration\.settings\org.eclipse.epp.mpc.ui.prefs
D:\Program Files\eclipse\configuration\.settings\org.eclipse.tips.ide.prefs
D:\Program Files\eclipse\configuration\.settings\org.eclipse.ui.ide.prefs
......
```

# 三、综合案例

## 3.1 文件搜索

```java
//递归.java结尾的文件
public class Demo10 {
    public static void main(String[] args) {
        File file = new File("E:\\test");
        getAllFille(file);
    }
    public static void getAllFille(File dir){
        File[] files = dir.listFiles();
        for (File f : files) {
            if(f.isDirectory()){
                getAllFille(f);
            }else {
                //转换字符串->转为小写->判断是否是.java结尾
                if(f.getPath().toLowerCase().endsWith(".java")){
                    System.out.println(f);
                }
            }
        }
    }
}
```

## 3.2文件过滤器的使用

```java
public class Demo11 {
    public static void main(String[] args) {
        //File[] listFiles(FilenameFilter filter)
        //返回一个抽象路径名数组，表示由此抽象路径名表示的满足指定过滤器的目录中的文件和目录。
        File file = new File("E:\\test");
        getAllFile(file);
    }

    public static void getAllFile(File dir){
        File[] files = dir.listFiles(new fileFilter());
        for (File f : files) {
            if(f.isDirectory()){
                getAllFile(f);
            }else {
                System.out.println(f);
            }
        }
    }
}

//文件过滤器
class fileFilter implements FileFilter {

    @Override
    public boolean accept(File pathname) {
        //如果是文件返回true
        if(pathname.isDirectory()){
            return true;
        }
        //如果是.java结尾返回true
        return pathname.getPath().toLowerCase().endsWith(".java");
    }
}
```

## 3.3 使用匿名内部内简化

```java
public class Demo12 {
    public static void main(String[] args) {
        //File[] listFiles(FilenameFilter filter)
        //返回一个抽象路径名数组，表示由此抽象路径名表示的满足指定过滤器的目录中的文件和目录。
        File file = new File("E:\\test");
        getAllFile(file);
    }

    public static void getAllFile(File dir){
        File[] files = dir.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                //如果是文件返回true
                if(pathname.isDirectory()){
                    return true;
                }
                //如果是.java结尾返回true
                return pathname.getPath().toLowerCase().endsWith(".java");
            }
        });
        for (File f : files) {
            if(f.isDirectory()){
                getAllFile(f);
            }else {
                System.out.println(f);
            }
        }
    }
}
```

```
E:\test\aa\bb\aa.java
E:\test\c.JAVA
E:\test\single\bb.java
```

```java
public class Demo12 {
    public static void main(String[] args) {
        //File[] listFiles(FilenameFilter filter)
        // 返回一个抽象路径名数组，表示由此抽象路径名表示的满足指定过滤器的目录中的文件和目录。
        File file = new File("E:\\test");
        getAllFile(file);
    }

    public static void getAllFile(File dir){
        File[] files = dir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                //判断文件夹加名字是否是否是文件夹||文件是否是.java结尾
                return new File(dir,name).isDirectory()||name.toLowerCase().endsWith(".java");
            }
        });
        for (File f : files) {
            if(f.isDirectory()){
                getAllFile(f);
            }else {
                System.out.println(f);
            }
        }
    }
}
```

```
E:\test\aa\bb\aa.java
E:\test\c.JAVA
E:\test\single\bb.java
```

# 