import React from 'react'

const Table: React.FC<{ data: any[] }> = ({ data }) => {
  if (data.length) {
    const headers = Object.keys(data[0])
    return (
      <table>
        <thead>
          {headers.map((heading, key) => (
            <th key={key}>{heading}</th>
          ))}
        </thead>
        <tbody>
          {data.map((row, key) => (
            <tr key={key}>
              {Object.values(row).map((cell, lkey) => (
                <td key={lkey}>
                  {typeof cell === 'object'
                    ? cell instanceof Array
                      ? cell.length
                      : (cell as any).$value
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <style jsx={true}>{`
          table {
            border: 1px solid white;
          }
          td,
          th {
            padding: 5px;
            border: 1px solid white;
          }
        `}</style>
      </table>
    )
  } else {
    return null
  }
}

export default Table
