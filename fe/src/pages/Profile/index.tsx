import {
  Button,
  Descriptions as _Descriptions,
  Flex,
  Tag,
  Typography,
  Spin,
} from 'antd'
import type { FormInstance } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useAuthContext } from '../../context/AuthContext'
import Avatar from '../../components/Avatar'
import { roleNames } from '../../constant/role'
import { useEffect, useState } from 'react'
import AccountManagementContextProvider, {
  useManagementContext,
} from '../../context/ManagementContext'
import { UserUpdate } from '../../types/user'
import { useParams } from 'react-router-dom'
import ModalProfileEdit from '../../components/ModalProfileEdit'

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
  const { id: usrId } = useParams() || {
    id: undefined,
  }
  const isMyProfile = !usrId
  const { updateAccount, getAnUserProfile, currProfileViewing } =
    useManagementContext()
  // when user id is changed, get the user profile
  useEffect(() => {
    usrId
      ? getAnUserProfile(parseInt(usrId))
      : usrInfo && getAnUserProfile(usrInfo.id)
  }, [usrInfo?.id, usrId])

  //when my current profile is updated, update to my user info
  useEffect(() => {
    isMyProfile && setUserInfo(currProfileViewing)
  }, [currProfileViewing])
  //only for self
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
        CourseCode: values.courseCode,
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

  if (!currProfileViewing)
    return (
      <Wrapper>
        <Spin></Spin>
      </Wrapper>
    )
  const {
    role,
    email,
    firstName,
    lastName,
    description,
    interestAreas,
    courseCode,
  } = currProfileViewing
  return (
    <Wrapper>
      <ModalProfileEdit
        viewerRole={usrInfo?.role}
        handleOk={handleOk}
        userInfo={currProfileViewing}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      ></ModalProfileEdit>
      <Header>
        <EditButton
          type="primary"
          onClick={() => {
            setIsModalOpen(true)
          }}
          style={{
            display: isMyProfile ? 'block' : 'none',
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
        <Descriptions.Item span={2} label="Full Name">
          {`${firstName} ${lastName}`}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Course">
          {courseCode ? (
            courseCode.courseName
          ) : (
            <Typography.Text type="secondary">
              No course provided
            </Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Email">
          {email}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Role">
          {roleNames[role]}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          {description ? (
            <Typography.Text>{description}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">
              No description provided
            </Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Interest Areas">
          {interestAreas.length === 0 ? (
            <Typography.Text type="secondary">
              No interest areas provided
            </Typography.Text>
          ) : (
            interestAreas.map((area) => (
              <Tag key={area.id} style={{ margin: '0.1rem' }} color="magenta">
                {area.name}
              </Tag>
            ))
          )}
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
