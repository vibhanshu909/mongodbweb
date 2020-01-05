import React, { useEffect, useState } from 'react'
import {
  ContextMenu as LibContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from 'react-contextmenu'

interface IContextMenu {
  menuItems: Array<{
    key: any
    value: any
  }>
}

export const ContextMenu: React.FC<IContextMenu> = props => {
  const [id, setId] = useState('')
  useEffect(() => {
    setId(Math.random().toString())
  }, [])
  const { children, menuItems } = props
  const handleClick = (e: any, data: any) => {
    console.log(data.foo)
  }
  return (
    <>
      <div className='cursor-pointer'>
        <ContextMenuTrigger id={id}>{children}</ContextMenuTrigger>
      </div>
      <LibContextMenu id={id} className='rounded py-1 bg-white text-black'>
        {menuItems.map((menu, key) => (
          <MenuItem
            key={key}
            data={menu.value}
            onClick={handleClick}
            className='p-2 hover:bg-gray-200 cursor-pointer'
          >
            {menu.key}
          </MenuItem>
        ))}
      </LibContextMenu>
    </>
  )
}
