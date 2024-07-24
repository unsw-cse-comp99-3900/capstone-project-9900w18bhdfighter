import React from 'react'
import { Flex, List, Typography } from 'antd'
import { Group } from '../../../types/group'
import styled from 'styled-components'

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
          <Typography.Text ellipsis>{item.groupName}</Typography.Text>
          <CustomTitle>
            <Typography.Text
              style={{
                fontSize: '0.85rem',
              }}
            >
              ({item.groupMembers.length}/{item.maxMemberNum})
            </Typography.Text>
          </CustomTitle>
        </Flex>
      }
      description={`${item.groupDescription} `}
    />
  )
}

export default GroupsListItem
