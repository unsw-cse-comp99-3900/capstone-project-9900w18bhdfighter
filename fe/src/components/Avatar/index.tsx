import { Avatar as _Avatar } from 'antd'
import type { AvatarProps } from 'antd/es/avatar'
import { shortName, stringToColorPair } from '../../utils/parse'
import styled from 'styled-components'
import { useMemo } from 'react'

type Props = {
  emailForHashToColor: string
  firstName: string
  lastName: string
} & AvatarProps

const Wrapper = styled(_Avatar)`
  cursor: pointer;
  width: 3rem;
  height: 3rem;
  font-weight: bold;

  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`
const Avatar = ({
  emailForHashToColor,
  firstName,
  lastName,
  ...props
}: Props) => {
  const [bgColor, color] = stringToColorPair(emailForHashToColor)
  const renderName = useMemo(
    () => shortName(firstName, lastName),
    [firstName, lastName]
  )
  return (
    <Wrapper
      {...props}
      style={{
        verticalAlign: 'middle',
        backgroundColor: bgColor,
        color: color,
        ...props.style,
      }}
    >
      {renderName}
    </Wrapper>
  )
}

export default Avatar
