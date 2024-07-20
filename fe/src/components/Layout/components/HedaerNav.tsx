import { Flex } from 'antd'

import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import route from '../../../constant/route'

import LinkButton from '../../LinkButton'
import AvatarDropdown from './AvatarDropdown'
import NotificationPopover from './NotificationPopover'

const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 3)};
`

const Logo = styled(LinkButton)`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-weight: bold;
  color: ${getThemeColor('primary')};
`

const OperationsGroup = styled(Flex)`
  align-items: center;
`

const HeaderNav = () => {
  return (
    <Wrapper>
      <Logo to={route.DASHBOARD}>LOGO</Logo>
      <OperationsGroup>
        <NotificationPopover></NotificationPopover>
        <AvatarDropdown />
      </OperationsGroup>
    </Wrapper>
  )
}

export default HeaderNav
