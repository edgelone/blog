---
title: 精通redis(二)
date: 2020-07-08
sidebar: 'auto'
categories:
 - Tools
 - NoSql
tags:
 - Note
 - NoSql
 - Redis
---

# 精通redis(二)

## 预备

### BIO时期

client会对内核kernel建立一个个的链接,内核会针对fd(文件描述符)建立read,此时socket是阻塞的

jvm: 一个线程的成本,线程栈默认1MB
  - 线程多了,调度成本高 cpu浪费
  - 内存成本

### NIO时期(同步非阻塞)

kernel不再建立block socket,而是只有一个nonblock, socket去建立read,轮询fd,轮询发生在用户空间

依然存在问题,如果有1000fd,代表用户进程轮询调用1000次kernel,成本问题



### NIO(多路复用)

kernel引入select,一次性传入多个fd,返回有数据的fd,减少用户空间的操作,减少用户态内核态的切换

仍然需要自己read和write数据,用户态内核态传递数据成本高

### 伪AIO(epoll)

- create epfd 注册到红黑树
- ctl add  del std
- wait


共享空间 mmap 使用红黑树 链表

1000个fd会直接存入共享空间,内核会read后写入对应内存空间

与zeroCopy不一样,zeroCopy使用sendFile(out,in)

zeroCopy+mmap = kafka


## redis特性

使用了epoll,数据直接写入mmap

内存数据库

redis是单线程单进程处理用户的数据,epoll内存寻址纳秒级别,client请求网卡响应毫秒级,所以并发十万以下不会存在秒级等待的情况

redis的顺序性是每个连接内的

redis默认会有16个数据库(0-15) 相互隔离


## redis-cli

```shell

Usage: redis-cli [OPTIONS] [cmd [arg [arg ...]]]
  -h <hostname>      Server hostname (default: 127.0.0.1).
  -p <port>          Server port (default: 6379).
  -s <socket>        Server socket (overrides hostname and port).
  -a <password>      Password to use when connecting to the server.
                     You can also use the REDISCLI_AUTH environment
                     variable to pass this password more safely
                     (if both are used, this argument takes predecence).
  -u <uri>           Server URI.
  -r <repeat>        Execute specified command N times.
  -i <interval>      When -r is used, waits <interval> seconds per command.
                     It is possible to specify sub-second times like -i 0.1.
  -n <db>            Database number.
  -x                 Read last argument from STDIN.
  -d <delimiter>     Multi-bulk delimiter in for raw formatting (default: \n).
  -c                 Enable cluster mode (follow -ASK and -MOVED redirections).
  --raw              Use raw formatting for replies (default when STDOUT is
                     not a tty).
  --no-raw           Force formatted output even when STDOUT is not a tty.
  --csv              Output in CSV format.
  --stat             Print rolling stats about server: mem, clients, ...
  --latency          Enter a special mode continuously sampling latency.
                     If you use this mode in an interactive session it runs
                     forever displaying real-time stats. Otherwise if --raw or
                     --csv is specified, or if you redirect the output to a non
                     TTY, it samples the latency for 1 second (you can use
                     -i to change the interval), then produces a single output
                     and exits.
  --latency-history  Like --latency but tracking latency changes over time.
                     Default time interval is 15 sec. Change it using -i.
  --latency-dist     Shows latency as a spectrum, requires xterm 256 colors.
                     Default time interval is 1 sec. Change it using -i.
  --lru-test <keys>  Simulate a cache workload with an 80-20 distribution.
  --replica          Simulate a replica showing commands received from the master.
  --rdb <filename>   Transfer an RDB dump from remote server to local file.
  --pipe             Transfer raw Redis protocol from stdin to server.
  --pipe-timeout <n> In --pipe mode, abort with error if after sending all data.
                     no reply is received within <n> seconds.
                     Default timeout: 30. Use 0 to wait forever.
  --bigkeys          Sample Redis keys looking for keys with many elements (complexity).
  --memkeys          Sample Redis keys looking for keys consuming a lot of memory.
  --memkeys-samples <n> Sample Redis keys looking for keys consuming a lot of memory.
                     And define number of key elements to sample
  --hotkeys          Sample Redis keys looking for hot keys.
                     only works when maxmemory-policy is *lfu.
  --scan             List all keys using the SCAN command.
  --pattern <pat>    Useful with --scan to specify a SCAN pattern.
  --intrinsic-latency <sec> Run a test to measure intrinsic system latency.
                     The test will run for the specified amount of seconds.
  --eval <file>      Send an EVAL command using the Lua script at <file>.
  --ldb              Used with --eval enable the Redis Lua debugger.
  --ldb-sync-mode    Like --ldb but uses the synchronous Lua debugger, in
                     this mode the server is blocked and script changes are
                     not rolled back from the server memory.
  --cluster <command> [args...] [opts...]
                     Cluster Manager command and arguments (see below).
  --verbose          Verbose mode.
  --no-auth-warning  Don't show warning message when using password on command
                     line interface.
  --help             Output this help and exit.
  --version          Output version and exit.

Cluster Manager Commands:
  Use --cluster help to list all available cluster manager commands.

Examples:
  cat /etc/passwd | redis-cli -x set mypasswd
  redis-cli get mypasswd
  redis-cli -r 100 lpush mylist x
  redis-cli -r 100 -i 1 info | grep used_memory_human:
  redis-cli --eval myscript.lua key1 key2 , arg1 arg2 arg3
  redis-cli --scan --pattern '*:12345*'

  (Note: when using --eval the comma separates KEYS[] from ARGV[] items)

When no command is given, redis-cli starts in interactive mode.
Type "help" in interactive mode for information on available commands
and settings.
```

