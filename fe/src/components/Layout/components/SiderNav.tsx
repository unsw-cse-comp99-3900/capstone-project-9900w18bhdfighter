import { Badge, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Fragment, useEffect, useState } from 'react'
import { AiFillHome, AiFillProject } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import route from '../../../constant/route'
import styled, { useTheme } from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import { MdChat } from 'react-icons/md'
import { FaUserGroup } from 'react-icons/fa6'

import { IoSettings } from 'react-icons/io5'
import { useAuthContext } from '../../../context/AuthContext'
import { role } from '../../../constant/role'
import { useMessageContext } from '../../../context/MessageContext'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'
const _Sider = styled(Sider)`
  padding-top: ${getThemeToken('paddingMD', 'px')};
`

const Mask = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`

const SiderNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  const { role: _role } = useAuthContext()
  const { unreadMsgs } = useMessageContext()
  const { onWidth } = useGlobalTheme()
  const [collapsed, setCollapsed] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  const projectAccess = () => {
    return _role === role.ADMIN || _role === role.CORD || _role === role.CLIENT
  }
  return (
    <Fragment>
      <Mask
        visible={!collapsed}
        onClick={() => {
          setCollapsed(true)
        }}
      />

      <_Sider
        collapsible
        defaultCollapsed
        collapsed={collapsed}
        width={onWidth({
          sm: '70%',
          defaultValue: undefined,
        })}
        collapsedWidth={onWidth({
          sm: 0,
          defaultValue: undefined,
        })}
        zeroWidthTriggerStyle={{
          height: 25,
          width: 25,
          marginRight: 15,
          top: '10%',
          backgroundColor: theme.themeColor.highlight,
        }}
        onCollapse={() => {
          setCollapsed(!collapsed)
        }}
        style={{
          position: onWidth({
            sm: 'fixed',
            defaultValue: 'unset',
          }),
          zIndex: 2,
          height: '100%',
        }}
      >
        <Menu
          defaultSelectedKeys={[route.DASHBOARD]}
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            navigate(e.key)
            setCollapsed(true)
          }}
          items={[
            {
              key: route.DASHBOARD,
              icon: <AiFillHome />,
              label: 'Dashboard',
            },
            {
              key: route.PROJECTS,
              icon: <AiFillProject />,
              label: 'Projects',
              style: {
                display: projectAccess() ? 'block' : 'none',
              },
            },
            {
              key: route.TEAMS,
              icon: <FaUserGroup />,
              label: 'Teams',
            },

            {
              key: route.MESSAGE,
              icon: (
                <Badge
                  style={{
                    maxWidth: 28,
                    minWidth: 14,
                  }}
                  offset={[5, 0]}
                  count={unreadMsgs}
                  size="small"
                  overflowCount={10}
                >
                  <MdChat />
                </Badge>
              ),
              label: 'Chat',
            },
            {
              key: route.ADMIN,
              icon: <IoSettings />,
              label: 'Management',
              style: {
                display: _role === role.ADMIN ? 'block' : 'none',
              },
            },
          ]}
        />
      </_Sider>
    </Fragment>
  )
}

export default SiderNav
