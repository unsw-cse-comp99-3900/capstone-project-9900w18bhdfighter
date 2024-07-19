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
import type { MenuProps } from 'antd'
import api from '../../../api/config'
const _Sider = styled(Sider)`
  padding-top: ${getThemeToken('paddingMD', 'px')};
`

const SiderNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  const { role: _role, usrInfo } = useAuthContext() // 假设 usrInfo 包含用户信息
  const [groupId, setGroupId] = useState<string | null>(null)

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const fetchUserGroup = async () => {
      if (usrInfo?.id) {
        try {
          const response = await api.get(`/api/users/${usrInfo.id}`)
          console.log('sidebar', response)
          const userGroup = response.data
          if (userGroup && userGroup.length > 0) {
            setGroupId(userGroup[0].id) // 假设用户组数组的第一个元素包含所需的组 ID
          }
        } catch (error) {
          console.error('Failed to fetch user group:', error)
        }
      }
    }

    fetchUserGroup()
  }, [usrInfo])

  const projectAccess = () => {
    return _role === role.ADMIN || _role === role.CORD || _role === role.CLIENT
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === route.TEAMS && _role === 1 && groupId) {
      navigate(`${route.GROUPS}/${groupId}`)
    } else {
      navigate(e.key)
    }
  }

  return (
    <_Sider collapsible defaultCollapsed>
      <Menu
        defaultSelectedKeys={[route.DASHBOARD]}
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
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