进入redis-cli可通过help查看文档

```shell
To get help about Redis commands type:
      "help @<group>" to get a list of commands in <group>
      "help <command>" for help on <command>
      "help <tab>" to get a list of possible help topics
      "quit" to exit

To set redis-cli preferences:
      ":set hints" enable online hints
      ":set nohints" disable online hints
Set your preferences in ~/.redisclirc
```

如help @string

```shell
127.0.0.1:6379> help @string
```

- set nx
  
  不存在则设置,简单的分布式锁应用

## string(Byte数组)

  - 字符串类操作
    - 正反向索引
  - 数值类操作
  - bitmap


  

redis key中会描述value的类型,type可以查看value类型

object encoding会看到对象类型


### 二进制安全

- 字节流
- 字符流

redis只存入了字节流,不对数据做编解码 就是二进制安全

redis的编码不影响字节,如果客户端写入中文,则根据编码方式影响写入redis的字节数据

redis-cli --raw  触发编码集格式化,会通过编码集对value取出进行编码,但是不影响redis内字节数组

===多人多端公用redis情况下  需要约定统一编码方式===

### 自带一部分原子性操作

如 GETSET  mset


## 位图(bitmap)

- 一个字节8个二进制位

- 第一个字节索引是0,第二个是1

- 二进制位索引

```
127.0.0.1:6379> setbit k1 1 1
(integer) 0
127.0.0.1:6379> STRLEN k1
(integer) 1
127.0.0.1:6379> get k1
"@"
127.0.0.1:6379> setbit k1 7 1
(integer) 0
127.0.0.1:6379> get k1
"A"
127.0.0.1:6379> STRLEN k1
(integer) 1
127.0.0.1:6379> setbit k1 9 1
(integer) 0
127.0.0.1:6379> STRLEN k1
(integer) 2
127.0.0.1:6379> get k1
"A@"
```

setbit k1 1 1  实际上是对k1的二进制位索引为1的位置设置1

setbit k1 9 1  是对k1的二进制位索引为9的位置(实际上是第二个字节了)设置1

字节对应到ASCII码

- bit操作
  - bitpos

  ```shell
  127.0.0.1:6379> help bitpos

  BITPOS key bit [start] [end]
  summary: Find first bit set or clear in a string
  since: 2.8.7
  group: string

  ```

  - bitcount
  - bitop 

  ```shell
  127.0.0.1:6379> SETBIT k1 1 1
  (integer) 0
  127.0.0.1:6379> SETBIT k1 7 1
  (integer) 0
  127.0.0.1:6379> get k1
  "A"
  127.0.0.1:6379> SETBIT k2 1 1
  (integer) 0
  127.0.0.1:6379> SETBIT k2 6 1
  (integer) 0
  127.0.0.1:6379> get k2
  "B"
  127.0.0.1:6379> bitop and k3 k1 k2
  (integer) 1
  127.0.0.1:6379> get k3
  "@"
  127.0.0.1:6379> bitop or k4 k1 k2
  (integer) 1
  127.0.0.1:6379> get k4
  "C"
  ```

### 位图应用场景

- 用户系统  统计用户登录天数,且窗口随机(成本复杂度)

```
# boss第二天登录
127.0.0.1:6379> setbit boss 1 1
(integer) 0
# boss第8天登录
127.0.0.1:6379> setbit boss 7 1
(integer) 0
# boss第365天登录
127.0.0.1:6379> setbit boss 364 1
(integer) 0
127.0.0.1:6379> STRLEN boss
(integer) 46
# 查询最后8天登录
127.0.0.1:6379> bitcount boss -2 -1
(integer) 1
```

- 京东618活动,当天登录过的用户就可以发礼物,假如存在2亿用户,需要准备多少礼物

   活跃用户统计(随机窗口) 1号到3号 登录过 视为活跃

  ```
  # 日期为key 用户ID映射到bit位
  setbit 20200618 1 1
  ```

