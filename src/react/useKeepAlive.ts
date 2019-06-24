import { useEffect, useMemo } from 'react'
import { getObservable, keepAlive } from '../core'

/**
 * Just like `keepAlive` but disposal is handled automatically.
 */
export function useKeepAlive<T extends object>(source: T): T {
  const target = getObservable(source)
  const proxy = useMemo(() => keepAlive(source), [target])
  useEffect(() => proxy.dispose, [proxy])
  return proxy
}
