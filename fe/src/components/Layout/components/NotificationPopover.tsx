import { Badge, Button, Popover } from 'antd'

import NotificationList from './NotificationList'

import { IoIosNotifications } from 'react-icons/io'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'
import NotificationContextProvider, {
  useNotificationContext,
} from '../../../context/NotificationContext'
import { createContext, useContext, useState } from 'react'

// import { useState } from 'react'
interface PopoverContextType {
  handleOpenChange: (_newOpen: boolean) => void
}
const PopoverContext = createContext<PopoverContextType>(
  {} as PopoverContextType
)
export const usePopoverContext = () => useContext(PopoverContext)
const _NotificationPopover = () => {
  const { unreadNotifications } = useNotificationContext()
  const { onWidth } = useGlobalTheme()
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  return (
    <PopoverContext.Provider value={{ handleOpenChange }}>
      <Popover
        open={open}
        autoAdjustOverflow
        placement={onWidth({
          sm: 'bottom',
          defaultValue: 'bottomLeft',
        })}
        overlayInnerStyle={{
          maxHeight: '30rem',
          overflowY: 'auto',
          paddingTop: 0,
        }}
        content={<NotificationList />}
        trigger="click"
        onOpenChange={handleOpenChange}
      >
        <Button
          style={{
            marginRight: '1rem',
          }}
          shape="circle"
          type="text"
        >
          <Badge size="small" count={unreadNotifications.length}>
            <IoIosNotifications size={'1.5rem'} />
          </Badge>
        </Button>
      </Popover>
    </PopoverContext.Provider>
  )
}

const NotificationPopover = () => (
  <NotificationContextProvider>
    <_NotificationPopover />
  </NotificationContextProvider>
)

export default NotificationPopover
