import { Flex } from 'antd'
import styled from 'styled-components'
import { getThemeColor, getThemeToken } from '../../utils/styles'
import _MessageSider from './components/MessageSider'

import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useMessageContext } from '../../context/MessageContext'

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
  position: relative;
`

const MsgSider = styled(_MessageSider)`
  border: 1px solid ${getThemeColor('grayscalePalette', 2)};

  height: 100%;
  flex-direction: column;
  align-items: center;
`
const _MessagePage = () => {
  const { getAllGroupContacts } = useMessageContext()
  useEffect(() => {
    getAllGroupContacts()
  }, [])
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
