import { useCallback, useState } from 'react'

const flip = (v: any) => !v

export const emptyArray: any[] = []

export function useForceUpdate(): () => void {
  const [, u] = useState(false)
  return useCallback(() => u(flip), emptyArray)
}
