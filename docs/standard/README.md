---
sidebar: true
sidebarDepth: 2
title: HTML规范
date: 2017-12-28
categories:
  - front
tags:
  - html
---

## HTML 规范

### 文件模板

#### HTML5 标准模版

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>HTML5标准模版</title>
  </head>
  <body></body>
</html>
```

#### 移动端

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
    />
    <meta name="format-detection" content="telephone=no" />
    <title>移动端HTML模版</title>

    <!-- S DNS预解析 -->
    <link rel="dns-prefetch" href="" />
    <!-- E DNS预解析 -->

    <!-- S 线上样式页面片，开发请直接取消注释引用 -->
    <!-- #include virtual="" -->
    <!-- E 线上样式页面片 -->

    <!-- S 本地调试，根据开发模式选择调试方式，请开发删除 -->
    <link rel="stylesheet" href="css/index.css" />
    <!-- /本地调试方式 -->

    <link rel="stylesheet" href="http://srcPath/index.css" />
    <!-- /开发机调试方式 -->
    <!-- E 本地调试 -->
  </head>
  <body></body>
</html>
```

#### PC 端

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="keywords" content="your keywords" />
    <meta name="description" content="your description" />
    <meta name="author" content="author,email address" />
    <meta name="robots" content="index,follow" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <meta name="renderer" content="ie-stand" />
    <title>PC端HTML模版</title>

    <!-- S DNS预解析 -->
    <link rel="dns-prefetch" href="" />
    <!-- E DNS预解析 -->

    <!-- S 线上样式页面片，开发请直接取消注释引用 -->
    <!-- #include virtual="" -->
    <!-- E 线上样式页面片 -->

    <!-- S 本地调试，根据开发模式选择调试方式，请开发删除 -->
    <link rel="stylesheet" href="css/index.css" />
    <!-- /本地调试方式 -->

    <link rel="stylesheet" href="http://srcPath/index.css" />
    <!-- /开发机调试方式 -->
    <!-- E 本地调试 -->
  </head>
  <body></body>
</html>
```
