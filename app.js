/*
  本文件变更说明：
  - 2026-07-21 ｜ 下载页桌面/未知设备未配置安装包时改用通用待配置提示
  - 2026-07-21 ｜ 下载按钮文案随平台和安装地址配置自适应，未知设备不再回跳当前页
  - 2026-07-21 ｜ 下载目标按平台严格区分，未配置安装包时提示而不是回跳当前页
  - 2026-07-21 ｜ 新增 APP 下载页设备识别、微信提示、下载跳转和复制链接交互
  - 后续改动请按"YYYY-MM-DD ｜ 改动内容（PIT-YYYY-NNN 或原因）"追加
*/

(function () {
  const config = window.JXGS_DOWNLOAD_CONFIG || {}
  const userAgent = window.navigator.userAgent || ''
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
  const isAndroid = /Android/i.test(userAgent)
  const isWeChat = /MicroMessenger/i.test(userAgent)

  const downloadBtn = document.getElementById('downloadBtn')
  const downloadLabel = document.getElementById('downloadLabel')
  const copyBtn = document.getElementById('copyBtn')
  const platformPill = document.getElementById('platformPill')
  const safeLine = document.getElementById('safeLine')
  const wechatTip = document.getElementById('wechatTip')
  const toast = document.getElementById('toast')

  let toastTimer = 0

  function showToast(message) {
    if (!toast) return
    window.clearTimeout(toastTimer)
    toast.textContent = message
    toast.classList.add('is-visible')
    toastTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible')
    }, 2600)
  }

  function currentUrl() {
    return window.location.href || 'https://app.jixianggongshe.com/'
  }

  function getDownloadTarget() {
    if (isIOS) return config.iosUrl || ''
    if (isAndroid) return config.androidUrl || ''
    return config.androidUrl || config.iosUrl || ''
  }

  function getPlatformText() {
    if (isIOS) return '已识别 iOS 设备，准备前往官方安装入口'
    if (isAndroid) return '已识别 Android 设备，准备下载官方安装包'
    return '未识别具体设备，可复制链接到手机浏览器打开'
  }

  function getDownloadLabel() {
    if (isIOS) return config.iosUrl ? '前往 iOS 安装' : 'iOS 版本待开放'
    if (isAndroid) return config.androidUrl ? '下载 Android 安装包' : '安卓安装包待配置'
    return config.androidUrl || config.iosUrl ? '选择可用安装入口' : '安装包待配置'
  }

  function getUnavailableText() {
    if (isIOS) return config.appStoreText
    if (isAndroid) return config.androidText
    return '安装包地址待配置，请使用手机浏览器访问或联系官方客服'
  }

  function initPlatformCopy() {
    if (platformPill) platformPill.textContent = getPlatformText()
    if (downloadLabel) downloadLabel.textContent = getDownloadLabel()
    if (safeLine) {
      safeLine.textContent = isIOS
        ? 'iOS / iPhone 用户请使用 Safari 或系统浏览器打开'
        : isAndroid
          ? 'Android 用户请使用系统浏览器下载安装'
          : 'iOS / Android 自动识别，官方渠道安全下载安装'
    }
    if (wechatTip && isWeChat) {
      wechatTip.hidden = false
    }
  }

  function downloadApp() {
    if (isWeChat) {
      showToast('请点击右上角，在浏览器中打开后再下载')
      if (wechatTip) wechatTip.hidden = false
      return
    }

    const target = getDownloadTarget()
    if (!target) {
      showToast(getUnavailableText())
      return
    }

    window.location.href = target
  }

  async function copyLink() {
    const text = currentUrl()
    try {
      if (window.navigator.clipboard && window.isSecureContext) {
        await window.navigator.clipboard.writeText(text)
      } else {
        const input = document.createElement('textarea')
        input.value = text
        input.setAttribute('readonly', 'readonly')
        input.style.position = 'fixed'
        input.style.left = '-9999px'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      showToast('下载链接已复制')
    } catch (error) {
      showToast('复制失败，请手动复制浏览器地址')
    }
  }

  initPlatformCopy()
  if (downloadBtn) downloadBtn.addEventListener('click', downloadApp)
  if (copyBtn) copyBtn.addEventListener('click', copyLink)
})()
