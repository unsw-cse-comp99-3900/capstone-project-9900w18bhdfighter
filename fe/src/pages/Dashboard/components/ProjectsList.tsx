import { Flex, List } from 'antd'
import styled from 'styled-components'

import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
import ProjectsListItem from './ProjectsListItem'
import { getThemeToken } from '../../../utils/styles'
import Filter from './Filter'
import { getAllProjects, mapProjectDTOToProject } from '../../../api/projectAPI'
import { Project } from '../../../types/proj'

import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _ProjectsList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const ProjectsList = ({ className = '' }: Props) => {
  const [list, setList] = useState<Project[]>([])
  const [filteredLists, setFilteredLists] = useState<Project[]>([])
  const { msg } = useGlobalComponentsContext()
  useEffect(() => {
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
  }, [])
  return (
    <Wrapper className={className}>
      <_ProjectsList
        bordered
        header={
          <Flex justify="space-between" align="center">
            Projects List
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
