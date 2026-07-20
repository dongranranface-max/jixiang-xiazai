/*
  本文件变更说明：
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
    if (isIOS) return config.iosUrl || config.fallbackUrl || ''
    if (isAndroid) return config.androidUrl || config.fallbackUrl || ''
    return config.fallbackUrl || config.androidUrl || config.iosUrl || ''
  }

  function getPlatformText() {
    if (isIOS) return '已识别 iOS 设备，准备前往官方安装入口'
    if (isAndroid) return '已识别 Android 设备，准备下载官方安装包'
    return '未识别具体设备，可复制链接到手机浏览器打开'
  }

  function initPlatformCopy() {
    if (platformPill) platformPill.textContent = getPlatformText()
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
      showToast(isIOS ? config.appStoreText : config.androidText)
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
