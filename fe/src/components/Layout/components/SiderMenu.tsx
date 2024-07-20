import { useLocation, useNavigate } from 'react-router-dom'
import { MdChat } from 'react-icons/md'
import { FaUserGroup } from 'react-icons/fa6'
import { role } from '../../../constant/role'
import { IoSettings } from 'react-icons/io5'
import { AiFillHome, AiFillProject } from 'react-icons/ai'
import { Badge, Menu } from 'antd'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'
import { useMessageContext } from '../../../context/MessageContext'
import route from '../../../constant/route'

type Props = {
  setCollapsed: Dispatch<SetStateAction<boolean>>
}
const SiderMenu = ({ setCollapsed }: Props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedKey, setSelectedKey] = useState(route.DASHBOARD)
  const { isInRoleRange } = useAuthContext()
  const { unreadMsgs } = useMessageContext()
  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location.pathname])

  return (
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
            display: isInRoleRange([role.ADMIN, role.CORD, role.CLIENT])
              ? 'block'
              : 'none',
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
            display: isInRoleRange([role.ADMIN]) ? 'block' : 'none',
          },
        },
      ]}
    />
  )
}

export default SiderMenu
