import React from 'react'
import { ContextMenu } from '../components/ContextMenu'

const Test = () => {
  return (
    <ContextMenu menuItems={[{ key: <div>testing</div>, value: 'testing' }]}>
      <div>trigger</div>
    </ContextMenu>
  )
}

export default Test
