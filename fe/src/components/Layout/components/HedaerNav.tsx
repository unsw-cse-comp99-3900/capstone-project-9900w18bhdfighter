import { Flex, Image } from 'antd'

import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import logo from '../../../assets/logo.png'
import AvatarDropdown from './AvatarDropdown'
import NotificationPopover from './NotificationPopover'
import { Link } from 'react-router-dom'
import route from '../../../constant/route'

const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 3)};
`

const OperationsGroup = styled(Flex)`
  align-items: center;
`
const Img = styled(Image)`
  height: 2.75rem !important;
`

const HeaderNav = () => {
  return (
    <Wrapper>
      <Link to={`${route.DASHBOARD}`}>
        <Img preview={false} sizes="small" src={logo} alt="logo" />
      </Link>

      <OperationsGroup>
        <NotificationPopover></NotificationPopover>
        <AvatarDropdown />
      </OperationsGroup>
    </Wrapper>
  )
}

export default HeaderNav
