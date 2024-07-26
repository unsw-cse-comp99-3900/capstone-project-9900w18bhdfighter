import { Flex, List, Tooltip, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import route from '../../../constant/route'
import { Group } from '../../../types/group'

type Props = {
  item: Group
}
export const CustomTitle = styled(Flex)`
  font-weight: 500;
`
const GroupsListItem: React.FC<Props> = ({ item }) => {
  return (
    <List.Item.Meta
      title={
        <Flex vertical>
          <Typography.Text ellipsis>
            <Link to={`${route.GROUPS}/${item.groupId}`}>{item.groupName}</Link>
          </Typography.Text>
          <CustomTitle>
            <Typography.Text
              style={{
                fontSize: '0.85rem',
              }}
            >
              ({item.groupMembers.length}/{item.maxMemberNum}) [
              {item.course.courseName}]
            </Typography.Text>
          </CustomTitle>
        </Flex>
      }
      description={
        <Tooltip title={item.groupDescription}>
          <Typography.Paragraph
            style={{
              marginBottom: 0,
            }}
            type="secondary"
            ellipsis={{ rows: 3 }}
          >
            {item.groupDescription}
          </Typography.Paragraph>
        </Tooltip>
      }
    />
  )
}

export default GroupsListItem
