---
authors: fish
date: 2019-08-21
tags: [HTTP]
---


缓存已获取的资源能够有效的提升网站与应用的性能，Web 缓存能够减少延迟与网络阻塞，进而减少显示某个资源所用的时间。借助 HTTP 缓存，Web 站点变得更具有响应性。


> 缓存必须是由服务端设置响应头才会生效，一般客户端的请求头中只有设置了cache-control为：`no-store` | `no-cache` | `max-age=0`才会生效（也就是客户端不想走强缓存的时候生效）

---

我们先来看下与缓存相关的HTTP首部字段


### 请求首部字段

| 字段名称             | 说明                           |
| :------------------ | :-----------------------------| 
| Cache-Control       | 控制缓存的行为                  | 
| Pragma              | HTTP/1.0遗留物，Pragma: no-cache等同于Cache-Control: no-cache |
| If-Match            | 比较ETag是否一致（如果匹配中）    |
| If-None-Match       | 比较ETag是否不一致（如果未匹配中） |
| If-Modified-Since   | 比较Last-Modified时间是否一致    |
| If-Unmodified-Since | 比较Last-Modified时间是否一致    |


### 响应首部字段

| 字段名称 | 说明 |
| :--- | :--- | 
| Cache-Control | 控制缓存的行为 | 
| Pragma | HTTP/1.0遗留物，Pragma: no-cache等同于Cache-Control: no-cache |
| Expires | 过期时间 |
| Last-Modified | 资源最后一次修改时间 |
| ETag | 资源的特定版本的标识符 |
| Vary | 决定下一个请求头，应该用一个缓存的回复还是向源服务器请求一个新的回复 |


##### Pragma

Pragma是一个在 HTTP/1.0 中规定的通用首部，这个首部的效果依赖于不同的实现，所以在“请求-响应”链中可能会有不同的效果。当该字段值为no-cache的时候，与 Cache-Control: no-cache 效果一致，表示禁用缓存。


##### Expires

Expires的值对应一个GMT（格林尼治时间）来告诉浏览器资源缓存过期时间，如果还没到该时间点则不发请求。

Expires所定义的缓存时间是相对服务器上的时间而言的，要求客户端和服务器端的时钟严格同步。客户端的时间是可以修改的，如果服务器和客户端的时间不统一，这就导致有可能出现缓存提前失效的情况，存在不稳定性。 面对这种情况，HTTP1.1引入了 **Cache-Control** 头来克服 *Expires* 头的限制。

如果在Cache-Control响应头设置了 "max-age" 或者 "s-max-age"，那么 Expires 头会被忽略。


---

Pragma 和 Expires 现在主要用来用来向后兼容只支持 HTTP/1.0 协议的缓存服务器。


##### Cache-Control

Cache-Control 是一个通用首部字段，被用于在http请求和响应中。缓存指令是单向的，这意味着在请求中设置的指令，不一定被包含在响应中

客户端可以在HTTP请求中使用的标准 Cache-Control 指令

| Cache-Control 属性值  |  说明  |
| :----- |  :------  |
| no-cache | 告知服务器不直接使用缓存，需要验证 |
| no-store | 禁止缓存，资源不会保存到缓存/临时文件 |
| no-transform | 表明客户端希望获取实体数据没有被转换 |
| max-age=[seconds] | 表明客户端愿意接收一个带缓存时间的资源 |
| max-stale[=seconds] | 表明客户端愿意接收一个已经过期的资源。可以设置一个可选的秒数，表示响应不能已经过时超过该给定的时间 |
| min-fresh=[seconds] | 表明客户端希望接收一个能在seconds秒内被更新过的资源 | 
| only-if-cached | 表明客户端只接受已缓存的响应，并且不向原服务器检查是否有更新 |

服务器可以在响应中使用的标准 Cache-Control 指令

