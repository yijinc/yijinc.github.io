---
authors: fish
date: 2019-08-20
tags: [HTTP, 跨域]
---

# HTTP之跨域

##  跨源资源共享 CORS

跨源资源共享（Cross-Origin Resource Sharing）是一种基于 HTTP 头的机制。出于安全性，浏览器限制脚本内发起的跨域请求， 例如，*XMLHttpRequest* 和 *Fetch API* 遵循 **同源策略（Same-origin policy）**。CORS 机制允许服务器声明哪些源站通过浏览器有权限访问哪些资源。


### 简单请求

简单请求（不会触发 CORS 预检请求）需满足**所有**下述条件：

- Request-Method 只能是  GET | HEAD | POST
- Request-Headers 允许人为设置的字段只能包含 Accept、Accept-Language、Content-Language、Content-Type 
- Content-Type 只能是 text/plain | multipart/form-data | application/x-www-form-urlencoded
- XMLHttpRequest 对象没有注册任何事件监听器；XMLHttpRequest 对象可以使用 XMLHttpRequest.upload 属性访问
- 请求中没有使用 ReadableStream 对象

简单请求涉及的请求头有 Origin、Access-Control-Allow-Origin、Access-Control-Expose-Headers、 Access-Control-Allow-Credentials等；

### 预检请求（preflight request）

CORS要求，那些可能对服务器数据产生副作用的 HTTP 请求，浏览器必须首先使用 `OPTIONS` 方法发起一个 **预检请求（preflight request）**，从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。

预检请求头字段

| 字段名称             | 说明                           |
| :------------------ | :-----------------------------| 
| Origin              | 表明预检请求或实际请求的源站 domain | 
| Access-Control-Request-Headers | 用于预检请求，将实际请求头告诉服务器 |
| Access-Control-Request-Method | 用于预检请求，将实际请求方法告诉服务器 |

预检响应头字段

| 字段名称             | 说明                           |
| :------------------ | :-----------------------------| 
| Access-Control-Allow-Origin| 指定允许访问该资源的外域 URI，可以设置为***** 允许所有域的请求 | 
| Access-Control-Allow-Headers | 响应预检请求，指明了实际请求中允许携带的首部字段 |
| Access-Control-Allow-Methods | 响应预检请求，指明了实际请求所允许使用方法 |
| Access-Control-Max-Age | 指定预检请求的结果能够被缓存多久，如果在有效期内，再次请求将不会发起预检请求 |
| Access-Control-Allow-Credentials | 指明了实际的请求是否可以使用 credentials |
| Access-Control-Expose-Headers | 服务器暴露一些自定义的相应头,允许客户端问（否则response是拿不到这些头字段的） |



### 附带身份凭证的请求（withCredentials）

一般情况，对于跨源 XMLHttpRequest 或 Fetch 请求，浏览器不会发送身份凭证息（cookie）。如果要把 Cookie 发到服务器，一方面要服务器同意，指定 Access-Control-Allow-Credentials字段

```bash
Access-Control-Allow-Credentials: true
```

另一方面，开发者必须在 XMLHttpRequest 或 Fetch 请求中明确指明附带身份凭证

```javascript
// XMLHttpRequest withCredentials
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.other.com/resources', true);
xhr.withCredentials = true;
xhr.onreadystatechange = handler;
xhr.send();

// Fetch withCredentials
fetch('https://api.other.com/resources', {
  mode: "cors",
  credentials: "include"
});

```

服务器在响应附带身份凭证的请求时：CORS 响应头（Access-Control-Allow-Origin、Access-Control-Allow-Headers、Access-Control-Allow-Methods）的值**不能设为通配符 *** ，而应将其设置为确定的值，否则会请求失败。

Cookie 策略受 **SameSite** 属性控制，如果 SameSite 值不是 `None`，就算设置了withCredentials，cookie 也不会被发送到跨源的服务器。

