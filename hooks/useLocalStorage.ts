import { Dispatch, useState } from 'react'

export const useLocalStorage = (name: string): [any, Dispatch<any>] => {
  let defaultState = '{}'
  if ('localStorage' in global) {
    defaultState = JSON.parse(localStorage.getItem(name) || defaultState)
  }
  const [state, setState] = useState(defaultState)
  return [
    state,
    newState => {
      if (typeof newState === 'function') {
        const result = newState(state)
        localStorage.setItem(name, JSON.stringify(result))
        setState(result)
      } else {
        localStorage.setItem(name, JSON.stringify(newState))
        setState(newState)
      }
    },
  ]
}
