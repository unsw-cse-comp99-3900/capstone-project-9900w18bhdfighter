import React from 'react'
import { List } from 'antd'
import { Allocation } from '../../../types/proj_grp'

type Props = {
  item: Allocation
}

const AllocationListItem: React.FC<Props> = ({ item }) => {
  return (
    <List.Item.Meta
      title={`${item.projectName} - ${item.groupName}`}
      description={`Description: ${item.groupDescription || 'No description'}`}
    />
  )
}

export default AllocationListItem
