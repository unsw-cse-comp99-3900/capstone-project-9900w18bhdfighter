import { Flex, List, Space, Switch, Typography } from 'antd'

import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import styled, { useTheme } from 'styled-components'
import { useState } from 'react'
import NotificationListItem from './NotificationListItem'
import { getThemeColor } from '../../../utils/styles'
import { useNotificationContext } from '../../../context/NotificationContext'

const Wrapper = styled(Flex)`
  width: 20rem;

  padding: 0;
`

const ListHeader = styled(Flex)`
  padding: 0.5rem;
  padding-top: 1rem;
  margin-top: 0;
`
const ListSubHeader = styled(Flex)`
  padding: 0.5rem;
  position: sticky;
  top: 0;
  background-color: ${getThemeColor('basicBg')};
  z-index: 1;
  justify-content: space-between;
  border-bottom: 1px solid ${getThemeColor('grayscalePalette', 5)};
`
const SwitchWrapper = styled(Space)`
  font-size: 0.75rem;
  margin-left: auto;
  align-items: center;
`

const NotificationList = () => {
  const theme = useTheme()
  const [onlyUnread, setOnlyUnread] = useState(false)
  const { notifications, markAllAsRead } = useNotificationContext()
  const filteredNotifications =
    notifications?.filter((n) => !onlyUnread || n.isRead === false) || []
  const unreadCount =
    notifications?.filter((n) => n.isRead === false).length || 0
  return (
    <Wrapper vertical>
      <ListHeader>
        <Typography.Title level={5}>Notifications</Typography.Title>
        <SwitchWrapper>
          Show only unread
          <Switch
            defaultChecked={onlyUnread}
            onChange={(checked) => {
              setOnlyUnread(checked)
            }}
            size="small"
            style={{
              backgroundColor: onlyUnread
                ? theme.colorSuccess
                : theme.themeColor.primary,
            }}
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </SwitchWrapper>
      </ListHeader>
      <ListSubHeader>
        <Typography.Text
          style={{
            fontSize: '0.75rem',
          }}
          type="secondary"
        >
          {notifications?.length} notifications in the last 30 days
        </Typography.Text>
        {unreadCount ? (
          <Typography.Link
            onClick={() => {
              markAllAsRead()
            }}
            style={{
              fontSize: '0.75rem',
            }}
          >
            Mark all as read
          </Typography.Link>
        ) : null}
      </ListSubHeader>
      <List
        dataSource={filteredNotifications}
        renderItem={(notification) => (
          <NotificationListItem
            key={notification.notificationId}
            notification={notification}
          />
        )}
      ></List>
    </Wrapper>
  )
}

export default NotificationList
