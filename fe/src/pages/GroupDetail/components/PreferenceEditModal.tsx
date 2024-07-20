import { Form, Modal, Button, Flex } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { ModalProps } from 'antd/es/modal'
import { Fragment } from 'react/jsx-runtime'
// import { useGroupDetailContext } from '../../../context/GroupDetailContext'
import { GroupPreferenceReqDTO } from '../../../types/group'
import styled from 'styled-components'
import { getThemeToken } from '../../../utils/styles'
import AllocateProjectSearchBar from './AllocateProjectSearchBar'

import { useGroupDetailContext } from '../../../context/GroupDetailContext'
import { ProjectSearchBarOptionValue } from '../../../components/ProjectSearchBar'

type Props = Partial<ModalProps> & {
  handleCancel: () => void
  initialData?: GroupPreferenceReqDTO[]
}

const FormWrapper = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: ${getThemeToken('paddingMD', 'px')};
`
const PreferenceEditModal = ({ handleCancel, ...props }: Props) => {
  const [form] = Form.useForm<{
    preferences: ProjectSearchBarOptionValue[]
  }>()
  const { updatePreferences, group } = useGroupDetailContext()

  // Handle form submission
  const initialValues = group?.preferences?.map((preference) => ({
    label: preference.preference.name,
    value: preference.preference.id,
  }))

  const handleFinish = async () => {
    try {
      await form.validateFields()
      const values = form.getFieldsValue()
      console.log(values)

      const mappedValues: GroupPreferenceReqDTO[] = values.preferences.map(
        (val, index) => {
          return {
            Preference: val.value,
            Rank: index + 1,
          }
        }
      )

      await updatePreferences(mappedValues)
      handleCancel() // Close the modal
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Modal
      title="Edit Preferences"
      {...props}
      onOk={() => {
        form.submit()
      }}
      onCancel={() => {
        handleCancel()
        form.resetFields()
      }}
    >
      <FormWrapper>
        <Form
          onFinish={handleFinish}
          layout="vertical"
          form={form}
          initialValues={{
            preferences: initialValues?.length ? initialValues : [''],
          }}
        >
          <Form.List name="preferences">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map((field, index) => (
                  <Flex
                    key={field.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Form.Item
                      label={`Preference ${index + 1}`}
                      required={false}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing Preference',
                          },
                        ]}
                      >
                        <AllocateProjectSearchBar
                          initialValue={{
                            label: form.getFieldValue([
                              'preferences',
                              field.name,
                              'label',
                            ]),
                            value: form.getFieldValue([
                              'preferences',
                              field.name,
                              'value',
                            ]),

                            title: form.getFieldValue([
                              'preferences',
                              field.name,
                              'label',
                            ]),
                          }}
                          handleSelect={(val) => {
                            form.setFieldValue(
                              ['preferences', field.name, 'value'],
                              val.value
                            )
                            form.setFieldValue(
                              ['preferences', field.name, 'label'],
                              val.title
                            )
                          }}
                        />
                      </Form.Item>
                    </Form.Item>

                    <Button
                      style={{
                        marginLeft: 8,
                        marginTop: 5,
                      }}
                      onClick={() => {
                        remove(field.name)
                      }}
                    >
                      -
                    </Button>
                  </Flex>
                ))}
                {fields.length < 3 ? (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: '100%' }}
                    >
                      Add Preference
                    </Button>
                  </Form.Item>
                ) : null}
                <Form.Item></Form.Item>
              </Fragment>
            )}
          </Form.List>
        </Form>
      </FormWrapper>
    </Modal>
  )
}

export default PreferenceEditModal
