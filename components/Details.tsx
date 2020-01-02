import React from 'react'
export const Details: React.FC<{
  title: string;
  data: any[];
  children: React.FC<{
    data: any;
  }>;
}> = ({ title, data, children: Children }) => {
  return (
    <details>
      <summary className='capitalize focus:outline-none focus:bg-gray-800 hover:bg-gray-800'>
        {title}
      </summary>
      {data.map((d, key) => (
        <div key={key} className='ml-2'>
          <Children data={d} />
        </div>
      ))}
      <style jsx={true}>{`
        details[open] > summary {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </details>
  )
}
