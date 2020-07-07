---
title: 精通redis(一)
date: 2020-07-07
sidebar: 'auto'
categories:
 - Tools
 - NoSql
tags:
 - Note
 - NoSql
 - Redis
---

# 精通redis(一)

## 源码安装步骤

1. 官网下载redis(5.0.5)
 
     [国内官网](redis.cn)   [国外官网](redis.io)

2. 解压文件 查看目录结构

- 首先阅读README
- 通常Linux软件安装需要make

    make为linux原生命令,make默认会寻找当前目录下的MakeFile,如果某个软件(如nginx)没有MakeFile,那么可能需要先执行config生成MakeFile

3. 安装

- make为在当前目录下生成可执行文件

    执行若报错,可查看提示是否缺少依赖包,CentOS下安装会缺少GCC 
    ```shell
    yum install -y gcc
    ```

    第一次安装失败后  执行
    ```shell
    make distclean
    ```
    进行清理安装失败的临时文件

    继续执行make安装

- make install XX 会将可执行文件安装到指定目录,默认会安装在/usr/local
- 需要在/etc/profile文件中添加redis可执行目录的环境变量
    ```shell
    export REDIS_HOME={之前install的目录}
    export PATH=$PATH:$REDIS_HOME/bin
    ```

    使配置生效
    ```shell
    source /etc/profile
    ```


4. 服务安装

- 以上步骤只是安装应用,将redis作为服务安装到linux需要utils目录下的  install_server脚本
- 执行install_server脚本会启动引导配置
- 默认端口为6379,一个端口就对应一个redis实例,同一个redis程序在一台物理机可启动多个实例,进程 配置 日志及数据目录都是通过端口命名来区分
- 服务安装成功会在/etc/init.d目录生成对应脚本
- install_server脚本执行多次则安装多个服务
- 查看对应服务
  - 查看单个服务
    ```shell
    service redis_6379 status
    ```
  - 查看所有redis服务
    ```shell
    ps aux|grep redis
    ```
