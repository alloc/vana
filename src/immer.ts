import { Draft, Immer, IProduce } from 'immer'
import { definePrivate, isArray } from './common'
import { commit } from './funcs/commit'
import { $O } from './symbols'
import { Observable } from './types/Observable'

/** Function that modifies a draft */
export type Recipe<
  T extends object = any,
  Args extends any[] = any[],
  Result = any
> = (draft: Draft<T>, ...args: Args) => Result

export const immer = new Immer({
  onAssign(state, prop: any) {
    state.assigned[prop] = true
  },
  onDelete(state, prop: any) {
    state.assigned[prop] = false
  },
  onCopy(state) {
    let { base } = state
    let target: Observable = base && base[$O]
    if (target) {
      let { copy, assigned } = state
      if (isArray(base)) {
        // $O is missing, because Immer only copies the indices.
        definePrivate(copy, $O, target)
      }
      target._rebind(copy)
      for (let prop in assigned) {
        commit(target, base[prop], copy[prop], prop, !assigned[prop], state)
      }
      commit(target, base, copy, null, false, state)
    }
  },
})

// tslint:disable:no-default-export
export default immer.produce

export const produce: IProduce = immer.produce
export const setAutoFreeze = immer.setAutoFreeze.bind(immer)
export const setUseProxies = immer.setUseProxies.bind(immer)
