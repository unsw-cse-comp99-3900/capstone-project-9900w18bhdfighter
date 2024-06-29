import { Layout as _Layout } from 'antd'
import styled from 'styled-components'
import { Outlet } from 'react-router-dom'
import SiderNav from './components/SiderNav'
import HeaderNav from './components/HedaerNav'

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
  )
}

export default Layout
