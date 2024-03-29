---
authors: yijinc
date: 2023-03-30
tags: [https]
---

### 为什么需要加密？

HTTP 有以下安全性问题：

- 使用明文进行通信，内容可能会被窃听；
- 不验证通信方的身份，通信方的身份有可能遭遇伪装；
- 无法证明报文的完整性，报文有可能遭篡改。


### 对称加密

![Symmetric-Key Encryption](../static/img/symmetric-key-encryption.png)


对称密钥加密（Symmetric-Key Encryption），加密和解密使用同一密钥。

优点：运算速度快
缺点：密钥无法安全地传输给浏览器


### 非对称加密

![Public-Key Encryption](../static/img/public-key-encryption.png)

非对称密钥加密，又称公开密钥加密（Public-Key Encryption），加密和解密使用不同的密钥。

它需要两个密钥，一个是公开密钥，另一个是私有密钥；公钥可以公开，可任意向外发布；私钥不可以公开，必须由用户自行严格秘密保管；用公钥加密的内容必须用私钥才能解开，同样，用私钥加密的内容（数字签名）只有公钥能解开。

优点：可以安全地将公钥传输给 ~~**浏览器**~~ 通信发送方；
缺点：运算速度慢。

### HTTPS 采用的加密方式

非对称加密的一对公钥私钥，可以保证单个方向传输的安全性，那用两对公钥私钥，是否就能保证双向传输都安全了？
的确可以！但是由于非对称加密算法非常耗时，HTTPS的加密没使用这种方案。

HTTPS 采用混合的加密机制：
- 使用非对称密钥加密，传输对称密钥加密方式所需要的 Secret Key，从而保证安全性;
- 获取到 Secret Key 后，再使用对称密钥加密方式进行通信，从而保证效率。（下图中的 Session Key 就是 Secret Key）

![How Https encryption works](../static/img/https-encryption-works.png)

### 认证

非对称加密仅保证了将公钥传送给通信方，这个公钥是通过明文传输的，若这个公钥被中间人劫持，那他也能用该公钥解密服务器传来的信息。

中间人劫持服务器公钥A后，保存下来，把数据包中的公钥A替换成自己伪造的公钥B（它当然也拥有公钥B对应的私钥B’）；浏览器生成一个用于对称加密的密钥X，用公钥B（浏览器无法得知公钥被替换了）加密后传给服务器；中间人劫持后用私钥B’解密得到密钥X，再用公钥A加密后传给服务器。。。

出现这种问题的根本原因是浏览器无法确认收到的公钥是不是网站自己的

数字证书认证机构（CA，Certificate Authority）是客户端与服务器双方都可信赖的第三方机构，它的作用就是证明公钥是可信的

网站在使用HTTPS前，服务器的运营人员向 CA 提出公开密钥的申请，CA 在判明提出申请者的身份之后，会对已申请的公开密钥做数字签名，然后分配这个已签名的公开密钥，并将该公开密钥放入公开密钥证书后绑定在一起。

进行 HTTPS 通信时，服务器会把证书发送给客户端。客户端取得其中的公开密钥之后，先使用数字签名进行验证，如果验证通过，就可以开始通信了。

![Certification Signature](../static/img/certificate-signing-verification.png)

数字签名的制作过程：

- CA机构拥有非对称加密的私钥和公钥
- CA机构对证书明文数据（Certificate Data）进行 Hash
- 对hash后的值用私钥加密，得到数字签名（Signature）
- 明文（Certificate Data）和数字签名（Signature）共同组成了数字证书，就可以颁发给网站了

浏览器验证过程：

- 拿到数字签名的数据，得到明文（Certificate Data）和数字签名（Signature）
- 用CA机构的公钥对 数字签名（Signature）解密，得到 X
- 用证书里指定的hash算法对明文（Certificate Data）进行 Hash 得到 Y
- 如果 X == Y，说明明文（Certificate Data）和数字签名（Signature）没有被篡改，表明证书可信任；
