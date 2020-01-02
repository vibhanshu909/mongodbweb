import React from 'react'

export const LocalStorageContext = React.createContext({
  payload: null,
  setPayload: () => null,
} as { payload: any; setPayload: React.Dispatch<any> })
