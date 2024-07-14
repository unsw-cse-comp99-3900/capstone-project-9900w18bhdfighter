import { Button, Flex, Form, Input, InputNumber, Modal, Select } from 'antd'
import React, { CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import { ProjectReqDTO } from '../../../types/proj'
import { useProjectContext } from '../../../context/ProjectContext'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_projectCreateDto: ProjectReqDTO) => void
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
const modalBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}
type FormValues = {
  projectName: string
  description: string
  skills: { area: string; skill: string }[]
  email: string
  maxGroupNumber: number
}
type Option = {
  label: string
  value: number | string
}

const NewProjectModal = ({ isModalOpen, handleOk, handleCancel }: Props) => {
  const [form] = Form.useForm<FormValues>()
  const { areaList } = useProjectContext()
  const areaOptions = useMemo<Option[]>(
    () => areaList?.map((area) => ({ label: area.name, value: area.id })) || [],
    [areaList]
  )
  const handleFinish = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      handleOk({
        ProjectName: values.projectName,
        ProjectDescription: values.description,
        ProjectOwner: values.email,
        requiredSkills: values.skills.map(
          (s: { area: string; skill: string }) => ({
            area_id: s.area,
            skill: s.skill,
          })
        ),
        MaxNumOfGroup: values.maxGroupNumber,
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <_Modal
      title="New Project"
      open={isModalOpen}
      onOk={handleFinish}
      onCancel={handleCancel}
      styles={{
        body: modalBodyStyle,
      }}
    >
      <Form
        layout="vertical"
        initialValues={{
          projectName: undefined,
          description: '',
          skills: [{ area: '', skill: '' }],
          email: undefined,
          maxGroupNumber: 1,
        }}
        form={form}
        style={{ width: '100%' }}
      >
        <Form.Item
          rules={[{ required: true, message: 'Missing Project Name' }]}
          label="Project Name"
          name="projectName"
        >
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
                      options={areaOptions}
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
        <Form.Item
          rules={[{ required: true, message: 'Missing Email' }]}
          label="Project Owner's Email"
          name="email"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Missing Max Group Number',
              type: 'number',
            },
          ]}
          label="Max Group Number"
          name="maxGroupNumber"
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default NewProjectModal
