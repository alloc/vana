import { useReducer } from 'react'

export const emptyArray: any[] = []

export const useForceUpdate = () =>
  useReducer(() => ({}), {})[1] as (() => void)
