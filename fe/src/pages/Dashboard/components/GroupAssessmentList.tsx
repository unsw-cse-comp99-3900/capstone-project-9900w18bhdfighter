import { Flex, List } from 'antd'
import styled from 'styled-components'

import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
// import GroupsListItem from './GroupListItem'
import GroupsAssessmentListItem from './GroupAssessmentItem'
import { getThemeToken } from '../../../utils/styles'
import { getAllGroups, mapGroupDTOToGroup } from '../../../api/groupAPI'
import { Group } from '../../../types/group'
import GroupFilter from './GroupFilter'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useGlobalConstantContext } from '../../../context/GlobalConstantContext'

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
  const { isDueProject } = useGlobalConstantContext()

  const toFetch = async () => {
    try {
      const res = await getAllGroups()
      const groups = res.data.map(mapGroupDTOToGroup)
      console.log('Due:', isDueProject)
      setList(groups)
      setFilteredLists(groups)
    } catch (e) {
      console.log(e)

      msg.err('Network error')
    }
  }
  useEffect(() => {
    toFetch()
    console.log('Due:', isDueProject)
  }, [msg])
  return (
    <Wrapper className={className}>
      <_GroupsAssessmentList
        bordered
        header={
          <Flex justify="space-between" align="center">
            Groups Assessment List
            <GroupFilter list={list} setFilteredLists={setFilteredLists} />
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              // only due project/group can mark
              !isDueProject && (
                <LinkButton
                  size="small"
                  to={`${route.ASSESSMENT}/${(item as Group).groupId}`}
                  key={(item as Group).groupId}
                >
                  Mark
                </LinkButton>
              ),
            ].filter(Boolean)}
          >
            <GroupsAssessmentListItem item={item as Group} />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default GroupsAssessmentList
