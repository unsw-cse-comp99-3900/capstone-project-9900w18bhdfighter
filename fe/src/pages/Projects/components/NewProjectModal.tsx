import { Button, Flex, Form, Input, InputNumber, Modal, Select } from 'antd'
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
const ListWrapper = styled(Flex)`
  flex-direction: column;

  width: 100%;
`
const ListItemWrapper = styled(Flex)`
  width: 100%;
  align-items: baseline;
`
const options: SelectProps['options'] = []

for (let i = 1; i < 36; i++) {
  options.push({
    label: 'area' + i,
    value: 'area' + i,
  })
}

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
        initialValues={{
          projectName: '',
          description: '',
          skills: [{ area: '', skill: '' }],
          email: '',
          maxGroupNumber: 1,
        }}
        form={form}
        style={{ width: '100%' }}
      >
        <Form.Item label="Project Name" name="projectName">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <ListWrapper>
              {fields.map(({ key, name, ...restField }) => (
                <ListItemWrapper key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, 'area']}
                    style={{ flex: 1, marginRight: '0.5rem' }}
                    rules={[{ required: true, message: 'Missing Area' }]}
                  >
                    <Select
                      placeholder="Select Area"
                      options={options}
                      defaultActiveFirstOption={true}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'skill']}
                    style={{ flex: 2, marginRight: '0.5rem' }}
                    rules={[{ required: true, message: 'Missing Skill' }]}
                  >
                    <Input placeholder="Skill Name" />
                  </Form.Item>
                  <Button onClick={() => remove(name)}>-</Button>
                </ListItemWrapper>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={add} block>
                  Add A Required Skill
                </Button>
              </Form.Item>
            </ListWrapper>
          )}
        </Form.List>
        <Form.Item label="Project Owner's Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Max Group Number" name="maxGroupNumber">
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default NewProjectModal
