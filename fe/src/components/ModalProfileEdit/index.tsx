import { Button, Form, Input, Modal, Select } from 'antd'
import type { ModalProps } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { UserInfo } from '../../types/user'

type Props = {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  userInfo: UserInfo | null
} & ModalProps

const Wrapper = styled(Modal)``

const ModalProfileEdit = ({
  isModalOpen,
  handleOk,
  handleCancel,
  userInfo,
  ...props
}: Props) => {
  const [visible, setVisible] = useState(false)
  const { firstName, lastName, description, interestAreas } = userInfo || {
    firstName: '',
    lastName: '',
    description: '',
    interestAreas: [],
  }
  return (
    <Wrapper
      {...props}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={{
          firstName: firstName,
          lastName: lastName,
          description: description,
          interestAreas: interestAreas,
        }}
      >
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
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Interest Areas" name="interestAreas">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Interest Areas"
            options={
              [
                { label: 'magenta', value: 'magenta' },
                { label: 'red', value: 'red' },
                { label: 'volcano', value: 'volcano' },
                { label: 'orange', value: 'orange' },
                { label: 'gold', value: 'gold' },
                { label: 'lime', value: 'lime' },
                { label: 'green', value: 'green' },
                { label: 'cyan', value: 'cyan' },
                { label: 'blue', value: 'blue' },
                { label: 'geekblue', value: 'geekblue' },
                { label: 'purple', value: 'purple' },
              ] as { label: string; value: string }[]
            }
          />
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
          rules={[{ required: true, message: 'Please input your password!' }]}
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
            { required: true, message: 'Please confirm your password!' },
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

export default ModalProfileEdit
