import axios from 'axios'
import React, { useContext } from 'react'
import { CollectionContext } from '../pages/_app'
import { Row } from './Row'
export const CollectionButton: React.FC<{
  name: string
  count: number
}> = ({ name, count }) => {
  const { setPayload } = useContext(CollectionContext)
  return (
    <button
      className="w-full px-2 focus:bg-gray-700 focus:outline-none"
      onDoubleClick={async () => {
        const { data } = await axios.get(
          `/api/servers/defaultcluster-35fsk.mongodb.net/databases/test/collections/${name}/query?q=%7B%7D`,
        )
        setPayload(prev => ({ ...prev, collectionData: data }))
      }}
    >
      <Row>
        <span>{name}</span>
        <span>{count}</span>
      </Row>
    </button>
  )
}
