import { Flex, List, Popover } from 'antd'
import styled from 'styled-components'

import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { getAllGroups, mapGroupDTOToGroup } from '../../../api/groupAPI'
import DebounceSimpleSearcher from '../../../components/DebounceSimpleSearcher'
import LinkButton from '../../../components/LinkButton'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { Group } from '../../../types/group'
import { getThemeToken } from '../../../utils/styles'
import GroupFilter from './GroupFilter'
import GroupsListItem from './GroupListItem'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _GroupsList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const GroupsList = ({ className = '' }: Props) => {
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
      console.log(e)

      msg.err('Network error')
    }
  }
  useEffect(() => {
    toFetch()
  }, [msg])
  const handleSearchChange = (val: string) => {
    setFilteredLists(
      list.filter((item) => {
        return (item as Group).groupName
          .toLowerCase()
          .includes(val.toLowerCase())
      })
    )
  }

  return (
    <Wrapper className={className}>
      <_GroupsList
        bordered
        header={
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={10}>
              Groups List
              <Popover
                trigger={['click']}
                placement="top"
                content={
                  <DebounceSimpleSearcher
                    placeholder="Search by group name"
                    handleChange={handleSearchChange}
                  />
                }
              >
                <FaSearch style={{ cursor: 'pointer' }} />
              </Popover>
            </Flex>
            <GroupFilter list={list} setFilteredLists={setFilteredLists} />
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              <LinkButton
                size="small"
                to={`${route.GROUPS}/${(item as Group).groupId}`}
                key={(item as Group).groupId}
              >
                More
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

export default GroupsList
