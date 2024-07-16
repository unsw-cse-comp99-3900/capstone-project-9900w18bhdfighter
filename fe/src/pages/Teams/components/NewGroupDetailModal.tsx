import { Form, Input, Modal, message } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { GroupReqDTO } from '../../../types/group'
import api from '../../../api/config'
import { AxiosError } from 'axios'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_groupCreateDto: GroupReqDTO) => void
  handleCancel: () => void
}

interface ErrorResponse {
  error: string
}

const _Modal = styled(Modal)`
  width: 1000px;
`

const NewGroupModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  const onSubmit = async () => {
    console.log('Form submission started')
    try {
      const values = await form.validateFields()
      console.log('Form values:', values)

      const groupData: GroupReqDTO = {
        GroupName: values.groupName,
        GroupDescription: values.description,
        MaxMemberNumber: values.groupMaxMemberNumber,
      }
      console.log('Group Data to be sent:', groupData)

      try {
        const response = await api.post('/group_creation/', groupData)
        console.log('Response:', response)

        if (response.status === 201) {
          message.success('Group created successfully!')
          handleOk(groupData)
          form.resetFields()
        } else {
          message.error('Failed to create group. Please check your input.')
        }
      } catch (error: unknown) {
        const axiosError = error as AxiosError<ErrorResponse>
        console.error('Error creating group:', axiosError)
        const errorMessage =
          axiosError.response?.data?.error ||
          axiosError.message ||
          'Failed to create group.'
        message.error(`Failed to create group. ${errorMessage}`)
      }
    } catch (error) {
      console.error('Validation error:', error)
      message.error('Validation failed.')
    }
  }

  return (
    <_Modal
      title="Create a New Group"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        style={{ width: '100%' }}
      >
        <Form.Item
          label="Group Name"
          name="groupName"
          rules={[{ required: true, message: 'Group name is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Group Max Member Number"
          name="groupMaxMemberNumber"
          rules={[{ required: true, message: 'Max Number is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default NewGroupModal
