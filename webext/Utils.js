'use strict'

function verify () {
  for (var i = 0; i < arguments.length; i++) {
    if (!arguments[i]) {
      throw "verification failed"
    }
  }
}

class Utils {
  static async getBookmarksRoot () {
    let roots = await browser.bookmarks.get('root________')
    if (browser.runtime.lastError) {
      roots = await browser.bookmarks.get('0')
    }
    return roots[0]
  }

  static async getBookmarkBaseFolders () {
    const root = await this.getBookmarksRoot()
    return browser.bookmarks.getChildren(root.id)
  }

  static async getBookmarkById (bookmarkId) {
    verify(bookmarkId)
    return (await browser.bookmarks.get(bookmarkId))[0];
  }

  static async findBookmarkByUrl (url) {
    verify(url)
    return (await browser.bookmarks.search(url))[0]
  }

  static getOrigin(url) {
    verify(url)
    return new URL(url).origin
  }

  static getPath(url) {
    verify(url)
    return new URL(url).pathname
  }

  static getOriginPath(url) {
    url = new URL(url)
    return url.href.substr(0, url.href.length - url.search.length)
  }

  static async getTabById (tabId) {
    verify(tabId)
    return browser.tabs.get(tabId)
  }

  static async getActiveTab() {
    return (await browser.tabs.query({
      active: true,
      currentWindow: true
    }))[0]
  }

  static async setSetting (key, value) {
    let settings = { }
    settings[key] = value
    return browser.storage.local.set(settings)
  }

  static async getSetting (key, defaultValue) {
    const settings = await browser.storage.local.get(key)
    if (settings)
      return settings[key]
    return defaultValue
  }

  static updateSelectOptions (id, options) {
    const select = document.getElementById(id)
    select.innerHTML = ''
    for (const opt of options) {
      const option = document.createElement('option')
      option.setAttribute('value', opt.value)
      option.setAttribute('title', opt.title)
      for (const key in (opt.data || [])) {
        option.setAttribute('data-' + key, opt.data[key])
      }
      if (opt.selected) {
        option.setAttribute('selected', true)
      }
      option.appendChild(document.createTextNode(opt.title))
      select.appendChild(option)
    }
  }
}
