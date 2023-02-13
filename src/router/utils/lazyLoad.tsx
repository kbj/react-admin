import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import GlobalLoading from '@/components/global-loading'

/**
 * @description 路由懒加载
 */
export const lazyLoad = (dir: string): ReactNode => {
  const Module = lazy(() => import(`@/views${dir}`))
  return (
    <Suspense fallback={<GlobalLoading />}>
      <Module />
    </Suspense>
  )
}
