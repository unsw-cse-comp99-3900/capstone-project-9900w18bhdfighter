import { Modal, Button, Form, Input, Select, Typography, Flex } from 'antd'
import type { FormInstance } from 'antd'
import React from 'react'
import styled from 'styled-components'
import type { SelectProps } from 'antd/es/select'
import { UserProfileSlim } from '../../../types/user'
import { Project } from '../../../types/proj'
import { GroupDetailModalType } from '../../GroupDetail'

interface GroupPreference {
  preferenceId: number
  preference: Project
  rank: number
}
interface Group {
  groupId: number
  groupName: string
  groupDescription: string
  maxMemberNum: number
  groupMembers: UserProfileSlim[]
  groupOwner: string
  createdBy: number
  preferences: GroupPreference[]
}

interface Props extends React.ComponentProps<typeof Modal> {
  isVisible: boolean
  group: Group | null
  handleMultipleModalClose: (_type: GroupDetailModalType) => void
  handleMultipleModalOpen: (_type: GroupDetailModalType) => void
  form: FormInstance
}

const _Modal = styled(Modal)`
  width: 800px;
  .ant-modal-body {
    display: flex;
    flex-direction: column;
  }
`

const ListWrapper = styled.div`
  flex-direction: column;
  width: 100%;
`

const ListItemWrapper = styled.div`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.25rem;
`

const ItemWrapper = styled.div`
  flex: 1;
  margin-right: 0.5rem;
  .ant-form-item {
    margin-bottom: 0.25rem;
  }
  .ant-select-selector,
  .ant-input {
    height: 32px;
  }
  .ant-input-textarea {
    height: 32px;
  }
`

const options: SelectProps['options'] = []
for (let i = 1; i < 36; i++) {
  options.push({
    label: 'Project' + i,
    value: 'Project' + i,
  })
}

const ratingOptions: SelectProps['options'] = []
for (let i = 0; i <= 10; i++) {
  ratingOptions.push({
    label: i.toString(),
    value: i,
  })
}

const ProjectPreference = ({ name }: { name: number }) => (
  <Flex vertical style={{ width: '100%' }}>
    <Typography.Text style={{ margin: '0.25rem 0' }}>
      Project Preference {name + 1}
    </Typography.Text>
    <Form.Item
      name={[name, 'project']}
      rules={[{ required: true, message: 'Missing Project' }]}
    >
      <Select
        placeholder="Select Project"
        options={options}
        defaultActiveFirstOption={true}
      />
    </Form.Item>
    <Form.List name={[name, 'skills']}>
      {(fields, { add, remove }) => (
        <ListWrapper>
          {fields.map(({ key, name: skillName, ...restField }) => (
            <ListItemWrapper key={key}>
              <ItemWrapper>
                <Form.Item
                  {...restField}
                  name={[skillName, 'skill']}
                  rules={[{ required: true, message: 'Missing Skill' }]}
                >
                  <Input placeholder="Skill Name" />
                </Form.Item>
              </ItemWrapper>
              <ItemWrapper>
                <Form.Item
                  {...restField}
                  name={[skillName, 'rating']}
                  rules={[{ required: true, message: 'Missing Rating' }]}
                >
                  <Select
                    placeholder="Rate Skill (0-10)"
                    options={ratingOptions}
                    defaultActiveFirstOption={true}
                  />
                </Form.Item>
              </ItemWrapper>
              <ItemWrapper>
                <Form.Item
                  {...restField}
                  name={[skillName, 'comments']}
                  rules={[{ required: true, message: 'Missing Comments' }]}
                >
                  <Input.TextArea
                    placeholder="Comments"
                    autoSize={{ minRows: 1, maxRows: 1 }}
                  />
                </Form.Item>
              </ItemWrapper>

              <Button onClick={() => remove(skillName)}>-</Button>
            </ListItemWrapper>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={add} block>
              Add Group Member Evaluation
            </Button>
          </Form.Item>
        </ListWrapper>
      )}
    </Form.List>
  </Flex>
)

const GroupDetailModal = ({
  isVisible,
  group,
  form,
  handleMultipleModalClose,
  handleMultipleModalOpen,
}: Props) => {
  return (
    <_Modal
      title={group?.groupName}
      open={isVisible}
      onCancel={() => handleMultipleModalClose('detail')}
      onOk={() => handleMultipleModalOpen('confirm')}
    >
      {/* <Descriptions.Item label="Group Owner">
          {group.groupOwner}
        </Descriptions.Item> */}

      <Form
        layout="vertical"
        initialValues={{
          projectPreferences: [
            { project: '', skills: [{ skill: '', rating: 0, comments: '' }] },
            { project: '', skills: [{ skill: '', rating: 0, comments: '' }] },
            { project: '', skills: [{ skill: '', rating: 0, comments: '' }] },
          ],
        }}
        form={form}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {Array.from({ length: 3 }, (_, index) => (
          <ProjectPreference key={index} name={index} />
        ))}
      </Form>
    </_Modal>
  )
}

export default GroupDetailModal
