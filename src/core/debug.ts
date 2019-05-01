import { $DEBUG, $O } from '../shared'

/** Global debug mode */
let isDebug = false

export const getDebug = (obj?: object) =>
  obj && obj[$DEBUG] !== undefined ? !!obj[$DEBUG] : isDebug

/** Enable debug mode globally or for the given observable object(s) */
export function setDebug(debug: boolean, ...objs: object[]) {
  if (objs.length) {
    for (const obj of objs) {
      const observable = obj[$O]
      if (observable) {
        observable[$DEBUG] = debug
      } else {
        // Useful for prototypes.
        obj[$DEBUG] = debug
      }
    }
  } else {
    isDebug = debug
  }
}

/** Reset debug mode for the given observable object(s) */
export function unsetDebug(...objs: object[]) {
  for (const obj of objs) {
    const observable = obj[$O]
    if (observable) {
      delete observable[$DEBUG]
    } else {
      delete obj[$DEBUG]
    }
  }
}
