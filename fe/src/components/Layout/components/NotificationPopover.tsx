import { Badge, Button, Popover } from 'antd'

import NotificationList from './NotificationList'

import { IoIosNotifications } from 'react-icons/io'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'
import NotificationContextProvider, {
  useNotificationContext,
} from '../../../context/NotificationContext'

const _NotificationPopover = () => {
  const { unreadNotifications } = useNotificationContext()
  const { onWidth } = useGlobalTheme()

  return (
    <Popover
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
  )
}

const NotificationPopover = () => (
  <NotificationContextProvider>
    <_NotificationPopover />
  </NotificationContextProvider>
)

export default NotificationPopover
