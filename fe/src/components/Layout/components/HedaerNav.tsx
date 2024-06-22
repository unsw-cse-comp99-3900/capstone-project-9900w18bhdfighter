import { Button, Flex, Typography } from 'antd'
import { Header } from 'antd/es/layout/layout'

import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
`
const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 1rem;
`

const Avatar = styled(Button)`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-weight: bold;
  margin: 0 1rem;
  border-radius: 100%;
  border: 1px solid ${getThemeColor('grayscalePalette', 35)};
`

const OperationsGroup = styled(Flex)`
  align-items: center;
`
const HeaderNav = () => (
  <Wrapper>
    <Logo>Logo</Logo>
    <OperationsGroup>
      <Typography.Text>Notifications</Typography.Text>
      <Avatar>Avatar</Avatar>
    </OperationsGroup>
  </Wrapper>
)

export default HeaderNav
