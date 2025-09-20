import { useEffect, useState } from 'react'

type ContextMenuState<Data = unknown> = {
  visible: boolean
  x: number
  y: number
  data?: Data
}

/**
 * useContextMenu - centralizes positioning and visibility for small floating menus
 *
 * Returns current state and helper methods to open/close the menu. The open
 * helpers accept a MouseEvent and optional payload data which will be stored
 * in `data` for callers to use.
 */
export function useContextMenu<Data = unknown>(initial: Partial<ContextMenuState<Data>> = {}) {
  const [state, setState] = useState<ContextMenuState<Data>>({
    visible: false,
    x: 0,
    y: 0,
    data: undefined,
    ...initial,
  })

  useEffect(() => {
    if (!state.visible) return
    const onClick = () => setState((s) => ({ ...s, visible: false }))
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [state.visible])

  const open = (
    e: MouseEvent | React.MouseEvent<Element>,
    opts: { width?: number; height?: number; data?: Data } = {}
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const menuWidth = opts.width ?? 224
    const menuHeight = opts.height ?? 120

    let x = (e as MouseEvent).clientX
    let y = (e as MouseEvent).clientY

    const target = (e as React.MouseEvent<HTMLElement>).currentTarget as HTMLElement | undefined
    if (target && typeof target.getBoundingClientRect === 'function') {
      const rect = target.getBoundingClientRect()
      x = rect.left + rect.width - menuWidth
      y = rect.top + rect.height + 8
    }

    // keep on screen
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10
    }
    if (x < 10) x = 10
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10
    }
    if (y < 10) y = 10

    setState({ visible: true, x, y, data: opts.data })
  }

  const close = () => setState((s) => ({ ...s, visible: false }))

  return { state, open, close }
}

export type { ContextMenuState }
