import { Button, Descriptions as _Descriptions, Flex, Tag } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'

import { useAuthContext } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import { roleNames } from '../../constant/role'
<<<<<<< HEAD
import ModalProfileEdit from './components/ModalProfileEdit'
=======
import ModalProfileEdit from '../../components/ModalProfileEdit'
>>>>>>> 611021aaf88104bacc9b8f80151c444a7c13fb19
import { useState } from 'react'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const _Avatar = styled(Avatar)`
  width: 5rem;
  height: 5rem;
`

const Header = styled(Flex)`
  position: relative;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const EditButton = styled(Button)`
  position: absolute;

  right: 0;
  bottom: 0;
`
const Descriptions = styled(_Descriptions)`
  width: 100%;
  margin-top: 2rem;
  box-shadow: ${getThemeToken('boxShadow')};
`
const Profile = () => {
  const { usrInfo } = useAuthContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { role, email, firstName, lastName, description } = usrInfo || {
    email: '',
    role: 1,
    firstName: '',
    lastName: '',
    description: '',
  }
  return (
    <Wrapper>
      <ModalProfileEdit
<<<<<<< HEAD
=======
        title="Edit Profile"
>>>>>>> 611021aaf88104bacc9b8f80151c444a7c13fb19
        userInfo={usrInfo}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      ></ModalProfileEdit>
      <Header>
        <EditButton
          type="primary"
          onClick={() => {
            setIsModalOpen(true)
          }}
        >
          Edit
        </EditButton>
        <_Avatar
          firstName={firstName}
          lastName={lastName}
          emailForHashToColor={email}
        ></_Avatar>
      </Header>
      <Descriptions bordered>
        <Descriptions.Item span={1} label="First Name">
          {firstName}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Last Name">
          {lastName}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Role">
          {roleNames[role]}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          {description}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Interest Areas">
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

export default Profile
