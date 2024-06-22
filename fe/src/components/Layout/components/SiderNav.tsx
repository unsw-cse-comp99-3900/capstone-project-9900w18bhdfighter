import { Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { useLocation, useNavigate } from 'react-router-dom'
import route from '../../../constant/route'

const SiderNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])
  return (
    <Sider>
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
        ]}
      />
    </Sider>
  )
}

export default SiderNav
