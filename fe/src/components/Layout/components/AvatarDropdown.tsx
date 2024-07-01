import { Dropdown, Flex, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'

import route from '../../../constant/route'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../context/AuthContext'

import Avatar from '../../Avatar'
import styled from 'styled-components'
import { getThemeColor } from '../../../utils/styles'

const DropdownHeader = styled(Menu)`
  cursor: default;
  padding: 0.5rem !important;
  background-color: ${getThemeColor('grayscalePalette', 1)};
  z-index: 1;
  box-shadow: none !important;
`
const AvatarDropdown = () => {
  const { usrInfo } = useAuthContext()

  const { firstName, lastName, email } = usrInfo || {
    firstName: '',
    lastName: '',
    email: '',
  }

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
    <Dropdown
      placement="bottomRight"
      menu={{ items }}
      dropdownRender={(menu) => {
        return (
          <Flex vertical>
            <DropdownHeader>
              <Typography.Text strong>Account</Typography.Text>
              <Flex>
                <Space
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                  }}
                >
                  <Avatar
                    style={{
                      cursor: 'default',
                    }}
                    firstName={firstName}
                    lastName={lastName}
                    emailForHashToColor={email}
                  />
                  <Flex vertical>
                    <Typography.Text strong>
                      {firstName} {lastName}
                    </Typography.Text>
                    <Typography.Text type="secondary">{email}</Typography.Text>
                  </Flex>
                </Space>
              </Flex>
            </DropdownHeader>
            {menu}
          </Flex>
        )
      }}
      trigger={['click']}
    >
      <Avatar
        firstName={firstName}
        lastName={lastName}
        emailForHashToColor={email}
      />
    </Dropdown>
  )
}

export default AvatarDropdown
