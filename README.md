# 集享公社 APP 下载页

本目录是 `app.jixianggongshe.com` 的独立 H5 静态下载页，可直接部署为 Nginx 静态站。

## 文件

- `index.html`：页面结构、SEO、下载配置入口。
- `styles.css`：移动端视觉样式。
- `app.js`：设备识别、微信提示、下载跳转、复制链接。
- `assets/logo.png`：复用用户端真实品牌 Logo。

## 上线前必须配置

在 `index.html` 顶部替换：

```js
window.JXGS_DOWNLOAD_CONFIG = {
  domain: 'app.jixianggongshe.com',
  androidUrl: 'https://app.jixianggongshe.com/downloads/jixianggongshe.apk',
  iosUrl: 'https://apps.apple.com/cn/app/实际AppId',
  fallbackUrl: 'https://app.jixianggongshe.com/',
}
```

当前 `androidUrl / iosUrl / fallbackUrl` 默认留空，避免误跳到不存在的安装包。

## 本地预览

直接打开 `index.html` 即可。若要模拟线上静态服务：

```powershell
cd D:\xiangmu\jixianggongshe\xiazai
npx.cmd http-server . -p 4175
```

## Nginx 建议

```nginx
server {
  server_name app.jixianggongshe.com;
  root /var/www/jixianggongshe-xiazai;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```
