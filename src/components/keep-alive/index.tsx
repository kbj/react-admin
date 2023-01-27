import ReactDOM from 'react-dom'
import { equals, isNil, map } from 'ramda'
import { memo, RefObject, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Children, KeepAliveContainer } from '@/global/keep-alive'

interface Props {
  activeName?: string
  include?: Array<string>
  exclude?: Array<string>
  children: Children
}

function KeepAlive({ children, exclude, include }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  if (isNil(exclude) && isNil(include)) {
    // 初始化
    KeepAliveContainer.reset(pathname, children)
  } else {
    const component = KeepAliveContainer.getInstance().get(pathname)
    if (isNil(component)) {
      KeepAliveContainer.add(pathname, children)
    }
  }

  return (
    <>
      <div ref={containerRef} className="keep-alive" />

      {map(
        (path) => (
          <Component
            active={equals(path, pathname)}
            renderDiv={containerRef}
            name={path}
            key={path}
          >
            {KeepAliveContainer.getInstance().get(path) as Children}
          </Component>
        ),
        [...KeepAliveContainer.getInstance().keys()]
      )}
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
      if (renderDiv.current?.firstChild) {
        renderDiv.current?.replaceChild(
          targetElement,
          renderDiv.current?.firstChild
        )
      } else {
        renderDiv.current?.appendChild(targetElement)
      }
    }
  }, [active])
  useEffect(() => {
    // 添加一个id 作为标识 并没有什么太多作用
    targetElement.setAttribute('id', name)
  }, [name])
  // 把vnode 渲染到document.createElement('div') 里面
  return (
    <>
      {activatedRef.current && ReactDOM.createPortal(children, targetElement)}
    </>
  )
}

export const KeepAliveComponent = memo(Component)
