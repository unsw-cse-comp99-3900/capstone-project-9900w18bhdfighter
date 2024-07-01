import { Avatar as _Avatar } from 'antd'
import type { AvatarProps } from 'antd/es/avatar'
import { shortName, stringToColorPair } from '../../utils/parse'
import styled from 'styled-components'

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
  return (
    <Wrapper
      {...props}
      style={{
        verticalAlign: 'middle',
        backgroundColor: bgColor,
        color: color,
<<<<<<< HEAD
=======
        ...props.style,
>>>>>>> 611021aaf88104bacc9b8f80151c444a7c13fb19
      }}
    >
      {shortName(firstName, lastName)}
    </Wrapper>
  )
}

export default Avatar
