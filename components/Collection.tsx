import React, { useContext } from 'react'
import { CollectionContext } from './CollectionContext/CollectionContext'
import { CollectionViewer } from './CollectionViewer'
import { Tab } from './Tab'

export const Collection: React.FC = () => {
  const { payload, setPayload } = useContext(CollectionContext)
  if (payload.tabs.length) {
    return (
      <Tab
        selected={payload.tabs.length - 1}
        onClose={index => {
          setPayload(prev => ({
            ...prev,
            tabs: prev.tabs.slice(0, index).concat(prev.tabs.slice(index + 1)),
          }))
        }}
        tabs={payload.tabs.map((tab, key) => {
          return {
            name: tab.collection,
            content: (
              <CollectionViewer
                key={`${tab.server}>${tab.database}>${tab.collection}`}
                dataKey={key}
              />
            ),
          }
        })}
      />
    )
  }
  return null
}
