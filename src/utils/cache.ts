/**
 * 缓存工具类
 */
class Cache {
  // 保存缓存
  setCache(key: string, value: unknown, onlySession: boolean = false) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
    if (!onlySession) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }

  // 获取缓存
  getCache<T>(key: string): T | undefined {
    let value = window.sessionStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    } else {
      value = window.localStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      }
      return undefined
    }
  }

  // 删除缓存
  deleteCache(key: string) {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  }

  // 清空缓存
  clearCache() {
    window.localStorage.clear()
    window.sessionStorage.clear()
  }
}

export default new Cache()
