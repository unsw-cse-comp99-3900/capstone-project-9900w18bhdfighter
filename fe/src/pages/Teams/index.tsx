import {
  Button,
  Divider,
  Typography,
  Card,
  message,
  Row,
  Col,
  Tooltip,
} from 'antd'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import NewGroupModal from './components/NewGroupDetailModal'
import { Group, GroupCreate, GroupRspDTO } from '../../types/group'
import { UserProfileSlim } from '../../types/user'
import GroupContextProvider from '../../context/GroupContext'
import api from '../../api/config'
import { mapGroupDTOToGroup } from '../../api/groupAPI'
import { useAuthContext } from '../../context/AuthContext'
import { getThemeToken } from '../../utils/styles'
import { Link } from 'react-router-dom'
import route from '../../constant/route'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CardContainer = styled(Row)``

const _Teams = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  // const { createGroup } = useGroupContext()
  const { usrInfo } = useAuthContext()
  const currentUserId = usrInfo?.id

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get(`groups`)
        console.log(response)
        console.log(currentUserId)
        const allGroups = response.data
        const userCreatedGroups = allGroups.filter(
          (group: GroupRspDTO) => group.CreatedBy === currentUserId
        )
        setGroups(userCreatedGroups.map(mapGroupDTOToGroup))
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

  return (
    <Wrapper>
      <NewGroupModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />

      <Header>
        <Typography.Title level={3}>My Groups</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Group
        </Button>
      </Header>
      <Divider />
      <CardContainer>
        {groups.map((group) => (
          <Col key={group.groupId} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={group.groupName}
              style={{
                height: '10rem',
              }}
              extra={<Link to={`${route.GROUPS}/${group.groupId}`}>More</Link>}
            >
              <Tooltip title={group.groupDescription}>
                {group.groupDescription ? (
                  <Typography.Paragraph ellipsis={{ rows: 3 }}>
                    {group.groupDescription}
                  </Typography.Paragraph>
                ) : (
                  <Typography.Paragraph type="secondary">
                    No Description Provided.
                  </Typography.Paragraph>
                )}
              </Tooltip>
            </Card>
          </Col>
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
