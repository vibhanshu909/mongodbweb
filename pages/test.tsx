import React from 'react'
import { Tab } from '../components/Tab'

export const selectedClassName: HTMLButtonElement['className'] =
  'border-b-4 border-blue-600 text-blue-600'

export default () => {
  return (
    <Tab
      tabs={[
        { name: 'User', content: <p>User</p> },
        { name: 'Activity', content: <p>Activity</p> },
      ]}
      selected={0}
    />
  )
}
