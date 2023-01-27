import { ReactElement } from 'react'

export type Children = ReactElement | null

export class KeepAliveContainer {
  private static _cacheLists: Map<string, Children> = new Map()

  // 单例模式，不允许new创建
  private constructor() {}

  static getInstance() {
    return KeepAliveContainer._cacheLists
  }

  // 初始化缓存容器
  public static reset(path: string, children: Children) {
    this._cacheLists.clear()
    this._cacheLists.set(path, children)
  }

  // 添加缓存
  public static add(path: string, children: Children) {
    this._cacheLists.set(path, children)
  }

  // 删除缓存
  public static remove(path: string) {
    this._cacheLists.delete(path)
  }
}
