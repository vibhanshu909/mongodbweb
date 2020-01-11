import React, { useState } from 'react'
import {
  CollectionContext,
  ICollectionContextPayload,
} from './CollectionContext'

export const CollectionContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState({
    tabs: [],
    collectionData: null,
  } as ICollectionContextPayload)
  return (
    <CollectionContext.Provider
      value={{ payload: data, setPayload: setData as any }}
    >
      {children}
    </CollectionContext.Provider>
  )
}
