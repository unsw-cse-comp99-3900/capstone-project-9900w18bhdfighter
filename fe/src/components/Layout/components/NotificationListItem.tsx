import { Button, Flex, List, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { TbPointFilled } from 'react-icons/tb'
import styled, { useTheme } from 'styled-components'
import { format } from 'timeago.js'
import { Notification } from '../../../types/notification'
import { getThemeColor, getThemeToken } from '../../../utils/styles'
const NotificationCard = styled(Flex)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0 ${getThemeToken('paddingXS', 'px')};
`

const ActionButton = styled(Button)`
  border-color: transparent;
`
const Item = styled(List.Item)`
  cursor: pointer;

  &:hover {
    background-color: ${getThemeColor('grayscalePalette', 2)};
  }
`
type Props = {
  notification: Notification
}
const NotificationListItem = ({ notification }: Props) => {
  const [borderColor, setBorderColor] = useState('transparent')
  const theme = useTheme()

  return (
    <Item
      onMouseEnter={() => {
        setBorderColor(theme.themeColor.grayscalePalette[10] || '')
      }}
      onMouseLeave={() => {
        setBorderColor('transparent')
      }}
      key={notification.notificationId}
      actions={[
        <Tooltip
          key={notification.notificationId}
          title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
        >
          <ActionButton
            style={{
              borderColor: borderColor,
            }}
            shape="circle"
            size="small"
          >
            {notification.isRead ? (
              ''
            ) : (
              <TbPointFilled
                style={{
                  color: theme.colorInfo,
                }}
              />
            )}
          </ActionButton>
        </Tooltip>,
      ]}
    >
      <NotificationCard>
        <Typography.Text
          style={{
            marginBottom: '0',
            fontSize: '0.85rem',
          }}
          strong
        >
          {notification.type === 'group'
            ? 'Group Activity'
            : 'Personal Activity'}
        </Typography.Text>
        <Typography.Paragraph
          style={{
            marginBottom: '0',
            fontSize: '0.85rem',
          }}
          ellipsis={{
            rows: 2,
            expandable: true,
          }}
        >
          {notification.message}
        </Typography.Paragraph>
        <Typography.Text
          style={{
            fontSize: '0.75rem',
          }}
          type="secondary"
        >
          {format(notification.createdAt, 'en_US')}
        </Typography.Text>
      </NotificationCard>
    </Item>
  )
}

export default NotificationListItem