| Cache-Control 属性值 | 说明 |
| :--- | :--- |
| no-cache | 缓存但重新验证（要求协商缓存验证） |
| no-store | 不使用任何缓存，资源不应该存储到客户端缓存/临时文件 |
| no-transform | 不能对资源进行转换或转变。HTTP头/实体 不能由代理修改 |
| public| 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器等）缓存，即使是通常不可缓存的内容（例如，该响应没有max-age指令或Expires消息头） |
| private | 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它） |
| must-revalidate | 一旦资源过期（比如已经超过max-age），必须向原服务器验证请求 |
| proxy-revalidate | 与must-revalidate类似，但仅适用于共享缓存（如代理） |
| max-age=[seconds] | 设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒) |
| s-maxage=[seconds] | 覆盖max-age，但仅限于共享缓存(如代理) |

Cache-Control 允许自由组合可选值，例如：

```bash
Cache-Control: public, max-age=3600, must-revalidate
```


### 强缓存

客户端不会向服务器发送任何请求，直接从本地缓存中读取文件并返回 Status Code: 200 OK。 服务器返回 `Expires` 或 `Cache-Control: max-age=31536000` 时会生效

优先顺序 **from memory cache** ，**from disk cache**，最后是请求网络资源

### 缓存验证（协商缓存）


当缓存的文档过期后，需要进行缓存验证或者重新获取资源。只有在服务器返回 `Last-Modified` 或 `ETag` 时才会进行验证。
如果缓存的响应头信息里 Cache-control 含有 **must-revalidate** 或 **no-cache** 值，也会发起缓存验证


#### 1. Last-Modified

Last-Modified 响应头可以作为一种*弱校验器*，其值为资源最后更改的时间。
Last-Modified 称为*弱校验器* 因为它不够精准：
- 只能精确到一秒，在1秒内资源改变，因为时间比较相同，而不会去更新最新的资源
- 一个资源被修改了，但其实际内容根本没发生改变，会因为 Last-Modified 时间匹配不上而返回了整个实体给客户端（即使客户端缓存里有个一模一样的资源）

```bash
Last-Modified: Tue Aug 20 2019 15:47:05 GMT
```

如果响应头里含有Last-Modified，客户端可以在后续的请求首部带上 `If-Modified-Since` 或者 `If-Unmodified-Since` 验证Last-Modified

**If-Modified-Since**：若客户端传递的时间值与服务器上该资源最后修改时间是一致（If-Modified-Since==Last-Modified），则说明该资源没有被修改过，直接返回304状态码，内容为空，这样就节省了传输数据量 。如果两个时间不一致，则服务器会发回该完整资源并返回200状态码，和第一次请求时类似。这样保证不向客户端重复发出资源，也保证当服务器有变化时，客户端能够得到最新的资源。一个304响应比一个静态资源通常小得多，这样就节省了网络带宽。

当前各浏览器均是使用 If-Modified-Since 请求首部来向服务器传递保存的 Last-Modified 值

**If-Unmodified-Since**：该值告诉服务器，若Last-Modified没有匹配上（资源在服务端的最后更新时间改变了），则应当返回412(Precondition Failed) 状态码给客户端


#### 2. ETag

ETag可以解决上述 Last-Modified 可能存在的不准确的问题，因而称它为*强校验器*
ETag值为一个唯一标识符，服务器利用文件修改时间、文件大小和inode号等通过某种算法计算得出

```bash
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

如果响应头里含有ETag，客户端可以在后续的请求首部带上 `If-Match` 或者 `If-None-Match`  验证 ETag

**If-None-Match**：如果服务器发现 ETag 不匹配（If-None-Match != ETag），那么直接以常规GET 200回包形式将新的资源（当然也包括了新的ETag）发给客户端。若客户端传递的 etag 跟服务器的etag一致，则直接返回304知会客户端直接使用本地缓存即可；
当前各浏览器均是使用If-Match请求首部来向服务器传递保存的 ETag 值

**If-Match**：告诉服务器如果没有匹配到ETag，或者收到了“*”值而当前并没有该资源实体，则应当返回412(Precondition Failed) 状态码给客户端。否则服务器直接忽略该字段

需要注意的是，如果资源是走分布式服务器（比如CDN）存储的情况，需要这些服务器上计算ETag唯一值的算法保持一致，才不会导致明明同一个文件，在服务器A和服务器B上生成的ETag却不一样