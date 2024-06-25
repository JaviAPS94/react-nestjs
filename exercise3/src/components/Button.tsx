import { ReactNode } from "react"
import classNames from "classnames"
import React from "react"
import { GoSync } from "react-icons/go"

interface ButtonProps {
  children: ReactNode
  primary?: boolean
  error?: boolean
  loading?: boolean
}

function Button({ children, primary, error, loading, ...rest }: ButtonProps) {
  const classes = classNames(
    'flex items-center px-3 py-1.5 border h-8',
    {
      'opacity-80': loading,
      'border-blue-500 bg-blue-500 text-white': primary,
      'border-red-500 bg-red-500 text-white': error,
    },
  )

  return (
    <button {...rest} disabled={loading} className={classes}>
      {loading ? <GoSync className="animate-spin"></GoSync> : children}
    </button>
  )
}

export default Button
