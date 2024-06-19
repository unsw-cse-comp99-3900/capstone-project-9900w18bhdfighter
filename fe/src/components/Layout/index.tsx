import { Menu, Layout as _Layout } from 'antd'
import styled from 'styled-components'
import type { MenuProps } from 'antd'
import { Outlet } from 'react-router-dom'

const { Header, Footer, Sider, Content } = _Layout
const Wrapper = styled(_Layout)`
  height: 100vh;
`
const Main = styled(_Layout)``
const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}))
const Layout = () => {
  return (
    <Wrapper>
      <Header>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        ></Menu>
      </Header>
      <Main>
        <Sider>Sider</Sider>
        <_Layout>
          <Content>
            <Outlet />
          </Content>
          <Footer>Footer</Footer>
        </_Layout>
      </Main>
    </Wrapper>
  )
}

export default Layout
