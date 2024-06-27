import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import route from '../../../constant/route'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'

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
            icon: <AiFillHome />,
            label: 'Projects',
          },
          {
            key: route.TEAMS,
            icon: <AiFillHome />,
            label: 'Teams',
          },

          {
            key: route.ADMIN,
            icon: <AiFillHome />,
            label: 'Management',
          },
        ]}
      />
    </_Sider>
  )
}

export default SiderNav
