import { Layout as _Layout } from 'antd'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import SiderNav from './components/SiderNav'
import HeaderNav from './components/HedaerNav'

const { Content } = _Layout
const Wrapper = styled(_Layout)`
  height: 100vh;
`
const Main = styled(_Layout)``

const Layout = () => {
  return (
    <Wrapper>
      <HeaderNav />
      <Main>
        <SiderNav />
        <_Layout>
          <Content>
            <Outlet />
          </Content>
        </_Layout>
      </Main>
    </Wrapper>
  )
}

export default Layout
