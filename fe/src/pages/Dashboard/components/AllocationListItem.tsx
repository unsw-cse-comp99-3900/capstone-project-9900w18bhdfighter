import { Collapse, List, Typography } from 'antd'

import { CollapseProps } from 'antd/lib'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import route from '../../../constant/route'
import { AllocationGrouped } from './AllocationList'

type Props = {
  item: AllocationGrouped
}
const _Collapse = styled(Collapse)`
  flex: 1;
`

const AllocationListItem: React.FC<Props> = ({ item }) => {
  const items: CollapseProps['items'] = [
    {
      key: item.projectId,
      label: item.projectName,
      children: (
        <List
          size="small"
          style={{
            padding: 0,
          }}
        >
          {item.group.map((group) => (
            <List.Item key={group.groupId}>
              <Link to={`${route.GROUPS}/${group.groupId}`}>
                <Typography.Link>{group.groupName}</Typography.Link>
              </Link>
            </List.Item>
          ))}
        </List>
      ),
      style: { padding: 0 },
    },
  ]

  return <_Collapse ghost bordered={false} items={items}></_Collapse>
}

export default AllocationListItem
