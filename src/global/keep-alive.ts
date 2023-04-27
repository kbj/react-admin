import type { ReactElement } from 'react'

export type Children = ReactElement | null

export class KeepAliveContainer {
  private static MAX_LENGTH = 20
  private static _cacheLists: Array<{ name: string; ele: Children }> = []

  // 单例模式，不允许new创建
  private constructor() {}

  static getInstance() {
    return KeepAliveContainer._cacheLists
  }

  // 初始化缓存容器
  public static reset() {
    this._cacheLists.length = 0
  }

  // 添加缓存
  public static add(path: string, children: Children): boolean {
    if (this._cacheLists.find((item) => item.name === path)) {
      return false
    }

    // 缓存超过上限的 干掉第一个缓存
    if (this._cacheLists.length + 1 >= this.MAX_LENGTH) {
      this._cacheLists = this._cacheLists.slice(1)
    }
    this._cacheLists.push({ name: path, ele: children })
    return true
  }

  // 删除缓存
  public static remove(path: string) {
    const index = this._cacheLists.findIndex((item) => item.name === path)

    if (index < 0) {
      return
    } else if (index === 0) {
      // 删除首位
      this._cacheLists = this._cacheLists.slice(1)
    } else if (index === this._cacheLists.length - 1) {
      // 删除末位
      this._cacheLists = this._cacheLists.slice(0, this._cacheLists.length - 1)
    } else {
      // 删除中间
      this._cacheLists = [...this._cacheLists.slice(0, index), ...this._cacheLists.slice(index + 1)]
    }
  }

  // 查询缓存
  public static get(path: string): Children | undefined {
    const index = this._cacheLists.findIndex((item) => item.name === path)
    return index >= 0 ? this._cacheLists[index].ele : undefined
  }
}
