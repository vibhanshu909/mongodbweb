import React from 'react'
import { Button, IButtonProps } from './Button'
import CircularLoader from './CircularLoader'

interface ILoadingButton {
  loading: boolean
}
export const LoadingButton: React.FC<IButtonProps & ILoadingButton> = props => {
  const { loading, className, children, ...rest } = props
  return (
    <Button
      {...rest}
      disabled={loading}
      className={`${loading && 'opacity-50 cursor-not-allowed'} ${className}`}
    >
      {loading && <CircularLoader className='mr-2' />} {children}
    </Button>
  )
}
