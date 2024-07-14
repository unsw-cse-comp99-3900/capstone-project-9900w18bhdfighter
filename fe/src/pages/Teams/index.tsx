import { Button, Divider, Flex, Typography, Card } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import NewGroupModal from './components/NewGroupDetailModal'
import GroupDetailModal from './components/GroupDetailModal'
import { GroupCreate, Group } from '../../types/grp'
import GroupContextProvider, {
  useGroupContext,
} from '../../context/GroupContext'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const Header = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`

const CardContainer = styled(Flex)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${getThemeToken('paddingMD', 'px')};
  margin-top: ${getThemeToken('paddingLG', 'px')};
`

// 默认数据
const defaultGroups: Group[] = [
  {
    id: 1,
    name: 'Group 1',
    description: 'This is group 1 description',
    owner: 'owner1@example.com',
  },
  {
    id: 2,
    name: 'Group 2',
    description: 'This is group 2 description',
    owner: 'owner2@example.com',
  },
  {
    id: 3,
    name: 'Group 3',
    description: 'This is group 3 description',
    owner: 'owner3@example.com',
  },
]

const _Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Partial<Group> | null>(
    null
  )
  const { createGroup } = useGroupContext()

  const handleOk = async (groupCreateDto: GroupCreate) => {
    createGroup(groupCreateDto)
    setIsModalOpen(false)
    // 此处可以添加获取最新组数据的逻辑
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleCardClick = (group: Group) => {
    setSelectedGroup(group)
  }

  const handleDetailModalClose = () => {
    setSelectedGroup(null)
  }

  return (
    <Wrapper>
      <NewGroupModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <GroupDetailModal
        isVisible={!!selectedGroup}
        group={selectedGroup || { id: 0, name: '', description: '', owner: '' }}
        handleClose={handleDetailModalClose}
      />
      <Header>
        <Typography.Title level={3}>My Groups</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Group
        </Button>
      </Header>
      <Divider />
      <CardContainer>
        {defaultGroups.map((group) => (
          <Card
            key={group.id}
            title={group.name}
            style={{ width: 300 }}
            onClick={() => handleCardClick(group)}
          >
            <Typography.Paragraph>{group.description}</Typography.Paragraph>
          </Card>
        ))}
      </CardContainer>
    </Wrapper>
  )
}

const Teams = () => (
  <GroupContextProvider>
    <_Teams />
  </GroupContextProvider>
)

export default Teams
