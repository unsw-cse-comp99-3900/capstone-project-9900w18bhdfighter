import { Button, Dropdown, Flex, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'
import route from '../../../constant/route'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../context/AuthContext'
import { shortName } from '../../../utils/parse'
const Wrapper = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
  background-color: ${getThemeColor('highlight')};
  border: none;
  font-weight: bold;
  margin: 0 1rem;
  color: ${getThemeColor('primary')};
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

const HeaderNav = () => {
  const { usrInfo } = useAuthContext()
  const { firstName, lastName } = usrInfo || {}
  const { logout } = useAuthContext()
  const navigate = useNavigate()
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Link to={route.PROFILE}>My Profile</Link>,
    },
    {
      key: 'logout',
      label: (
        <Link
          to=""
          onClick={(e) => {
            e.preventDefault()
            logout(navigate)
          }}
          type="text"
        >
          Logout
        </Link>
      ),
      danger: true,
    },
  ]
  return (
    <Wrapper>
      <Logo to={route.DASHBOARD}>LOGO</Logo>
      <OperationsGroup>
        <Typography.Text>Notifications</Typography.Text>
        <Dropdown placement="topLeft" menu={{ items }} trigger={['hover']}>
          <Avatar>{shortName(firstName, lastName)}</Avatar>
        </Dropdown>
      </OperationsGroup>
    </Wrapper>
  )
}

export default HeaderNav
