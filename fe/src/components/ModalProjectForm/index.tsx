import { Button, Flex, Form, Input, InputNumber, Modal, Select } from 'antd'
import React, { CSSProperties, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ProjectReqDTO } from '../../types/proj'
import { useGlobalConstantContext } from '../../context/GlobalConstantContext'
import UserSearchBar from '../UserSearchBar'
import { UserProfileSlim } from '../../types/user'
import {
  getAutoCompleteByParams,
  mapUserSlimProfileDTOUserProfileSlim,
} from '../../api/userAPI'
import { role } from '../../constant/role'
import ResponsiveForm from '../ResponsiveForm/ResponsiveForm'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: (_projectCreateDto: ProjectReqDTO) => void
  handleCancel: () => void
  initialData?: FormValues | undefined
  title: string
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
type Option = {
  label: string
  value: number | string
}
const initialValues = {
  projectName: '',
  description: '',
  skills: [{ area: 1, skill: '' }],
  email: '',
  maxGroupNumber: 5,
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
const ModalProjectForm = ({
  title,
  isModalOpen,
  handleOk,
  handleCancel,
  initialData = initialValues,
}: Props) => {
  const [form] = Form.useForm<FormValues>()
  const { AREA_LIST } = useGlobalConstantContext()
  const [autoCompUserWithoutSelf, setAutoCompUserWithoutSelf] = useState<
    UserProfileSlim[]
  >([])

  const areaOptions = useMemo<Option[]>(
    () =>
      AREA_LIST?.map((area) => ({ label: area.name, value: area.id })) || [],
    [AREA_LIST]
  )

  const handleFinish = async () => {
    try {
      const values = form.getFieldsValue()

      await form.validateFields()
      console.log(values)

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
      <ResponsiveForm
        layout="vertical"
        initialValues={initialData}
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
          <UserSearchBar
            handleChange={async (val) => {
              console.log(val)
            }}
            onChange={(val) => {
              console.log(val)

              form.setFieldValue('email', val.title)
            }}
            getAutoCompleteUsers={async (val) => {
              const res = await getAutoCompleteByParams(val, role.CLIENT)
              setAutoCompUserWithoutSelf(
                res.data.data.map(mapUserSlimProfileDTOUserProfileSlim)
              )
            }}
            setCurrAutoCompleteUser={setAutoCompUserWithoutSelf}
            autoCompUserWithoutSelf={autoCompUserWithoutSelf}
          />
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
      </ResponsiveForm>
    </_Modal>
  )
}

export default ModalProjectForm
