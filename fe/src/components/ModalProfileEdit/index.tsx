import { Button, Form, Input, Modal, Select } from 'antd'
import type { FormInstance, ModalProps } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { UserInfo, UserRole } from '../../types/user'

import AreaContextProvider from '../../context/AreaContext'
import { role as _role } from '../../constant/role'
import { useGlobalConstantContext } from '../../context/GlobalConstantContext'

type Props = {
  isModalOpen: boolean
  handleOk: (_form: FormInstance) => void
  handleCancel: () => void
  userInfo: UserInfo | null
  viewerRole: UserRole | undefined
} & ModalProps

const Wrapper = styled(Modal)``

const _ModalProfileEdit = ({
  isModalOpen,
  handleCancel,
  userInfo,
  handleOk,
  viewerRole = _role.ADMIN,
  ...props
}: Props) => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const { AREA_LIST, COURSE_LIST } = useGlobalConstantContext()

  const areaList = AREA_LIST || []
  const courseList = COURSE_LIST || []
  const { firstName, lastName, description, interestAreas, role, courseCode } =
    userInfo || {
      firstName: '',
      lastName: '',
      description: '',
      interestAreas: [],
      role: 1,
      courseCode: null,
    }
  useEffect(() => {
    form.setFieldsValue({
      firstName: firstName,
      lastName: lastName,
      description: description,
      interestAreas: interestAreas.map((area) => area.id),
      role: role,
      courseCode: courseCode
        ? {
            label: courseCode.courseName,
            value: courseCode.id,
          }
        : null,
    })
    console.log(interestAreas)
  }, [userInfo, form])

  useEffect(() => {
    if (!visible) {
      form.setFieldsValue({
        password: undefined,
        confirmPassword: undefined,
      })
    }
  }, [visible, form])
  return (
    <Wrapper
      {...props}
      open={isModalOpen}
      onOk={() => handleOk(form)}
      onCancel={handleCancel}
    >
      <Form layout="vertical" form={form} style={{ width: '100%' }}>
        <Form.Item
          style={{
            display: 'inline-block',
            width: 'calc(50% - 0.5rem)',
          }}
          label="First name"
          name="firstName"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: 'inline-block',
            width: 'calc(50% - 0.5rem)',
            marginLeft: '1rem',
          }}
          label="Last name"
          name="lastName"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          style={{
            display: `${
              viewerRole === _role.ADMIN || !courseCode ? 'block' : 'none'
            }`,
          }}
          label="Course Code"
          name="courseCode"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Course Code"
            options={courseList.map((course) => ({
              label: course.courseName,
              value: course.id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            maxLength={255}
            showCount
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label="Interest Areas" name="interestAreas">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Interest Areas"
            options={areaList.map((area) => ({
              label: area.name,
              value: area.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          style={{
            display: `${viewerRole === _role.ADMIN ? 'block' : 'none'}`,
          }}
          label="Role"
          name="role"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Role"
            options={
              Object.keys(_role).map((key) => ({
                label: key,
                value: _role[key as keyof typeof _role],
              })) || []
            }
          ></Select>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              setVisible((prev) => !prev)
            }}
          >
            Change Password
          </Button>
        </Form.Item>
        <Form.Item
          style={{
            display: visible ? 'block' : 'none',
          }}
          label="Password"
          name="password"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          style={{
            display: visible ? 'block' : 'none',
          }}
          label="Confirm password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('The password does not match!'))
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Wrapper>
  )
}
const ModalProfileEdit = ({
  isModalOpen,
  handleOk,
  handleCancel,
  userInfo,
  ...props
}: Props) => {
  return (
    <AreaContextProvider>
      <_ModalProfileEdit
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        userInfo={userInfo}
        {...props}
      ></_ModalProfileEdit>
    </AreaContextProvider>
  )
}

export default ModalProfileEdit
