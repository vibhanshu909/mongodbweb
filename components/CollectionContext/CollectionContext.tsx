import React from 'react'
import { ICollectionViewer } from '../CollectionViewer'

export interface ICollectionContextPayload {
  tabs: ICollectionViewer[]
}

export const CollectionContext = React.createContext({
  payload: {
    tabs: [],
  },
  setPayload: () => null,
} as {
  payload: ICollectionContextPayload
  setPayload: React.Dispatch<React.SetStateAction<ICollectionContextPayload>>
})