响应头中也可以携带 Set-Cookie 字段，尝试对 Cookie 进行修改。如果用户浏览器的第三方 cookie 策略设置为拒绝所有第三方 cookies，那么会操作失败，将会抛出异常。

设置允许跨站发送的cookie，但这样可能导致 **跨站请求伪造**（Cross-site request forgery，CSRF）攻击变得容易。

```bash
Set-Cookie: <cookie-name>=<cookie-value>; HttpOnly; Secure; SameSite=None
```

## 跨域常见解决方案


### 1、服务端直接配置 Access-Control-Allow-Origin

基于上述CORS机制，服务端配置成允许跨源请求就行

如果服务器未使用 *****，而是指定了一个域，那么为了向客户端表明服务器的返回会根据Origin请求头而有所不同，必须在Vary响应头中包含Origin

```bash
Access-Control-Allow-Origin: https://www.frontend.com
Vary: Origin
```


### 2、JSONP跨域

浏览器仅会限制脚本内发起的跨域请求，而 script、img 标签没有跨域限制。所以可以通过script 标签src属性，发送带有callback参数的GET请求，服务端将接口返回数据放到callback函数中，返回给浏览器，浏览器的callback解析执行，从而前端拿到callback函数返回的数据。

```htmlbars
<script>
    var script = document.createElement('script');
    script.type = 'text/javascript';
    function handleCallback(data) {
	    console.log('get data', data);
	}
    script.src = 'https://api.other.com/xx?callback=handleCallback';
    document.head.appendChild(script);
</script>
```

### 3、nginx 服务器代理

其实对于任一服务器都可以做代理转发处理，nginx 大概是用得最多且最简单的服务器代理了。

```bash
server {
        listen       80;
        server_name  www.example.com;
        location /api {
            proxy_pass http://api.server.com; # 后端服务地址
        }
        location / {
            root html/static; # 前端静态资源路径
            # proxy_pass http://api.server.com; # 或前端服务地址
        }
}
```


### 4、构建工具代理（开发环境）

在日常开发中一般会直接使用 构建工具的代理（node server代理）配置，比如 webpack

```javascript
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

### 5、系统host添加域名

我们可以在系统的host文件 增加 `ip = host` 映射，本地访问域名host时，会去访问真是ip地址，比如 127.0.0.1，一般在调试需要SSO登录的应用的时候经常会用这种方式。


hosts文件位置在 
Windows：C:\Windows\System32\drivers\etc\hosts
Mac：/etc/hosts

### 6、window.postMessage + iframe

[window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 方法可以通过第二个参数 **targetOrigin** 安全地实现跨源通信。

示例：2个跨源页面的通信


aaa.com/a.html 需要跨域请求数据的页面

```htmlbars
<iframe
  src="http://bbb.com/b.html"
  id="iframe"
></iframe>
<script>
	const targetOrigin = 'http://bbb.com';
	function receiveMessage(event) {
		// 我们始终使用 origin 和 source 属性验证发件人的身份
	    if (event.origin !== targetOrigin) return;
		console.log(event.data);
	}
	window.addEventListener("message", receiveMessage, false);
	window.postMessage('fetchUserInfo', targetOrigin);
</script>
```

bbb.com/b.html 是同源的页面

```htmlbars
<script>
	const targetOrigin = 'http://aaa.com';
	function receiveMessage(event) {
	    if (event.origin !== targetOrigin) return;
		if (event.data === 'fetchUserInfo') {
			const user = { /** mock data */ };
			window.postMessage(JSON.stringify(user), targetOrigin);	
		}
	}
	window.addEventListener("message", receiveMessage, false);
</script>
```

---

以上是最常见的几种跨域解决方案，还有一些不太常用的方法 比如 
- document.domain + Iframe（只能用于二级域名相同的情况下）
- window.location.hash + Iframe
- window.name+ Iframe
- Websocket



