import {
  Modal,
  Descriptions,
  Button,
  Form,
  Input,
  Select,
  Flex,
  Typography,
  Row,
  message,
} from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import type { SelectProps } from 'antd/es/select'
import axios from 'axios'

const { Title, Paragraph } = Typography

interface Group {
  id: number
  name: string
  description: string
  owner: string
}

interface Props extends React.ComponentProps<typeof Modal> {
  isVisible: boolean
  group: Partial<Group>
  handleClose: () => void
}

const StyledDescriptions = styled(Descriptions)`
  width: 100%;
  .ant-descriptions-item-label {
    width: 30%;
  }
  .ant-descriptions-item-content {
    width: 70%;
  }
`

const _Modal = styled(Modal)`
  width: 800px; /* Adjust width as needed */
  .ant-modal-body {
    display: flex;
    flex-direction: column;
  }
`

const ListWrapper = styled(Flex)`
  flex-direction: column;
  width: 100%;
`

const ListItemWrapper = styled(Flex)`
  width: 100%;
  flex-direction: row; /* Arrange items horizontally */
  align-items: center;
  margin-bottom: 0.25rem; /* Reduced margin between rows */
`

const ItemWrapper = styled.div`
  flex: 1;
  margin-right: 0.5rem;
  .ant-form-item {
    margin-bottom: 0.25rem; /* Reduced margin between form items */
  }
  .ant-select-selector,
  .ant-input {
    height: 32px; /* Reduced height for select and input */
  }
  .ant-input-textarea {
    height: 32px; /* Reduced height for textarea */
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

const ProjectPreference = ({
  name,
  isEditable,
}: {
  name: number
  isEditable: boolean
}) => (
  <React.Fragment>
    <Title
      level={4}
      style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}
    >
      Project Preference {name + 1}
    </Title>
    <Form.Item
      name={[name, 'project']}
      rules={[{ required: true, message: 'Missing Project' }]}
    >
      <Select
        placeholder="Select Project"
        options={options}
        defaultActiveFirstOption={true}
        disabled={!isEditable}
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
                  <Input placeholder="Skill Name" disabled={!isEditable} />
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
                    disabled={!isEditable}
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
                    disabled={!isEditable}
                  />
                </Form.Item>
              </ItemWrapper>
              {isEditable && (
                <Button onClick={() => remove(skillName)}>-</Button>
              )}
            </ListItemWrapper>
          ))}
          {isEditable && (
            <Form.Item>
              <Button type="dashed" onClick={add} block>
                Add Group Member Evaluation
              </Button>
            </Form.Item>
          )}
        </ListWrapper>
      )}
    </Form.List>
  </React.Fragment>
)

const GroupDetailModal = ({ isVisible, group, handleClose }: Props) => {
  const [form] = Form.useForm()
  const [isEditable, setIsEditable] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      // Send the form data to the backend
      await axios.post('/api/savePreferences', values)
      message.success('Preferences saved successfully')
      setIsEditable(false)
      setConfirmVisible(false)
    } catch (error) {
      message.error('Failed to save preferences')
    }
  }

  const handleConfirmSave = () => {
    setConfirmVisible(true)
  }

  const handleConfirmCancel = () => {
    setConfirmVisible(false)
  }

  return (
    <_Modal
      title={group.name}
      open={isVisible}
      onCancel={handleClose}
      footer={null}
    >
      <Row justify="end" style={{ marginBottom: '1rem' }}>
        <Button
          onClick={() =>
            isEditable ? handleConfirmSave() : setIsEditable(true)
          }
        >
          {isEditable ? 'Save' : 'Edit'}
        </Button>
      </Row>
      <StyledDescriptions bordered column={1}>
        <Descriptions.Item label="Group Name">{group.name}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {group.description}
        </Descriptions.Item>
        <Descriptions.Item label="Group Owner">{group.owner}</Descriptions.Item>
      </StyledDescriptions>
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
          <ProjectPreference key={index} name={index} isEditable={isEditable} />
        ))}
      </Form>
      <Modal
        title="Confirm Save"
        visible={confirmVisible}
        onOk={handleSave}
        onCancel={handleConfirmCancel}
      >
        <Paragraph>
          Are you sure you want to submit your project preferences? Once
          submitted, they cannot be changed.
        </Paragraph>
      </Modal>
    </_Modal>
  )
}

export default GroupDetailModal
