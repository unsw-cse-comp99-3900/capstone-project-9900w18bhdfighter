import { Form, Input, Modal, Select } from 'antd'
import React from 'react'
import type { SelectProps } from 'antd/es/select'
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
const options: SelectProps['options'] = []
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  })
}
const NewProjectModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm()

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }

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
        <Form.Item label="Interested Areas " name="interested">
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            defaultValue={['a10', 'c12']}
            onChange={handleChange}
            options={options}
          />
        </Form.Item>

        <Form.Item label="Project Owner's Email" name="email">
          <Input />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default NewProjectModal
