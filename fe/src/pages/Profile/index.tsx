import { Button, Flex, Form, Input, Space, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeColor, getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import ModalProjectsList from './components/ModalProjectsList'
const Wrapper = styled(Flex)`
  height: 100%;
  display: flex;
  padding: ${getThemeToken('paddingLG', 'px')};
  position: relative;
  align-items: center;
  flex-direction: column;
`
const Avatar = styled(Button)`
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  font-weight: bold;
  margin: 0 1rem;
  border-radius: 100%;
  border: 1px solid ${getThemeColor('grayscalePalette', 35)};
`
const InfoContainer = styled(Flex)`
  padding: ${getThemeToken('paddingMD', 'px')};
  flex-direction: column;
  align-items: center;
  box-shadow: ${getThemeToken('boxShadow')};
  margin-top: ${getThemeToken('marginMD', 'px')};
`
const Header = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  width: 80%;
`
const Title = styled(Typography.Title)``
const EditButton = styled(Button)``
const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [noEdit, setNoEdit] = useState(true)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const EditSaveButton = () => {
    if (noEdit) {
      return (
        <EditButton onClick={() => setNoEdit((prev) => !prev)}>Edit</EditButton>
      )
    }
    return (
      <EditButton type="primary" onClick={() => setNoEdit((prev) => !prev)}>
        Save
      </EditButton>
    )
  }
  return (
    <Wrapper>
      <ModalProjectsList
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        noEdit={noEdit}
      />
      <Header>
        <Title level={4}></Title>
        <EditSaveButton />
      </Header>

      <Avatar>Avatar</Avatar>

      <InfoContainer>
        <Form labelCol={{ span: 24 }} size="small">
          <Space>
            <Form.Item label="First name" name="firstName">
              <Input disabled={noEdit} />
            </Form.Item>
            <Form.Item label="Last name" name="lastName">
              <Input disabled={noEdit} />
            </Form.Item>
          </Space>
          <Form.Item label="Description" name="Description">
            <Input.TextArea disabled={noEdit} />
          </Form.Item>
          <Form.Item label="E-mail address" name="email">
            <Input disabled={noEdit} />
          </Form.Item>

          <Button onClick={showModal}>Manage My Preferences</Button>
        </Form>
      </InfoContainer>
    </Wrapper>
  )
}

export default Profile
