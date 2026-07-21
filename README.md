# 集享公社 APP 下载页

本目录是 `app.jixianggongshe.com` 的独立 H5 静态下载页，可直接部署为 Nginx 静态站。

## 文件

- `index.html`：页面结构、SEO、下载配置入口。
- `styles.css`：手机优先的 H5 自适应视觉样式，兼容平板和桌面。
- `app.js`：设备识别、微信提示、下载跳转、复制链接。
- `assets/logo.png`：复用用户端真实品牌 Logo。

## 上线前必须配置

在 `index.html` 顶部替换：

```js
window.JXGS_DOWNLOAD_CONFIG = {
  domain: 'app.jixianggongshe.com',
  androidUrl: '',
  iosUrl: 'https://apps.apple.com/cn/app/实际AppId',
  fallbackUrl: 'https://app.jixianggongshe.com/',
}
```

当前 `androidUrl / iosUrl` 默认留空，避免误跳到不存在的安装包；安装包或应用商店地址确认后再替换。

## 自适应验收

页面按手机优先设计，桌面端不再只是 430px 手机页居中；建议至少检查以下尺寸：

- 手机：320×568、375×667、390×844、430×932。
- 平板 / 横屏：768×1024、1024×768。
- 桌面：1440×900。

验收重点：首屏无横向滚动，标题、按钮、toast 和微信提示不遮挡；`androidUrl / iosUrl` 为空时只提示待配置，不跳转 404 或回跳当前页。

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

上线后打开 `https://app.jixianggongshe.com/`，用移动端和桌面端分别抽查页面加载、控制台错误、下载按钮提示、复制链接和微信内打开提示。
