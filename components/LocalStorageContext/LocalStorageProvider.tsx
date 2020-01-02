import React, { useState } from 'react'
import { LocalStorageContext } from './LocalStorageContext'

const LocalStorageProvider: React.FC<{ name: string }> = ({
  name,
  children,
}) => {
  let defaultState = '{}'
  if ('localStorage' in global) {
    defaultState = JSON.parse(localStorage.getItem(name) || defaultState)
  }
  const [payload, setPayload] = useState(defaultState as any)
  return (
    <LocalStorageContext.Provider
      value={{
        payload,
        setPayload: (newState: any) => {
          if (typeof newState === 'function') {
            const result = newState(payload)
            localStorage.setItem(name, JSON.stringify(result))
            setPayload(result)
          } else {
            localStorage.setItem(name, JSON.stringify(newState))
            setPayload(newState)
          }
        },
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  )
}

export default LocalStorageProvider
