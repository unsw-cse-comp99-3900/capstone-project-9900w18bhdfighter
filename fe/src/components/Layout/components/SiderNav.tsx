import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { AiFillHome, AiFillProject } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import route from '../../../constant/route'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'

import { FaUserGroup } from 'react-icons/fa6'

import { IoSettings } from 'react-icons/io5'
const _Sider = styled(Sider)`
  padding-top: ${getThemeToken('paddingMD', 'px')};
`

const SiderNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])
  return (
    <_Sider style={{}} collapsible defaultCollapsed>
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
          },
          {
            key: route.TEAMS,
            icon: <FaUserGroup />,
            label: 'Teams',
          },

          {
            key: route.ADMIN,
            icon: <IoSettings />,
            label: 'Management',
          },
        ]}
      />
    </_Sider>
  )
}

export default SiderNav
