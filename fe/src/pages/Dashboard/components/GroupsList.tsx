import { Flex, List } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import LinkButton from '../../../components/LinkButton'
import { useEffect, useState } from 'react'
import { DataType } from './ProjectsListItem'
import GroupsListItem from './GroupListItem'
import Filter from './Filter'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const ProjectsList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`
const count = 30
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`
const GroupsList = ({ className = '' }: Props) => {
  const [list, setList] = useState<DataType[]>([])
  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.results)

        setList(res.results)
      })
  }, [])
  return (
    <Wrapper className={className}>
      <ProjectsList
        header={
          <Flex justify="space-between" align="center">
            Groups List
            <Filter />
          </Flex>
        }
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
            <GroupsListItem item={item as DataType} />
          </List.Item>
        )}
      ></ProjectsList>
    </Wrapper>
  )
}

export default GroupsList
