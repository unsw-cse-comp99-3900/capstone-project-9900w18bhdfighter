import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { AiFillHome, AiFillProject } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import route from '../../../constant/route'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import { MdChat } from 'react-icons/md'
import { FaUserGroup } from 'react-icons/fa6'

import { IoSettings } from 'react-icons/io5'
import { useAuthContext } from '../../../context/AuthContext'
import { role } from '../../../constant/role'
const _Sider = styled(Sider)`
  padding-top: ${getThemeToken('paddingMD', 'px')};
`

const SiderNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  const { role: _role } = useAuthContext()
  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  const projectAccess = () => {
    return _role === role.ADMIN || _role === role.CORD || _role === role.CLIENT
  }
  return (
    <_Sider collapsible defaultCollapsed>
      <Menu
        defaultSelectedKeys={[route.DASHBOARD]}
        selectedKeys={[selectedKey]}
        onClick={(e) => {
          navigate(e.key)
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
            icon: <MdChat />,
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
  )
}

export default SiderNav
