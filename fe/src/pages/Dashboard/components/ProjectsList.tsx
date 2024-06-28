import { Flex, List } from 'antd'
import styled from 'styled-components'

import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
import ProjectsListItem, { DataType } from './ProjectsListItem'
import { getThemeToken } from '../../../utils/styles'
import Filter from './Filter'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _ProjectsList = styled(List)`
  height: 75vh;

  overflow-y: auto;
`
const count = 15
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`
const ProjectsList = ({ className = '' }: Props) => {
  const [list, setList] = useState<DataType[]>([])
  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setList(res.results)
      })
  }, [])
  return (
    <Wrapper className={className}>
      <_ProjectsList
        bordered
        header={
          <Flex justify="space-between" align="center">
            Projects List
            <Filter />
          </Flex>
        }
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <LinkButton to="" key="list-loadmore-more">
                More
              </LinkButton>,
            ]}
          >
            <ProjectsListItem item={item as DataType} />
          </List.Item>
        )}
      ></_ProjectsList>
    </Wrapper>
  )
}

export default ProjectsList
