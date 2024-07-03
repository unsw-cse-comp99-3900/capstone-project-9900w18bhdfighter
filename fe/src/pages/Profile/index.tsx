import { Button, Descriptions as _Descriptions, Flex, Tag } from 'antd'
import type { FormInstance } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useAuthContext } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import { roleNames } from '../../constant/role'
import ModalProfileEdit from '../../components/ModalProfileEdit'
import { useEffect, useState } from 'react'
import AccountManagementContextProvider, {
  useAccountManagementContext,
} from '../../context/AccountManagementContext'
import { UserUpdate } from '../../types/user'

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
const _Profile = () => {
  const { usrInfo, setUserInfo } = useAuthContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { updateAccount, getAnUserProfile, currProfileViewing } =
    useAccountManagementContext()
  useEffect(() => {
    usrInfo?.id && getAnUserProfile(usrInfo?.id as number)
  }, [usrInfo?.id])

  useEffect(() => {
    setUserInfo(currProfileViewing)
  }, [currProfileViewing])
  const handleOk = async (form: FormInstance) => {
    try {
      const values = await form.validateFields()
      const updateInfo: UserUpdate = {
        FirstName: values.firstName,
        LastName: values.lastName,
        UserInformation: values.description,
        Areas: values.interestAreas,
        UserRole: values.role,
        Passwd: values.password,
        EmailAddress: values.email,
      }
      Object.keys(updateInfo).forEach(
        (key) =>
          updateInfo[key as keyof UserUpdate] === undefined &&
          delete updateInfo[key as keyof UserUpdate]
      )

      if (!usrInfo) throw new Error('User not found')

      await updateAccount(usrInfo.id, updateInfo)
      await getAnUserProfile(usrInfo.id)
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const { role, email, firstName, lastName, description, interestAreas } =
    currProfileViewing || {
      email: '',
      role: 1,
      firstName: '',
      lastName: '',
      description: '',
      interestAreas: [],
    }
  return (
    <Wrapper>
      <ModalProfileEdit
        viewerRole={usrInfo?.role}
        title="Edit Profile"
        userInfo={currProfileViewing}
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
          {interestAreas.map((area) => (
            <Tag key={area.id} style={{ margin: '0.1rem' }} color="magenta">
              {area.name}
            </Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

const Profile = () => (
  <AccountManagementContextProvider>
    <_Profile />
  </AccountManagementContextProvider>
)

export default Profile
