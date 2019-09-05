---
layout: post
title: Socket网络编程之基础篇
date: 2019-08-13
categories: linux socket
---

> Linux系统的一大特点是它的网络编程能力十分强大, 学习它, 让我们真正体会网络的魅力!

## 一. 客户机/服务器模型

网络应用程序一般是以 c/s 模型的方式工作的,因特网便是 c/s 模型的一个典型例子,在这种工作方式中,一个服务器通常事先启动,并在一个熟知端口帧听对服务器的请求,如ftp服务器,web服务器等.当客户机应用程序需要某种服务时,需向提供这个服务的服务器发出请求,服务器收到请求后,向客户机发出相应请求服务.这样客户机应用程序和服务器程序之间就建立了通信连接,此后便可以进行数据通信,通信任务完成后,需要关闭它们之间的通信连接.

￼![C_S_chart_flow](https://img-blog.csdnimg.cn/2018120111460362.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2OTU4Mjg1,size_16,color_FFFFFF,t_70)

## 二. 网络套接字(socket)介绍

在网路中要全局的标示一个参与通信的进程,需要采用三元组:　***协议，主机ip地址,端口号***.
要描述两个应用进程之间的端到端的通信则需要一个五元组: ***协议,信源机ip地址,信源应用进程端口, 信宿机ip地址,信宿应用进程端口***.
那么从程序设计的角度如何实现两个应用进程的通信连接的建立,并如何实现两个进程指佳酿数据传输呢?人们引入套接字(Socket)的概念.

￼![Socket_flow](https://img-blog.csdnimg.cn/20181201114726459.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2OTU4Mjg1,size_16,color_FFFFFF,t_70)

   - 套接字实现了对网络和传输层协议的封装
   - 套接字可以看做是处于不同主机之间的两个进程的通信连接端点
   - 在实现两个进程间的通信时, 首先应用进程各自创建自己的套接字,然后通过套接字建立双方的通信链路,进而利用各自的套接字进行数据的发送个接收


socket这个词可以表示很多概念：

+ 在TCP/IP协议中，“IP地址+TCP或UDP端口号”唯一标识网络通讯中的一个进程，“IP地址+端口号”就称为socket。

+ 在TCP协议中，建立连接的两个进程各自有一个socket来标识，那么这两个socket组成的socket pair就唯一标识一个连接。socket本身有“插座”的意思，因此用来`描述网络连接的一对一关系`。

+ TCP/IP协议最早在BSD UNIX上实现，为TCP/IP协议设计的应用层编程接口称为socket API

Socket进一步介绍:
	`socket是使用标准unix文件描述符(file descriptor)和其他程序通讯的方式`. Unix中的一切都是文件,接触过Unix/Linux,就一定会听过这句话. 实际上, unix程序在执行任何形式的I/O时,程序都是在读或者写一个文件描述符. 一个文件描述符只是一个跟打开的文件相关联的整数, 这个文件可能是一个网络连接, FIFO, 管道, 终端, 文件或者什么其他东西. 所以你要和网络上的其他程序通信时,你就要用到文件描述符, 那怎么得到网络通信的文件描述符呢?
	利用系统调用socket(),它会返回套接字描述符(socket descriptor), 然后就可以用它来send(), recv() ,发送接收数据.



## 三. 套接字编程基础

> Tcp/Ip 的核心内容被封装在操作系统中,网络应用程序要使用 Tcp/Ip 来实现自己的功能,需要通过操作系统提供给用户的编程接口来实现. 套接字就是 Tcp/Ip 网络编程接口的集合,他是应用程序 Tcp/Ip 协议族通信的中间软件抽象层.

### 1. socket

```c
// socket - create an endpoint for communication

#include <sys/types.h>          
#include <sys/socket.h>

int socket(int domain, int type,int protocol)

// DESCRIPTION
//       socket() creates an endpoint for communication and returns a file descriptor that 
//       refers to that endpoint.  The file descriptor returned by a successful call will 
//       be the lowest-numbered file descrip‐tor not currently open for the process.

```
**domain**: 说明我们网络程序所在的主机采用的通讯协族(AF_UNIX 和 AF_INET 等). AF_UNIX 只能够用于单一的 Unix 系统进程间通信,而 AF_INET 是针对 Internet 的,因而可以允许在远程主机之间通信(当我们 man socket 时发现 domain 可选项是 PF_*而不是 AF_*,因为glibc 是 posix 的实现 所以用 PF 代替了 AF,不过我们都可以使用的).

**type**: 指网络程序所采用的通讯协议(SOCK_STREAM,SOCK_DGRAM 等) 

+ `SOCK_STREAM` (流套接字) 表明我们用的是 TCP 协议,这样会提供按顺序的,可靠,双向,面向连接的比特流. 

+ `SOCK_DGRAM` (数据包套接字) 表明我们用的是 UDP 协议,这样只会提供定长的,不可靠,无连接的通信.

+ `SOCK_RAW` (原始套接字) 表明这是个原始套接字, 相对与上面两种类型, 提供了更多的功能, 实现ping/traceruoute等均需要创建此类套接字

	| 网络层次 |  Operation | SOCK_STREAM / SOCK_DGRAM | SOCK_ROW|
	| ------------- | ----------- | -------------- | ---------------------- |
	| 应用层(Application Layer) | telnet, ftp, http, dns... |	√  |  √  |
	| 传输层(Transport Layer) | TCP, UDP | √(数据部分) | √  |
	| 网络层(Internet Layer) | IP  |  ×	|	√  |
	| 数据链路层(Data link) | MAC | 	×	| 	√  |

	链路层的原始套接字可以直接用于接收和发送链路层的MAC帧，在发送时需要由调用者*自行构造和封装MAC首部*。
	网络层的原始套接字可以直接用于接收和发送IP层的报文数据，在发送时需要*自行构造IP报文头*
	
	一般的套接字只能操作传输层的数据部分的内容, 我们只能将发送的数据(buffer)传递给系统, 系统帮我们给数据加上tcp/udp头部,再加上ip头部, 再给发出去; 而使用原始套接字 需要我们自己构造每个部分, 系统只是将它发出去, 想一想, 这是不是多了好多乐趣呢 \^_\^ 
	
	注: 原始套接字需要root权限, 针对具体情况使用相应套接字类型, 推荐阅读书籍 [UNIX网络编程 卷1：套接字联网API](https://github.com/D-lyw/ShareBook/tree/master/Network)
	
**protocol** :由于我们指定了 type,所以这个地方我们一般只要用 0 来代替就可以了,  socket 为网络通讯做基本的准备. 如果我们使用的是原始套接字,这个时候系统是不知道你要发送什么类型数据结构的数据, 这时候就需要指定协议类型, 如 IPPROTO_ICMP, IPPROTO_TCP, IPPROTO_UDP等.

**Return Value** : 成功时返回文件描述符,失败时返回-1,看 全局变量 errno 可知道出错的详细情况

```c
// 常用方式 下同
if((sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1){
	fprintf(stderr,"Create Socket Error, %s
", perror(errno);
	exit(errno);
}
```

### 2. bind

```c
// bind - bind a name to a socket
#include <sys/types.h>
#include <sys/socket.h>

int bind(int sockfd, struct sockaddr *my_addr, int addrlen)
```
**sockfd**: 是由 socket 调用返回的文件描述符.

**addrlen**: 是 sockaddr 结构的长度.

**my_addr**: 是一个指向结构体 sockaddr 的指针,它`保存你的地址(即端口和 IP 地址) 信息`。 在<linux/socket.h>中有 sockaddr 的定义
```c
struct sockaddr{
        unisgned short as_family;
        char sa_data[14];
};
   ```
不过由于系统的兼容性,我们一般不用这个头文件,而使用另外一个结构(struct sockaddr_in) 来代替.在<linux/in.h>中有 sockaddr_in 的定义

```c
struct sockaddr_in{
        unsigned short sin_family;
        unsigned short int sin_port;
        struct in_addr sin_addr;
        unsigned char sin_zero[8];
}
```

`注: 由于sockaddr数据结构与sockaddr_in数据结构的大小是相同的,指向sockaddr_in的指针可以通过强制类型转换,转换成指向sockaddr结构的指针`

我们主要使用 Internet 所以 sin_family 一般为 AF_INET,

sin_addr.s_addr 设置为 INADDR_ANY 表示自动填上所运行的机器的ip地址,

sin_port 是我们要监听的端口号, 赋值0则告诉系统自动选择端口

sin_zero[8]是用来填充的

￼![在这里插入图片描述](https://img-blog.csdnimg.cn/20181201114819149.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2OTU4Mjg1,size_16,color_FFFFFF,t_70)

bind 将本地的端口同 socket 返回的文件描述符捆绑在一起.成功是返回 0,失败的情况和socket 一样
简单例子:

```c
#include <string.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#define _INT_PORT 9257

int main(void)
{
	int sockfd;							// 定义套接字
	struct sockaddr_in my_addr;					// 定义存储本地地址信息的结构体
	sockfd = socket(PF_INET, SOCK_STREAM, 0);	               	// 创建套接字
	
	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(_INT_PORT);
	my_addr.sin_addr.s_addr = inet_addr("132.241.5.10");
	
	bzero(&(my_addr.sin_zero), sizeof(my_addr.sin_zero));
	if(bind(sockfd, (struct sockaddr *)&my_addr,sizeof(struct sockaddr_in)) == -1){	// 绑定套接字
		fprintf(stderr, "Bind socket error, %s ", perror(errno));
		exit(errno);
	}
}
```

*这个过程就是指定程序绑定到系统的某一个端口, 试想一下, 这个`bind`过程 是不是必须的呢?*

### 3. listen

```c
// listen - listen for connections on a socket
#include <sys/types.h>          
#include <sys/socket.h>

int listen(int sockfd, int backlog);
```
sockfd:是 bind 后的文件描述符.

backlog:设置请求排队的最大长度.当有多个客户端程序和服务端相连时, 使用这个表示可以连接的最大长度. 

listen 函数将 bind 的文件描述符变为监听套接字.返回的情况和 bind 一样.在发生错误的时候返回-1,并设置全局错误变量 errno

以上的过程就是, 创建一个套接字, 绑定本地的地址信息, 然后在 Listen, 监听这个端口 , 等待别人来连接, 而我们用下面的accept来接收别人的连接

### 4. accept

```c
// 在发生错误的时候返回-1,并设置全局错误变量 errno
#include <sys/types.h>          
#include <sys/socket.h>

int accept(int sockfd, struct sockaddr *addr,int *addrlen)
```

sockfd:是 listen 后的文件描述符.

addr,addrlen 是用来给客户端的程序填写的,服务器端只要传递指针就可以了.
bind,listen 和 accept 是服务器端用的函数,
accept 调用时,服务器端的程序会一直阻塞到有一个客户程序发出了连接. accept 成功时返回最后的服务器端的文件描述符,这个时候服务器端可以通过该描述符进行send() 和 recv()操作. 失败时返回-1

具体代码感受一下:

```c
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#define SET_PORT 3490
int main(void)
{
	int sockfd, new_fd;
	struct sockaddr_in my_addr;
	struct sockaddr_in their_addr;
	int sin_size;
	
	sockfd = socket(PF_INET, SOCK_STREAM, 0);
	
	my_addr.sin_family = AF_INET;
	my_addr.sin_port = htons(_INT_PORT);
	my_addr.sin_addr.s_addr = INADDR_ANY;
	
	bzero(&(my_addr.sin_zero),sizeof(my_addr.sin_zero));
	bind(sockfd, (struct sockaddr *)&my_addr,sizeof(struct sockaddr));  		// 绑定套接字
	
	listen(sockfd, 10);								// 监听套接字
	
	sin_size = sizeof(struct sockaddr_in);
	new_fd = accept(sockfd, &their_addr, &sin_size);				// 接收套接字
}
```

### 5. connect

```c
// connect - initiate a connection on a socket
#include <sys/types.h>          
#include <sys/socket.h>

int connect(int sockfd, struct sockaddr * serv_addr,int addrlen)
```
sockfd:socket 返回的文件描述符.

serv_addr:储存了服务器端的地址信息(IP地址, 端口号)的数据结构.其中 sin_add 是服务端的地址

addrlen:serv_addr 的长度 `sizeof(struct sockaddr)`;

connect 函数是客户端用来同服务端连接的.成功时返回 0,sockfd 是同服务端通讯的文件描述符 失败时返回-1.

*我们想一想,我们连接服务器,是不是只需要在套接字中提供服务器端的ip地址和端口号即可, 不需要指定本地的ip地址和端口号, 也即这个时候使用bind()来绑定客户端的地址信息,这个操作不是必须的, 系统会自动获取本地ip, 自动为该套接字分配端口号*

### 6. close & shutdown
如果你已经整天都在发送 (send()) 和接收 (recv()) 数据了,现在你准备关 闭你的套接字描述符了。

这很简单,你可以使用一般的 Unix 文件描述符 的 close() 函数:

close(sockfd);它将防止套接字上更多的数据的读写。任何在另一端读写套接字的企图都将返回错误信息。

如果你想在如何关闭套接字上有多一点的控制,你可以使用函数 shutdown()。

它允许你将一定方向上的通讯或者双向的通讯(就象 close()一 样)关闭,你可以使用:
int shutdown(int sockfd, int how);
sockfd 是你想要关闭的套接字文件描述复。how 的值是下面的其中之 一:
0 - 不允许接受
1 - 不允许发送
2 - 不允许发送和接受(和 close() 一样)
shutdown() 成功时返回 0,失败时返回 -1(同时设置 errno。) 如果在无连接的数据报套接字中使用 shutdown(),那么只不过是让 send() 和 recv() 不能使用(记住你在数据报套接字中使用了 connect 后 是可以使用它们的)



## 四．相关常用函数


### 1. 网络字节顺序(Network Byte Order)

内存中的多字节数据相对于内存地址有大端和小端之分，磁盘文件中的多字节数据相对于文件中的偏移地址也
    有大端小端之分。网络数据流同样有大端小端之分，那么如何定义网络数据流的地址呢？发送主机通常将发送
    缓冲区中的数据按内存地址从低到高的顺序发出，接收主机把从网络上接到的字节依次保存在接收缓冲区中，
    也是按内存地址从低到高的顺序保存，因此，网络数据流的地址这样规定：先发出的数据是低地址，后发出
    的数据是高地址。

Tcp/Ip协议规定, 网络传输字节顺序为高位优先,为了使网络程序具有可移植性, 需要对程序将本地字节顺序转换为网络字节顺序, 可以调用库函数做网络字节序和主机字节序(Host Byte Order)的转换, 常用函数如下:
```c
    #include<arpa/inet.h>

    uint32_t htonl(uint32_l hostlong);		// "Host to Network Long"
    uint16_t htons(uint16_t hostshort);		// "Host to Network Short"
    uint32_t ntohl(uint32_t netlong);		// "Network to Host Long"
    uint16_t ntohs(uint16_t netshort);		// "Network to Host Short"
```

+ 问: 如果我的主机使用的就是网络字节顺序, 为什么还要调用 htonl() 转换 IP 地址呢？
	 因为将你的程序移植到别人的电脑上可能会报错(`具备可移植性`). 记住:在你将数据放到网络上的时候,确信它们是网络字节顺序的!
+ 问: 为什么在数据结构 struct sockaddr_in 中, sin_addr 和 sin_port 需要转换为网络字节顺序,而 sin_family 需不需要呢?
	答案是:sin_addr 和 sin_port分别封装在包的 IP 和 UDP 层。因此,它们必须要 是网络字节顺序。但是 sin_family域只是被内核 (kernel) 使用来决定在数 据结构中包含什么类型的地址,所以它必须是本机字节顺序。同时, sin_family 没有发送到网络上,它们可以是本机字节顺序。

### 2. Ip地址处理转换函数

我们有很多的函数来方便地操作 IP 地址。没有必要用手工计算它们,也没有必要用"<<"操作来储存成长整字型．
假如我们现在有一个sockaddr_Ser 的地址结构体, 要将ip地址"103.21.187.5"保存到该结构体中, 我们可以用
```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

sockaddr_Ser.sin_addr.s_addr = inet_addr("103.21.187.5");
```
注意, inet_addr()返回的地址已经是网络字节格式,所以你无需再调用 函数 htonl()。

那如何讲一个长整型的ip地址转为点分十进制呢?
```c
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

printf("%s", inet_ntoa(sockaddr_Clinet.sin_addr));
```
`inet_ntoa()`	含义 network to ascii .
需要注意的是 inet_ntoa()将结构体 in-addr 作为一 个参数,不是长整形
同样需要注意的是它返回的是一个指向一个字符的指针。它是一个由 inet_ntoa()控制的静态的固定的指针,所以每次调用 inet_ntoa(),它就将覆盖上次调用时所得的IP 地址

### 3. gethostbyname()
通过给定的名字, 找到相应的主机信息, 如给定域名,查找返回ip地址, 进行bind, connect等操作.
```c
#include <netdb.h>

struct hostent *gethostbyname(const char *name);
// 很明白的是,它返回一个指向 struct hostent 的指针。这个数据结构 是这样的:

struct hostent
{
	char *h_name;		// 地址的正式名称
	char **h_aliases;	// 空字节-地址的预备名称的指针
	int h_addrtype;		// 地址类型; 通常是 AF_INET
	int h_length;		// 地址的比特长度
	char **h_addr_list;	// 零字节-主机网络地址指针。网络字节顺序
};
#define h_addr h_addr_list[0]
```

gethostbyname() 成功时返回一个指向结构体 hostent 的指针,或者 是个空 (NULL)指 针 。 ( 但 是 和 以 前 不 同 , 不 设 置 errno , h_errno 设 置 错 误 信 息 。)

参照代码例子, 加快理解:
```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <netdb.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>

int main(int argc, char* argv[]){
	struct hostent* ht;
	char** pptr;
	int type;
	if(argc != 2){
		fprintf(stderr, "usage: ./filename [address] ");
		exit(EXIT_FAILURE);
	}
	if(!(ht = gethostbyname(argv[1]))){
		herror("main gethostbyname error");
		exit(EXIT_FAILURE);
	}
	//打印所有信息
	printf("Host name is: %s ", ht->h_name);
	//打印所有的主机地址
	for(pptr=ht->h_aliases; (*pptr); ++pptr)
		printf("alias of host: %s ", *pptr);
	printf("Host addrtype is: %d ", type = ht->h_addrtype);
	printf("Host length is: %d ", ht->h_length);
	if(type==AF_INET || type==AF_INET6){
		char ip[32];
		for(pptr = ht->h_addr_list; (*pptr); ++pptr){
			inet_ntop(type, *pptr, ip, sizeof ip);
			printf("address: %s ", ip);
		}
	}
	return 0;
}
```

## 五. 消息发送与接收

前面我们已经讲了如何创建,绑定, 监听, 连接套接字的操作, 可能等不及的同学已经开始想, 那怎么通过套接字发送数据呢. 这一小节我们就来讲消息发送接收的函数调用.

在这之前,附上一张简单但很重要的流程图, 纵使这系列后面的内容说的再天花乱坠, 实质上也是这图上的流程. 特别是刚起步的同学, 记住这张图, 就把握了整体的流程脉络, 不至于代码无从敲起.

￼![socket通信CS模式示意图](https://img-blog.csdnimg.cn/20181202105310984.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2OTU4Mjg1,size_16,color_FFFFFF,t_70)

### 1. send() 和 recv() 函数

这两个函数用于流式套接字或者数据报套接字的通讯。

```c
#include <sys/socket.h>

// send — send a message on a socket
ssize_t send(int socket, const void *buffer, size_t length, int flags);

// recv — receive a message from a connected socket
ssize_t recv(int socket, void *buffer, size_t length, int flags);
```
**socket** 是你想发送数据的套接字描述符(或者是调用 socket() 或者是 accept() 返回的 )
**buffer** 是指向你想发送的数据的指针。 
**length**  是数据的长度。 
把 flags 设置为 0 就可以了, 刚开始用不上(详细的资料请看 send() 的 man page)

send() 返回`实际发送的数据的字节数`--它可能小于你要求发送的数 目!
注意,有时候你告诉它要发送一堆数据可是它不能处理成功。它只是 发送它可能发送的数据,然后希望你能够发送其它的数据。记住,如果 send() 返回的数据和 len 不匹配,你就应该发送其它的数据。
最后要说得就是,它在错误的时候返回-1,并设置 errno。

recv() 函数很类似
**socket** 是要读的套接字描述符。
**buffer** 是要读的信息的缓冲。
**length** 是缓 冲的最大长度。
**flags** 可以设置为 0。(请参考 recv() 的 man page) 

recv() 返回`实际读入缓冲的数据的字节数`。或者在错误的时候返回-1, 同时设置 errno。

### 2. sendto() 和 recvfrom() 函数

这两个函数用于 无连接数据报套接字

```c
#include <sys/socket.h>

ssize_t sendto(int socket, const void *buffer, size_t length, int flags, 
		   const struct sockaddr *dest_addr,socklen_t dest_len);

ssize_t recvfrom(int socket, void *restrict buffer, size_t length,
           int flags, struct sockaddr *restrict address,
           socklen_t *restrict address_len);

```
可以看到,sendto() 函数除了另外的两个信息外,其余的和函数 send() 是一样 的。 
**dest_addr** 是个指向数据结构 struct sockaddr 的指针,它包含了`目的地的 IP 地址和端口信息`。
**dest_len** 可以简单地设置为 sizeof(struct sockaddr)。
和函数 send() 类似, sendto() 返回实际发送的字节数(它也可能小于 你想要发送的字节数!),或者在错误的时候返回 -1。

recvfrom() 函数也是类似, 除了两个增加的参数外,这个函数和 recv() 也是一样的。
**address** 是一个指向局部数据结构 struct sockaddr 的指针,它的内容是`请求连接方的 IP 地址和端口信息`。
**address_len** 是个 int 型的局部指针,它的初始值为 sizeof(struct sockaddr)。
函数调用返回后, address_len 保存着实际储存在 address 中的地址的长度。
recvfrom() 返回收到的字节长度,或者在发生错误后返回 -1。

问: 为什么udp连接的套接字函数(sendto, recvfrom) 相比与tcp的通信的套接字,要提供更多的参数呢?
答: 这是因为tcp是面向连接的协议,在双方通信之前,是已经建立好了连接, 直接send数据, 便可发到连接另一端的消息接收方;
而udp是无连接的协议, 通信之间没有建立连接, 所以在发送消息时, 必须指明消息接收方的地址信息(IP地址及端口号), 才能将消息发送给对方.

注: 如果你用 connect() 连接一个数据报套接字,你可以简单的调 用 send() 和recv() 来满足你的要求。这个时候依然是数据报套接字,依 然使用 UDP,系统套接字接口会为你自动加上了目标和源的信息

原来是不想贴代码的, 但怕有些人看完上面的内容,急不可耐的向感受一下, 还是给附上一个最简单的demo:
更多代码移步我github: https://github.com/D-lyw/Socket_C_linux 查看相关代码: [tcp, udp, ping, tracert, dns, ftp.....](https://github.com/D-lyw/Socket_C_linux)

tcp_server.c
```c
/*
 * @Author: D-lyw 
 * @Date: 2018-10-25 00:48:44 
 * @Last Modified by: D-lyw
 * @Last Modified time: 2018-11-16 12:29:37
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <errno.h>

#define SERVADDR_PORT 8800

const char *LOCALIP = "127.0.0.1";

int main(int argc, char const *argv[])
{
    // 定义变量存储生成或接收的套接字描述符
    int listenfd, recvfd;
    // 定义一个数据结构用来存储套接字的协议,ip,端口等地址结构信息
    struct sockaddr_in servaddr, clientaddr;
    // 定义接收的套接字的数据结构的大小
    unsigned int cliaddr_len, recvLen;
    char recvBuf[1024];

    //创建用于帧听的套接字
    listenfd = socket(AF_INET, SOCK_STREAM, 0);

    // 给套接字数据结构赋值,指定ip地址和端口号
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(SERVADDR_PORT);
    servaddr.sin_addr.s_addr = inet_addr(LOCALIP);

    // 绑定套接字
    if(bind(listenfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) == -1){
        fprintf(stderr, "绑定套接字失败,%s ", strerror(errno));
        exit(errno);
    }

    // 监听请求
    if(listen(listenfd, 10) == -1){
        fprintf(stderr, "绑定套接字失败,%s ", strerror(errno));
        exit(errno);
    }

    cliaddr_len = sizeof(struct sockaddr);

    // 等待连接请求
    while (1){
        // 接受由客户机进程调用connet函数发出的连接请求
        recvfd = accept(listenfd, (struct sockaddr *)&clientaddr, &cliaddr_len);
        printf("接收到请求套接字描述符: %d ", recvfd);

        while(1){
            // 在已建立连接的套接字上接收数据
            if((recvLen = recv(recvfd, recvBuf, 1024, 0)) == -1){
                fprintf(stderr,"接收数据错误, %s ",strerror(errno));
            }
            printf("%s", recvBuf);
        }
    }
    close(recvfd);
    return 0;
}
```

tcp_client.c

```c
/*
 * @Author: D-lyw 
 * @Date: 2018-10-26 14:06:32 
 * @Last Modified by: D-lyw
 * @Last Modified time: 2018-11-16 12:34:08
 * @name tcp_client.c
 * @descripe    实现最基本的创建套接字, 填充客户端信息,connet连接服务端, 可连续向服务端发送消息
 */

#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <string.h>
extern int errno;

#define SERVERPORT 8800

int main(int argc, char const *argv[])
{
    // 定义变量存储本地套接字描述符
    int clifd;
    // 设置本地ip地址
    const char serverIp[] = "127.0.0.1";
    // 定义套接字结构存储套接字的ip,port等信息
    struct sockaddr_in cliaddr_in;
    // 定义发送,接收缓冲区大小
    char sendBuf[1024], recvBuf[1024];

    // 创建套接字
    if((clifd = socket(AF_INET, SOCK_STREAM, 0)) == -1){
        fprintf(stderr, "创建套接字失败,%s ", strerror(errno));
        exit(errno);
    }

    // 填充 服务器端结构体信息
    cliaddr_in.sin_family = AF_INET;
    cliaddr_in.sin_addr.s_addr = inet_addr(serverIp);
    cliaddr_in.sin_port = htons(SERVERPORT);

    // 请求连接服务器进程
    if(connect(clifd, (struct sockaddr *)&cliaddr_in, sizeof(struct sockaddr)) == -1){
        fprintf(stderr,"请求连接服务器失败, %s ", strerror(errno));
        exit(errno);
    }
    strcpy(sendBuf, "hi,hi, severs!  ");
    // 发送打招呼消息
    if(send(clifd, sendBuf, 1024, 0) == -1){
        fprintf(stderr, "send message error:(, %s ", strerror(errno));
        exit(errno);
    }
    // 阻塞等待输入,发送消息
    while(1){
        fgets(sendBuf, 1024, stdin);
        if(send(clifd, sendBuf, 1024, 0) == -1){
            fprintf(stderr, "send message error:(, %s ", strerror(errno));
        }
    }
    close(clifd);
    return 0;
}
```

---
终于写完了, 如果觉得写的还可以,请点个赞 :）．．．
这是Linux网络编程系列的第一篇文章, 感兴趣的同学, 可浏览该系列的其他文章

+ [Linux网络编程篇之ICMP协议分析及ping程序实现](https://blog.csdn.net/qq_36958285/article/details/84675689)
+ [Linux网络编程之TCP及聊天室功能实现](https://blog.csdn.net/qq_36958285/article/details/84671973)
+ 未完待续...
