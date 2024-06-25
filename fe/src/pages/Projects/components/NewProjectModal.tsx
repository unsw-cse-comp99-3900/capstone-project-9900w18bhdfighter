import { Form, Input, Modal } from 'antd'
import React from 'react'

import styled from 'styled-components'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
}

const _Modal = styled(Modal)`
  width: 1000px;
`

const NewProjectModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  return (
    <_Modal
      title="New Project"
      open={isModalOpen}
      onOk={handleOk}
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
