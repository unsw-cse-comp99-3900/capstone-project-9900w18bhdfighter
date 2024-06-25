import { Form, Input, Modal } from 'antd'
import React from 'react'

import styled from 'styled-components'
import { ProjectCreate } from '../../../types/proj'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_projectCreateDto: ProjectCreate) => void
  handleCancel: () => void
}

const _Modal = styled(Modal)`
  width: 1000px;
`

const NewProjectModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()
  return (
    <_Modal
      title="New Project"
      open={isModalOpen}
      onOk={() =>
        handleOk({
          ProjectName: form.getFieldValue('projectName'),
          ProjectDescription: form.getFieldValue('description'),
          ProjectOwner: form.getFieldValue('email'),
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
        <Form.Item label="Project Name" name="projectName">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Project Owner's Email" name="email">
          <Input />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default NewProjectModal
