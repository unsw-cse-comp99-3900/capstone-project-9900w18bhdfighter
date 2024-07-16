import { Button, Divider, Typography, Card, message } from 'antd'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import NewGroupModal from './components/NewGroupDetailModal'
import GroupDetailModal from './components/GroupDetailModal'
import { Group, GroupCreate, GroupRspDTO } from '../../types/group'
import { UserProfileSlim } from '../../types/user'
import GroupContextProvider from '../../context/GroupContext'
import api from '../../api/config'
import { mapGroupDTOToGroup } from '../../api/groupAPI'
import { useAuthContext } from '../../context/AuthContext' // 确保路径正确

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`

const _Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  // const { createGroup } = useGroupContext()
  const { usrInfo } = useAuthContext()
  const currentUserId = usrInfo?.id

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get<GroupRspDTO[]>('/groups')
        console.log(response)
        const allGroups = response.data.map(mapGroupDTOToGroup)
        // 过滤当前用户参与的小组
        const userGroups = allGroups.filter((group: Group) =>
          group.groupMembers.some(
            (member: UserProfileSlim) => member.id === currentUserId
          )
        )
        setGroups(userGroups)
      } catch (error) {
        message.error('Failed to fetch groups.')
      }
    }

    if (currentUserId) {
      fetchGroups()
    }
  }, [currentUserId])

  const handleOk = async (groupCreateDto: GroupCreate) => {
    console.log('handleOk started with:', groupCreateDto)
    setIsModalOpen(false)
    // 获取最新组数据的逻辑
    const response = await api.get<GroupRspDTO[]>('/groups')
    const allGroups = response.data.map(mapGroupDTOToGroup)
    const userGroups = allGroups.filter((group: Group) =>
      group.groupMembers.some(
        (member: UserProfileSlim) => member.id === currentUserId
      )
    )
    setGroups(userGroups)
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
      {selectedGroup && (
        <GroupDetailModal
          isVisible={!!selectedGroup}
          group={selectedGroup}
          handleClose={handleDetailModalClose}
        />
      )}
      <Header>
        <Typography.Title level={3}>My Groups</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Group
        </Button>
      </Header>
      <Divider />
      <CardContainer>
        {groups.map((group) => (
          <Card
            key={group.groupId} // 确保使用 group.groupId 作为唯一的 key
            title={group.groupName}
            style={{ width: 300 }}
            onClick={() => handleCardClick(group)}
          >
            <Typography.Paragraph>
              {group.groupDescription}
            </Typography.Paragraph>
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
