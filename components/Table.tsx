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
const Table: React.FC<{ data: any[] }> = ({ data }) => {
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
            <tr className=''>
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
