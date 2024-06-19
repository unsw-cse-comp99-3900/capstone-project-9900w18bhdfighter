import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import type { NavigateOptions } from 'react-router-dom'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  to: string
  options?: NavigateOptions | undefined
} & ButtonProps
/**
  Just an extension of the AntD Button, which adds the ability to navigate to a different page when clicked.
 */
const LinkButton = ({ to, options = undefined, ...props }: Props) => {
  const navigate = useNavigate()

  return <Button {...props} onClick={() => navigate(to, options)} />
}

export default LinkButton
