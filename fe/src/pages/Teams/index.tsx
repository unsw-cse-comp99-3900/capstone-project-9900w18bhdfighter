import { Button, Divider, Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import NewGroupModal from './components/NewGroupDetailModal'
import { GroupCreate } from '../../types/grp'
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

const _Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createGroup } = useGroupContext()

  const handleOk = async (groupCreateDto: GroupCreate) => {
    createGroup(groupCreateDto)
    setIsModalOpen(false)
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
      ></NewGroupModal>
      <Header>
        <Typography.Title level={3}>My Groups</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Group
        </Button>
      </Header>
      <Divider />
    </Wrapper>
  )
}

const Groups = () => (
  <GroupContextProvider>
    <_Groups />
  </GroupContextProvider>
)
export default Groups
