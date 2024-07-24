import { Button, Flex, List, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { TbPointFilled } from 'react-icons/tb'
import styled, { useTheme } from 'styled-components'
import { format } from 'timeago.js'
import { Notification } from '../../../types/notification'
import { getThemeColor, getThemeToken } from '../../../utils/styles'
import { useNotificationContext } from '../../../context/NotificationContext'
import route from '../../../constant/route'
import { Link } from 'react-router-dom'
import { usePopoverContext } from './NotificationPopover'
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
const LinkParagraph = styled(Typography.Paragraph)`
  margin-bottom: 0;
  font-size: 0.85rem;
  &:hover {
    text-decoration: underline;
  }
`
const Item = styled(List.Item)`
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
  const { markAs } = useNotificationContext()
  const { handleOpenChange } = usePopoverContext()

  const notificationTypeDict = {
    group: {
      title: 'Group Activity',
      link: `${route.GROUPS}/${notification.additionalData?.objectId}`,
    },
    project: {
      title: 'Project Activity',
      link: `${route.PROJECTS}/${notification.additionalData?.objectId}`,
    },
    personal: {
      title: 'Personal Activity',
      link: `${route.PROFILE}`,
    },
  }
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
            onClick={() => {
              markAs(notification.notificationId, {
                IsRead: !notification.isRead,
              })
            }}
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
          {notificationTypeDict[notification.type].title}
        </Typography.Text>
        <Link
          onClick={() => {
            handleOpenChange(false)
          }}
          to={notificationTypeDict[notification.type].link}
        >
          <LinkParagraph
            ellipsis={{
              rows: 2,
              expandable: true,
            }}
          >
            {notification.message}
          </LinkParagraph>
        </Link>
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
