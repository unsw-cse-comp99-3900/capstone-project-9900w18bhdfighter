import { Flex, List, Popover } from 'antd'
import styled from 'styled-components'

import { useEffect, useState } from 'react'
import { getAllProjects, mapProjectDTOToProject } from '../../../api/projectAPI'
import LinkButton from '../../../components/LinkButton'
import { Project } from '../../../types/proj'
import { getThemeToken } from '../../../utils/styles'
import ProjectsListItem from './ProjectsListItem'

import { FaSearch } from 'react-icons/fa'
import DebounceSimpleSearcher from '../../../components/DebounceSimpleSearcher'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import Filter from './Filter'

type Props = {
  className?: string
  reRender: React.MutableRefObject<number>
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _ProjectsList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const ProjectsList = ({ className = '', reRender }: Props) => {
  const [list, setList] = useState<Project[]>([])
  const [filteredLists, setFilteredLists] = useState<Project[]>([])
  const { msg } = useGlobalComponentsContext()
  useEffect(() => {
    console.log('reRender', reRender.current)

    const toFetch = async () => {
      try {
        const res = await getAllProjects()
        setList(res.data.map(mapProjectDTOToProject))
        setFilteredLists(res.data.map(mapProjectDTOToProject))
      } catch (e) {
        msg.err('Network error')
      }
    }
    toFetch()
  }, [reRender.current])
  const handleSearchChange = (val: string) => {
    setFilteredLists(
      list.filter((item) => {
        return (item as Project).name.toLowerCase().includes(val.toLowerCase())
      })
    )
  }
  return (
    <Wrapper className={className}>
      <_ProjectsList
        bordered
        header={
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={10}>
              Projects List
              <Popover
                trigger={['click']}
                placement="top"
                content={
                  <DebounceSimpleSearcher
                    placeholder="Search by project name"
                    handleChange={handleSearchChange}
                  />
                }
              >
                <FaSearch style={{ cursor: 'pointer' }} />
              </Popover>
            </Flex>

            <Filter list={list} setFilteredLists={setFilteredLists} />
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              <LinkButton
                size="small"
                to={`${route.PROJECTS}/${(item as Project).id}`}
                key={(item as Project).id}
              >
                More
              </LinkButton>,
            ]}
          >
            <ProjectsListItem item={item as Project} />
          </List.Item>
        )}
      ></_ProjectsList>
    </Wrapper>
  )
}

export default ProjectsList
