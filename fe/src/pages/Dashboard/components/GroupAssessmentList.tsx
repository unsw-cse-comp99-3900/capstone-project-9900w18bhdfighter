import { Flex, List } from 'antd'
import styled from 'styled-components'

import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
import GroupsListItem from './GroupListItem'
import { getThemeToken } from '../../../utils/styles'
import { getAllGroups, mapGroupDTOToGroup } from '../../../api/groupAPI'
import { Group } from '../../../types/group'
import GroupFilter from './GroupFilter'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _GroupsAssessmentList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const GroupsAssessmentList = ({ className = '' }: Props) => {
  const [list, setList] = useState<Group[]>([])
  const [filteredLists, setFilteredLists] = useState<Group[]>([])
  const { msg } = useGlobalComponentsContext()
  const toFetch = async () => {
    try {
      const res = await getAllGroups()
      const groups = res.data.map(mapGroupDTOToGroup)
      setList(groups)
      setFilteredLists(groups)
    } catch (e) {
      msg.err('Network error')
    }
  }
  useEffect(() => {
    toFetch()
  }, [msg])
  return (
    <Wrapper className={className}>
      <_GroupsAssessmentList
        bordered
        header={
          <Flex justify="space-between" align="center">
            Groups List
            <GroupFilter list={list} setFilteredLists={setFilteredLists} />
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              <LinkButton
                size="small"
                to={`${route.ASSESSMENT}/${(item as Group).groupId}`}
                key={(item as Group).groupId}
              >
                Mark
              </LinkButton>,
            ]}
          >
            <GroupsListItem item={item as Group} />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default GroupsAssessmentList
