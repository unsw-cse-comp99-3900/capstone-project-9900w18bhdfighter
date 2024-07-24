import { createContext, useContext, useEffect, useState } from 'react'
import { Notification, NotificationStatus } from '../../types/notification'
import {
  changeNotificationStatus,
  getMyNotifications,
  mapNotificationDTOToNotification,
} from '../../api/notificationAPI'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { errHandler } from '../../utils/parse'

interface NotificationContextType {
  notifications: Notification[] | null
  setNotifications: React.Dispatch<React.SetStateAction<Notification[] | null>>
  fetchNotification: () => Promise<void>
  unreadNotifications: Notification[]
  markAs: (
    _notificationId: number,
    _status: NotificationStatus
  ) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType
)

export const useNotificationContext = () => useContext(NotificationContext)

const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[] | null>(
    null
  )
  const unreadNotifications = notifications?.filter((n) => !n.isRead) || []
  const { msg } = useGlobalComponentsContext()
  const fetchNotification = async () => {
    try {
      const res = await getMyNotifications()
      const _notifications = res.data.map(mapNotificationDTOToNotification)
      //sort by created time
      _notifications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      setNotifications(_notifications)
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const markAs = async (
    notificationId: number | string,
    status: NotificationStatus
  ) => {
    try {
      await changeNotificationStatus(notificationId, status)
      fetchNotification()
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        unreadNotifications?.map((n) =>
          changeNotificationStatus(n.notificationId, {
            IsRead: true,
          })
        ) || []
      )
      fetchNotification()
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  useEffect(() => {
    fetchNotification()
    const interval = setInterval(() => {
      fetchNotification()
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  const ctx = {
    notifications,
    setNotifications,
    fetchNotification,
    unreadNotifications,
    markAs,
    markAllAsRead,
  }
  return (
    <NotificationContext.Provider value={ctx}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContextProvider
