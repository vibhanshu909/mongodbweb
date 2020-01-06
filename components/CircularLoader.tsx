import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const CircularLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <>
      <span className={`spinMe ${className}`}>
        <FaSpinner />
      </span>
      <style jsx={true}>{`
        .spinMe {
          display: inline-block;
          animation-name: spin;
          animation-duration: 1s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

export default CircularLoader
