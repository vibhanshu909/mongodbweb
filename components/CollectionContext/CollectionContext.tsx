import React from 'react'
import { ICollectionViewer } from '../Collection'

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
