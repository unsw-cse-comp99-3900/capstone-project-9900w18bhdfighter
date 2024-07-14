import { Form, Input, Modal } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import { GroupCreate } from '../../../types/grp'
import api from '../../../api/config'
import type { RuleObject } from 'antd/es/form'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_projectCreateDto: GroupCreate) => void
  handleCancel: () => void
}

const _Modal = styled(Modal)`
  width: 1000px;
`

const NewGroupModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()
  const [validating, setValidating] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const validateGroupName = async (
    _: RuleObject,
    value: string
  ): Promise<void | never> => {
    if (!value) {
      return Promise.resolve()
    }

    setValidating(true)
    setNameError(null)

    try {
      const response = await api.get(`/groups/check-name?name=${value}`) // Adjust the API endpoint
      if (!response.data.isUnique) {
        setNameError('Group name is already taken.')
        return Promise.reject('Group name is already taken.')
      }
      setValidating(false)
      return Promise.resolve()
    } catch (error) {
      setNameError('Error validating group name.')
      setValidating(false)
      return Promise.reject('Error validating group name.')
    }
  }

  return (
    <_Modal
      title="Create a New Group"
      open={isModalOpen}
      onOk={() =>
        handleOk({
          GroupName: form.getFieldValue('groupName'),
          GroupDescription: form.getFieldValue('description'),
          GroupOwner: form.getFieldValue('email'),
        })
      }
      onCancel={handleCancel}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Form
        layout="vertical"
        form={form}
        style={{
          width: '100%',
        }}
      >
        <Form.Item
          label="Group Name"
          name="groupName"
          validateFirst
          rules={[
            { required: true, message: 'Group name is required' },
            { validator: validateGroupName },
          ]}
          hasFeedback
          validateStatus={nameError ? 'error' : validating ? 'validating' : ''}
          help={nameError}
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
