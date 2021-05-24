<p align="center">
  <img width="300" src="https://github.com/darkyzhou/junjun-transfer/raw/master/logo.png" alt="junjun-transfer logo">
</p>
<h2 align="center">俊俊快传</h2>
<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/license/darkyzhou/junjun-transfer">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/darkyzhou/junjun-transfer">
  <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/darkyzhou/junjun-transfer">
  <img alt="GitHub Release Date" src="https://img.shields.io/github/release-date/darkyzhou/junjun-transfer">
  <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/darkyzhou/junjun-transfer?style=social">
</p>

### 简介

[https://junjun.darkyzhou.net](https://junjun.darkyzhou.net)

基于 WebRTC 技术的浏览器点对点文件传输工具，可以让用户**一对一**地将文件传输给另一个用户。和目前常见的使用 QQ、微信等软件进行文件传输相比，俊俊快传直接将文件从发送者传输到接收者，不需要经过中间服务器的存储。也就是说，俊俊快传不需要由发送者先将文件上传到一个服务器上，上传之后再由接收者下载。

这使得人们可以使用俊俊快传快速地将文件分享给朋友。俊俊快传支持传输的文件种类非常广泛，从图片到视频、从 PDF 文件到压缩包，它都能够支持传输。不过目前，由于 STUN 技术的限制，在发送者和接收者都处于类似于对称型 NAT 这样的网络环境下时，俊俊快传几乎不能工作。

本项目分为前端后端两个部分，其中前端 SPA 基于 Vite、React、TailwindCSS、socket.io，后端基于 Express、socket.io。

### 使用

目前，俊俊快传有一个位于香港阿里云服务器的实例：[https://junjun.darkyzhou.net](https://junjun.darkyzhou.net)。

当你打开网页之后，点击左侧卡片选中要传输的文件，然后就能够将二维码或链接分享给接收文件的朋友，在朋友打开链接之后，如果 WebRTC 链接成功建立，那么你就可以点击 “发送” 按钮将文件传输给对方了。

![](https://github.com/darkyzhou/junjun-transfer/raw/master/preview.jpg)

### 技术原理

简单来说，俊俊快传使用 WebSocket 搭建了一个信令服务器，让传输双方的浏览器可以交换 ICE Candidate，进而能够让双方的浏览器尝试连接上对方。连接成功，开始传输文件时，俊俊快传使用 DataChannel 将文件数据从发送方的浏览器发送到接收方。

在传输过曾中，接收方会通过与信令服务器的 WebSocket 连接，发送文件接收的情况（接收字节、速度等），再由信令服务器转发给发送方，这样发送方就能准确知道接收方接收文件的进度。

对于 WebRTC 相关的代码，请见 [frontend-app/src/webrtc](https://github.com/darkyzhou/junjun-transfer/tree/master/frontend-app/src/webrtc)。

### 安装

你也可以自己搭建一个俊俊快传服务器，请参考以下的指导：

#### 搭建 [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 服务器

ICE 服务器不属于俊俊快传本体的范畴，你需要在搭建俊俊快传服务之前准备好 ICE 服务器。

俊俊快传需要连接 [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 服务器才能让文件传输的双方能够成功连接到彼此。[ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 服务器分为 [STUN](https://en.wikipedia.org/wiki/Session_Traversal_Utilities_for_NAT) 服务器和 [TURN](https://en.wikipedia.org/wiki/Traversal_Using_Relays_around_NAT) 服务器，其中后者实质上是一种流量中转服务器，可以解决上面提到的双方位于对称型 NAT 网络下俊俊快传不能工作的问题，因为所有流量都将由这个中转服务器转发。

你可以直接使用 `junjun.darkyzhou.net:3478` 这个 STUN 服务器，或者如果你需要自建的话，目前 GitHub 上可以搜索到许多 [ICE](https://en.wikipedia.org/wiki/Interactive_Connectivity_Establishment) 服务器的实现，有些也实现了 [TURN](https://en.wikipedia.org/wiki/Traversal_Using_Relays_around_NAT) 协议，可以参考它们在 README.md 里写的安装方法进行搭建。上述的 [https://junjun.darkyzhou.net](https://junjun.darkyzhou.net) 使用的 STUN 服务器基于 [jselbie/stunserver](https://github.com/jselbie/stunserver)。

#### Docker 安装

建立一个 `ice-servers.json` 文件，内容如下。

```json
{
  "version": "1",
  "servers": [
    {
      "type": "stun",
      "id": "local-test",
      "url": "stun:192.168.20.88:3478",
      "displayName": "Local Test A",
      "description": "I am for local development only!"
    }
  ]
}
```

其中：

| 参数        | 解释                                                         | 示例                               |
| ----------- | ------------------------------------------------------------ | ---------------------------------- |
| type        | ICE 服务器的类型，只能为 `stun` 或 `turn`                    | `stun`                             |
| id          | ICE 服务器的 ID，建议使用全小写英文以及`-`                   | `local-test`                       |
| url         | ICE 服务器的 URL。如果是 `stun` 服务器，必须以 `stun:` 开头；`turn` 服务器类似。 | `stun:192.168.20.88:3478`          |
| displayName | ICE 服务器的名称，它会显示在网页下方的“ICE 服务器”对应的列表中 | `Local Test A`                     |
| description | ICE 服务器的介绍，它会显示在网页下方的“ICE 服务器”对应的列表中 | `I am for local development only!` |

然后，运行下面的命令即可：

```plain
docker run -p 80:80 -v ./ice-servers.json:/backend-app/config/ice-servers.json --restart always darkyzhou/junjun-transfer
```

俊俊快传的 Docker 镜像只暴露了 80 端口作为 HTTP 入口，如果你需要 HTTPS，那么你需要手动设置一个反向代理，以及对应的证书。

#### Kubernetes 安装

俊俊快传也自带了一份用于部署到 Kubernetes 集群的 YAML 文件，请参考 [deploy-k8s.yaml](https://github.com/darkyzhou/junjun-transfer/blob/master/deploy-k8s.yaml)。

### 缺陷

俊俊快传只是本人为了研究 WebRTC 的练习项目，本人不对它的可靠性做出任何保证以及不担负任何责任。目前，俊俊快传还存在许多缺陷，它们其中有一些是因为我目前精力有限难以修复，有些则是 WebRTC 本身的不足等，难以解决：

- 双方如果有一方与信令服务器的 WebSocket 连接断开，那么本次文件传输则会被迫结束，要重新传输的话必须由发送方刷新页面，重新给接收方发送一个链接。
- 部分设备、以及部分网络设施对于 STUN 服务使用的 UDP 3478 端口存在干扰，导致浏览器无法正常连接 STUN 服务器，进而导致俊俊快传无法正常工作。
- 各大浏览器在 WebRTC 的兼容性上有着各种奇怪的问题，目前最稳定、受到最多测试的是双方都使用 Chrome 浏览器的情景。而对于一方为 Chrome 浏览器，另一方为其他浏览器（例如 FireFox）的情况，或者其他组合，那么他们之间在建立 WebRTC 连接上有可能出现问题，导致俊俊快传不能正常工作。

### 其他

本项目的 Logo 来自 Twitter，遵循 [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) 协议。
