import React from 'react'

export interface IButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'warning'
}

export const Button: React.FC<IButtonProps> = props => {
  const { color = 'primary', className, children, ...rest } = props
  let bgColor = ''
  switch (color) {
    case 'primary':
      bgColor = 'bg-blue-500 hover:bg-blue-700'
      break

    case 'secondary':
      bgColor = 'bg-pink-500 hover:bg-pink-700'
      break
    case 'success':
      bgColor = 'bg-green-500 hover:bg-green-700'
      break

    case 'info':
      bgColor = 'bg-teal-500 hover:bg-teal-700'
      break

    case 'warning':
      bgColor = 'bg-yellow-500 hover:bg-yellow-700'
      break
    case 'danger':
      bgColor = 'bg-red-500 hover:bg-red-700'
      break

    default:
      break
  }
  return (
    <button
      {...rest}
      className={`${bgColor} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
    >
      {children}
    </button>
  )
}
