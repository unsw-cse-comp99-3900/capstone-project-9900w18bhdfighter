import React from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'
import route from '../../constant/route'

type Props = {
  usrId: number
} & Omit<LinkProps, 'to'>

const ProfileLink = ({ usrId, children, ...props }: Props) => {
  return (
    <Link {...props} to={`${route.PROFILE}/${usrId}`}>
      {children}
    </Link>
  )
}

export default ProfileLink
