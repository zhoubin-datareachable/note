---
sidebar: true
sidebarDepth: 2
title: mongodb
---

## 数据库操作

查看版本号

```sql
mongod --version
```

连接数据库

```sql
mongo
```

退出

```sql
exit
```

查看数据库列表

```sql
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

创建数据库(use命名是切换数据库，如果不存在则新建数据库)

```sql
> use users
```

查看当前操作的数据库

```
> db
users
```

删除数据库

```
> use users
switched to db users
> db.dropDatabase()
{ "dropped" : "users", "ok" : 1 }
```

## 集合操作

```
> db.createCollection('test')
{ "ok" : 1 }
```

查看已有集合

```
> show collections
test
```

自动创建集合,当你插入一些数据时会自动创建集合

```
> db.students.insertOne({"name":"jack"})
> show collections
students
```

删除集合

```
# 创建aa集合
> db.createCollection('aa')
{ "ok" : 1 }
# 删除aa集合
> db.aa.drop()
true
```

## 文档操作

相当于对表里的数据操作

### 插入文档(增)

向文档插入一个或多个文档

```
db.stus.insert({name:'孙悟空',age:28,gender:"男"});
```

```
db.stus.insert([
    {name:'张三',age:28,gender:"男"},
    {name:'李四',age:18,gender:"男"}
])
```

插入一条数据文档

```
db.stus.insertOne({name:'孙悟空',age:28,gender:"男"});
```

插入多条数据

```
db.stus.insertMany(
    {name:'张三',age:28,gender:"男"},
    {name:'李四',age:18,gender:"男"}
)
```

### 修改文档

修改孙悟空的年龄为500

update默认修改第一个符合条件的文档

```
db.stus.update({name:'孙悟空'},{$set:{age:'500'}})
```

```
db.stus.updateOne({name:'孙悟空'},{$set:{age:'500'}})
```

修改多个符合条件的文档

```
db.stus.updateMany({name:'孙悟空'},{$set:{age:'500'}}) 
```

```
db.stus.update({name:'孙悟空'},{$set:{age:'500'}},{multi:true})
```

删除孙悟空的年龄属性

```
db.stus.update({name:"孙悟空"},{$unset:{age:"66666"}})
```

### 删除文档

删除姓名为张三的记录

remove删除符合条件所有记录

```
db.stus.remove({name:'张三'})
```

只删除第一个

```
db.stus.remove({name:'张三'},true)
```

```
db.stus.deleteOne({name:'张三'})
```

删除多个

```
db.stus.deleteMany({name:'张三'})
```

清空集合

```
db.stus.remove({})
```

### 查询文档

插寻所有文档

```
db.stus.find()
```

查找名字为张三的文档

```
db.stus.find({name:'张三'})
```

查找名字为张三年龄18岁的文档

```
db.stus.find({name:'张三',age:'18'})
```

查找第一个符合条件的文档

```
db.stus.findOne({name:'张三'})
```

查看文档记录数

```
db.stus.find().count()
```

查询年龄小于20岁的

```
db.stus.find({age:{$lt:20}})
```

查询年龄小于等于18岁的

```
db.stus.find({age:{$lte:18}})
```

查询年龄大于20岁的

```
db.stus.find({age:{$gt:20}})
```

查询年龄大于等于18岁的

```
db.stus.find({age:{$gte:18}})
```

查询年龄不等于20岁的

```
db.stus.find({age:{$ne:20}})
```

### 条件查询

AND 条件

MongoDB 的 find() 方法可以传入多个键(key)，每个键(key)以逗号隔开。

```
db.col.find({key1:value1, key2:value2})
```

查找名字为张三年龄18岁的文档

```
db.stus.find({name:'张三',age:'18'})
```

OR 条件

OR 条件语句使用了关键字 $or

```
db.col.find(
   {
      $or: [
          {key1: value1}, {key2:value2}
      ]
   }
)
```

查找名字为张三或年龄20岁的文档

```
db.stus.find({$or:[{name:'张三'},{age:20}]})
```

AND 和 OR 联合使用

```
db.col.find(
   {
      key3:value3,
      $or: [
          {key1: value1}, {key2:value2}
      ]
   }
)
```

## Limit与Skip方法

limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。

查询age等于18岁的一条记录

```
db.stus.find({age:18}).limit(1)
```

我们除了可以使用limit()方法来读取指定数量的数据外，还可以使用skip()方法来跳过指定数量的数据。

查询age等于18岁的一条记录，跳过第1条

```
db.stus.find({age:18}).limit(1).skip(1)
```

## 排序

sort() 方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而 -1 是用于降序排列。

```
db.COLLECTION_NAME.find().sort({KEY:1})
```

查询所有记录按id升序排序

```
db.stus.find().sort({_id:1})
```

## 投影

第二参数来设置投影，id默认显示。0不显示，1显示

查询所有只显示姓名

```
db.stus.find({},{name:1,_id:0})
```