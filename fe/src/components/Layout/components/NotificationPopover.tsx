import { Badge, Button, Popover } from 'antd'

import React, { useEffect, useState } from 'react'
import NotificationList from './NotificationList'
import { errHandler } from '../../../utils/parse'
import {
  getMyNotifications,
  mapNotificationDTOToNotification,
} from '../../../api/notificationAPI'
import { Notification } from '../../../types/notification'
import { IoIosNotifications } from 'react-icons/io'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'

const NotificationPopover = () => {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  )
  const { onWidth } = useGlobalTheme()
  const fetchNotification = async () => {
    const res = await getMyNotifications()
    const _notifications = res.data.map(mapNotificationDTOToNotification)
    //sort by created time
    _notifications.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    setNotifications(_notifications)
  }
  useEffect(() => {
    try {
      fetchNotification()
    } catch (e) {
      errHandler(
        e,
        (str) => console.log(str),
        (str) => console.log(str)
      )
    }
  }, [])

  const unreadNotifications = notifications?.filter((n) => !n.isRead) || []
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
      content={<NotificationList notifications={notifications} />}
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

export default NotificationPopover
