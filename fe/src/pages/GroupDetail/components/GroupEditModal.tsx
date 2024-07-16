import { Form, Input, InputNumber, Modal } from 'antd'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { ProjectReqDTO } from '../../../types/proj'
import { Group } from '../../../types/group'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_projectCreateDto: ProjectReqDTO) => void
  handleCancel: () => void
  initialData?: Group | undefined
  title: string
}

const _Modal = styled(Modal)`
  width: 1000px;
`

const modalBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}
type Skill = {
  area: number
  skill: string
}
type FormValues = {
  projectName: string
  description: string
  skills: Skill[]
  email: string
  maxGroupNumber: number
}

const mapFormValuesToProjectReqDTO = (values: FormValues): ProjectReqDTO => {
  return {
    ProjectName: values.projectName,
    ProjectDescription: values.description,
    ProjectOwner: values.email,
    requiredSkills: values.skills.map((s: Skill) => ({
      area_id: s.area,
      skill: s.skill,
    })),
    MaxNumOfGroup: values.maxGroupNumber,
  }
}
const ModalGroupForm = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  initialData,
}: Props) => {
  const [form] = Form.useForm<FormValues>()

  const handleFinish = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      handleOk(mapFormValuesToProjectReqDTO(values))
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <_Modal
      title={title}
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
          projectName: initialData?.groupName,
          description: initialData?.groupDescription,
          maxGroupNumber: initialData?.maxMemberNum,
        }}
        form={form}
        style={{ width: '100%' }}
      >
        <Form.Item
          rules={[{ required: true, message: 'Missing Group Name' }]}
          label="Project Name"
          name="projectName"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
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

export default ModalGroupForm
