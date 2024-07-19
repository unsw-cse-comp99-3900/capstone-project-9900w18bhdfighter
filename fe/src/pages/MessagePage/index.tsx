import { Flex } from 'antd'
import styled from 'styled-components'
import { getThemeColor, getThemeToken } from '../../utils/styles'
import _MessageSider from './components/MessageSider'

import { Outlet } from 'react-router-dom'

const Wrapper = styled(Flex)`
  padding: ${getThemeToken('paddingLG', 'px')};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Container = styled(Flex)`
  box-shadow: ${getThemeToken('boxShadow')};
  width: 100%;
  height: 100%;
`

const MsgSider = styled(_MessageSider)`
  padding: ${getThemeToken('paddingSM', 'px')};
  width: 18rem;
  overflow: auto;
  border-right: 1px solid ${getThemeColor('grayscalePalette', 5)};
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const _MessagePage = () => {
  return (
    <Wrapper>
      <Container>
        <MsgSider />
        <Outlet />
      </Container>
    </Wrapper>
  )
}

const MessagePage = () => {
  return <_MessagePage />
}

export default MessagePage
