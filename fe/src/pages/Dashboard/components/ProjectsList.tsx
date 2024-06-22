import { Flex, List } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
import ProjectsListItem, { DataType } from './ProjectsListItem'
import Filter from './Filter'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const Header = styled(Flex)`
  padding: ${getThemeToken('paddingMD', 'px')};

  height: 2rem;
`
const _ProjectsList = styled(List)`
  padding: 0;
  margin: 0;
  overflow: auto;
  height: calc(100% - 2rem);
`
const count = 30
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
      <Header justify="space-between" align="center">
        Projects List
        <Filter />
      </Header>
      <_ProjectsList
        bordered
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
