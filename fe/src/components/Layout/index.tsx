import { Layout as _Layout } from 'antd'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import SiderNav from './components/SiderNav'
import HeaderNav from './components/HedaerNav'
import MessageContextProvider from '../../context/MessageContext'
import route from '../../constant/route'

const { Content } = _Layout
const Wrapper = styled(_Layout)`
  height: 100vh;
`
const Main = styled(_Layout)`
  height: 100%;
`

const _Content = styled(Content)`
  overflow: auto;
`
const Layout = () => {
  return (
    <MessageContextProvider msgRoute={route.MESSAGE}>
      <Wrapper>
        <HeaderNav />
        <Main>
          <SiderNav />
          <_Layout>
            <_Content>
              <Outlet />
            </_Content>
          </_Layout>
        </Main>
      </Wrapper>
    </MessageContextProvider>
  )
}

export default Layout
