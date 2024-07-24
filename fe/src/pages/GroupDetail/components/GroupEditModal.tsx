import { Form, Input, InputNumber, Modal, Select } from 'antd'
import React, { CSSProperties } from 'react'
import styled from 'styled-components'

import { GroupReqDTO } from '../../../types/group'
import { useGroupDetailContext } from '../../../context/GroupDetailContext'
import { useGlobalConstantContext } from '../../../context/GlobalConstantContext'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleCancel: () => void

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
  groupMaxMemberNumber: number
  courseId: number
}

const ModalGroupForm = ({ title, isModalOpen, handleCancel }: Props) => {
  const [form] = Form.useForm<FormValues>()
  const { updateGroupMetaData, group } = useGroupDetailContext()
  const { COURSE_LIST } = useGlobalConstantContext()

  const options =
    COURSE_LIST?.map((course) => ({
      label: course.courseName,
      value: course.id,
    })) || []
  const handleFinish = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      const mappedValues: GroupReqDTO = {
        GroupName: values.projectName,
        GroupDescription: values.description,
        MaxMemberNumber: values.groupMaxMemberNumber,
        CourseCode: values.courseId,
      }

      await updateGroupMetaData(mappedValues)
      handleCancel() // Close the modal
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <_Modal
      title={title}
      open={isModalOpen}
      onOk={handleFinish}
      onCancel={() => {
        handleCancel()
      }}
      styles={{
        body: modalBodyStyle,
      }}
    >
      <Form
        layout="vertical"
        initialValues={{
          projectName: group?.groupName,
          description: group?.groupDescription,
          groupMaxMemberNumber: group?.maxMemberNum,
          courseId: group?.course.id,
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
        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: 'Group name is required' }]}
        >
          <Select options={options} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Group Max Member Number"
          name="groupMaxMemberNumber"
          rules={[
            {
              required: true,
              min: 5,
              type: 'number',
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </_Modal>
  )
}

export default ModalGroupForm
