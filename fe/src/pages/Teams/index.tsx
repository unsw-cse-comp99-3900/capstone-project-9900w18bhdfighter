import { Button, Card, Col, Divider, Row, Tooltip, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import {
  getGroupByCreatorId,
  getGroupByParticipant,
  mapGroupDTOToGroup,
} from '../../api/groupAPI'
import NoDataView from '../../components/NoDataView'
import { role } from '../../constant/role'
import route from '../../constant/route'
import { useAuthContext } from '../../context/AuthContext'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import GroupContextProvider from '../../context/GroupContext'
import { Group, GroupReqDTO } from '../../types/group'
import { errHandler } from '../../utils/parse'
import { getThemeToken } from '../../utils/styles'
import NewGroupModal from './components/NewGroupDetailModal'

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
  const [createdGroups, setCreatedGroups] = useState<Group[] | null>(null)
  const [participatingGroupsStu, setParticipatingGroupsStu] = useState<
    Group[] | null
  >(null)
  const { usrInfo, isInRoleRange } = useAuthContext()

  const groupsToShow = isInRoleRange([role.STUDENT])
    ? participatingGroupsStu || []
    : createdGroups || []

  const currentUserId = usrInfo?.id
  const { msg } = useGlobalComponentsContext()
  const fetchGroups = async () => {
    if (!currentUserId) {
      return
    }
    try {
      const res1 = await getGroupByCreatorId(currentUserId)
      const res2 = await getGroupByParticipant(currentUserId)
      setCreatedGroups(res1.data.map(mapGroupDTOToGroup))
      setParticipatingGroupsStu(res2.data.map(mapGroupDTOToGroup))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [currentUserId])

  // const handleOk = async (groupCreateDto: GroupReqDTO) => {
  //   console.log('handleOk started with:', groupCreateDto)
  //   setIsModalOpen(false)
  //   await fetchGroups()
  //   const response = await getAllGroups()
  //   const allGroups = response.data.map(mapGroupDTOToGroup)
  //   const userGroups = allGroups.filter((group: Group) =>
  //     group.groupMembers.some(
  //       (member: UserProfileSlim) => member.id === currentUserId
  //     )
  //   )
  //   setGroups(userGroups)
  // }
  const handleOk = async (groupCreateDto: GroupReqDTO) => {
    console.log('handleOk started with:', groupCreateDto)
    setIsModalOpen(false)
    fetchGroups()
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const Main = () => (
    <CardContainer gutter={[16, 8]}>
      {groupsToShow?.map((group) => (
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
  )

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
      {groupsToShow.length ? (
        <Main />
      ) : (
        <NoDataView>You do not have any groups to view or manage.</NoDataView>
      )}
    </Wrapper>
  )
}

const Teams = () => (
  <GroupContextProvider>
    <_Teams />
  </GroupContextProvider>
)

export default Teams
