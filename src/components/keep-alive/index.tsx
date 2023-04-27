import ReactDOM from 'react-dom'
import { memo, RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Children, KeepAliveContainer } from '@/global/keep-alive'
import { useUpdate } from 'ahooks'
import { useRouteStore } from '@/store/common/route'
import { searchRouteDetail } from '@/router/utils'

interface Props {
  activeName?: string
  isAsyncInclude?: boolean // 是否异步添加 Include  如果不是又填写了 true 会导致重复渲染
  children: Children
}

function KeepAlive({ activeName, children, isAsyncInclude = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [asyncInclude] = useState<boolean>(isAsyncInclude)
  const update = useUpdate()
  const routeList = useRouteStore((state) => state.routeList) // 动态路由信息

  useLayoutEffect(() => {
    if (!activeName) {
      return
    }

    // 添加
    const result = KeepAliveContainer.add(activeName, children)
    if (result && !asyncInclude) {
      update()
    }

    return () => {
      // 如果是不缓存的页面，那需要在这里删除
      const currentRoute = searchRouteDetail(activeName, routeList[0].children || [])
      if (!currentRoute || !currentRoute.meta?.isCache) {
        KeepAliveContainer.remove(activeName)
      }
    }
  }, [children, activeName, update, asyncInclude])

  return (
    <>
      <div ref={containerRef} className="keep-alive" />
      {KeepAliveContainer.getInstance().map(({ name, ele }) => (
        <Component active={name === activeName} renderDiv={containerRef} name={name} key={name}>
          {ele}
        </Component>
      ))}
    </>
  )
}
export default memo(KeepAlive)
interface ComponentProps {
  active: boolean
  children: Children
  name: string
  renderDiv: RefObject<HTMLDivElement>
}
// 渲染 当前匹配的路由 不匹配的 利用createPortal 移动到 document.createElement('div') 里面
function Component({ active, children, name, renderDiv }: ComponentProps) {
  const [targetElement] = useState(() => document.createElement('div'))
  const activatedRef = useRef(false)
  activatedRef.current = activatedRef.current || active
  useEffect(() => {
    if (active) {
      // 渲染匹配的组件
      renderDiv.current?.appendChild(targetElement)
    } else {
      try {
        // 移除不渲染的组件
        renderDiv.current?.removeChild(targetElement)
      } catch (e) {}
    }
  }, [active, name, renderDiv, targetElement])
  useEffect(() => {
    // 添加一个id 作为标识 并没有什么太多作用
    targetElement.setAttribute('id', name)
  }, [name, targetElement])
  // 把vnode 渲染到document.createElement('div') 里面
  return <>{activatedRef.current && ReactDOM.createPortal(children, targetElement)}</>
}
export const KeepAliveComponent = memo(Component)
