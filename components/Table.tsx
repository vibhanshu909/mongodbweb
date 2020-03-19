import React, { useMemo } from 'react'

const computeHeaders = (data: any[]) => {
  if (data.length) {
    return Array.from(
      new Set(
        data.reduce((prev, d) => prev.concat(Object.keys(d)), []) as string[],
      ),
    )
  }
  return []
}

interface ITable {
  data: any[]
  selected?: number[]
  onSelectAll?: (checked: boolean) => void
  onSelect?: (index: number) => void
  onUnSelect?: (index: number) => void
}

const Table: React.FC<ITable> = ({
  data,
  onSelect,
  onUnSelect,
  onSelectAll,
  selected,
}) => {
  const headers = useMemo(() => computeHeaders(data), [data])
  if (data.length) {
    // const headers = Array.from(
    //   new Set(
    //     data.reduce((prev, d) => prev.concat(Object.keys(d)), []) as string[],
    //   ),
    // )
    return (
      <div className='overflow-auto'>
        <table className='m-2 border border-gray-500'>
          <thead>
            <tr>
              <th className='bg-white border border-gray-500 p-1'>
                <input
                  type='checkbox'
                  checked={selected?.length === data.length}
                  onChange={e => {
                    onSelectAll?.(e.target.checked)
                  }}
                />
              </th>
              {headers.map((heading, key) => (
                <th key={key} className='bg-white border border-gray-500 p-1'>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, key) => (
              <tr key={key}>
                <td className='border border-gray-500 p-1'>
                  <input
                    type='checkbox'
                    checked={selected?.includes(key)}
                    onChange={e => {
                      e.target.checked ? onSelect?.(key) : onUnSelect?.(key)
                    }}
                  />
                </td>
                {headers.map((col, lkey) => {
                  const cell = row[col]
                  return (
                    <td key={lkey} className='border border-gray-500 p-1'>
                      {typeof cell === 'object'
                        ? cell instanceof Array
                          ? `[${cell.length} elements]`
                          : `{${Object.keys(cell).length} Fields}`
                        : typeof cell === 'boolean'
                        ? `${cell}`
                        : cell}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    return null
  }
}

export default Table
