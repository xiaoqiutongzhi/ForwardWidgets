# ForwardWidgets

<p align="center">
  <img src="https://i.miji.bid/2025/05/08/a7472460007b57687f659b8727f52755.md.jpeg" alt="欢迎使用我的五折码" width="300px"/>
</p>

### 一、豆瓣我看&豆瓣个性化推荐

<img src="https://i.miji.bid/2025/05/05/ee9c89a97e226fa0cebaae2990b13836.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/d1b4ddc054156a87ccd1a4bff8197b53.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/ffee8bded4b121831d1b8da95c047bb9.jpeg" style="width:200px" /><img src="https://i.miji.bid/2025/05/05/ad56685688d7cd354b6cfcbed97b3e09.jpeg" style="width:200px" />

其中用户ID和Cookie必填

#### 用户ID获取
<img src="https://i.miji.bid/2025/05/05/de6358e6a8cca3e890f51e5f385e5aaa.png" alt="de6358e6a8cca3e890f51e5f385e5aaa.png" border="0" />
我的豆瓣标签页中有显示用户ID

#### Cookie获取
最好用iPhone网页登陆豆瓣，然后用Loon或者Qx等工具抓包获取Cookie（不清楚Cookie多久失效，所以可能过一段时间需要重新获取填一次）

### 二、Trakt我看&Trakt个性化推荐

<img src="https://i.miji.bid/2025/05/08/e7bae366ee0d96b8e4cd0fa809ef8d52.md.png" style="width:200px" /><img src="https://i.miji.bid/2025/05/08/63d7160f9ced06ff18de3be8723b884e.md.png" style="width:200px" />

其中用户名和Cookie必填

#### 用户名获取
在网页上登录你的Trakt，查看url如下 https://trakt.tv/users/xxxx/watchlist ，其中users后面跟的就是你的用户名

#### Cookie获取
最好用iPhone网页登陆Trakt，然后用Loon或者Qx等工具抓包获取Cookie（不清楚Cookie多久失效，所以可能过一段时间需要重新获取填一次）

```shell
几点说明：
1. 之所以不用官方trakt api，是因为尝试后发现目前生成的token 24小时之后会过期，如果要继续使用，需用上一次返回的refresh_token重新生成，当前插件也没有好的保存方式
2. trakt看过里是包含看了一半的电视的，也就是说正在看的电视也会出现在 看过-电视 里
3. 尝试后发现当前ForwardWidget插件的数据模型里如果type是tmdb，貌似有数据会被缓存覆盖的问题，douban和imdb类型不存在该问题
```
