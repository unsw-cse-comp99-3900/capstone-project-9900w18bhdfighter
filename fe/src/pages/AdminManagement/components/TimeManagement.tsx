import {
  Table,
  Button,
  Space,
  Flex,
  Typography,
  Modal,
  Form,
  Input,
  Tag,
} from 'antd'

import styled from 'styled-components'
import { TableColumnsType } from 'antd/lib'
import { useGlobalTheme } from '../../../context/GlobalThemeContext'
import { getThemeToken } from '../../../utils/styles'
import ResponsiveForm from '../../../components/ResponsiveForm/ResponsiveForm'
import { useManagementContext } from '../../../context/ManagementContext'
import { TimeRule } from '../../../types/timeRule'
import { useState } from 'react'
import DatePicker from '../../../components/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { timeFormat } from '../../../utils/parse'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
`
// const ActiveRow = styled.div`
//   .ant-table-row-active {
//     background-color: ${getThemeColor('highlightSecondary')};
//   }
// `
const _Form = styled(ResponsiveForm)`
  padding: ${getThemeToken('paddingLG', 'px')};
`

//让active的拍在最上面
interface DataType extends TimeRule {
  key: number
}
const TimeManagement = () => {
  const { timeRules, delTimeRule, enableTimeRule, addTimeRule } =
    useManagementContext()
  const currActive = timeRules?.find((item) => item.isActive)
  const [isOpen, setIsOpen] = useState(false)

  //将active的排在最上面
  const sortedTimeRules =
    timeRules?.sort((a, b) => {
      if (a.isActive) return -1
      if (b.isActive) return 1
      return 0
    }) || []
  const data = sortedTimeRules.map((item) => ({ ...item, key: item.id }))
  const { onWidth } = useGlobalTheme()
  const handleDelete = (key: number) => {
    delTimeRule(key)
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: 'Project Deadline',
      dataIndex: 'projectDeadline',
      key: 'projectDueTime',
      render: (projectDeadline) => timeFormat(projectDeadline),
    },
    {
      title: 'Group Formation Deadline',
      dataIndex: 'groupFreezeTime',
      key: 'groupFreezeTime',
      render: (groupFreezeTime) => timeFormat(groupFreezeTime),
    },
    {
      ellipsis: true,
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',

      render: (isActive, record) =>
        isActive ? (
          <Tag color="gold-inverse">Active</Tag>
        ) : (
          <Button
            onClick={() => enableTimeRule(record.id)}
            type="link"
            style={{
              padding: 5,
            }}
          >
            Enable
          </Button>
        ),
    },
    {
      title: 'Action',
      key: 'action',

      render: (_, record) => (
        <Space size="middle">
          <Button danger type="link" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
      responsive: ['md'],
    },
  ]
  const [form] = Form.useForm()
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day')
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const ProjectDeadline = values.projectDeadline.toISOString()
      const GroupFreezeTime = values.groupFreezeTime.toISOString()
      const RuleName = values.ruleName

      await addTimeRule({
        RuleName,
        ProjectDeadline,
        GroupFreezeTime,
        IsActive: false,
      })
      setIsOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Wrapper vertical>
      <Modal
        title="New Rule"
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
      >
        <_Form form={form} layout="vertical">
          <Form.Item
            rules={[{ required: true, message: 'Please input rule name!' }]}
            label="Rule Name"
            name="ruleName"
          >
            <Input placeholder="Rule Name" />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: 'Please input project due time!' },
            ]}
            label="Project Due Time"
            name="projectDeadline"
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true, message: 'Please input group freeze time!' },
            ]}
            label="Group Freeze Time"
            name="groupFreezeTime"
          >
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
        </_Form>
      </Modal>
      <Flex
        style={{
          width: '100%',
          marginBottom: '1rem',
          justifyContent: 'space-between',
          padding: '0.25rem 1rem',
          alignItems: 'end',
        }}
      >
        <Typography.Text>
          Current Active Rule:{' '}
          <Typography.Text strong>{currActive?.ruleName}</Typography.Text>
        </Typography.Text>
        <Button onClick={() => setIsOpen(true)} size="middle" type="primary">
          New Rule
        </Button>
      </Flex>

      <Table
        size={onWidth({
          md: 'small',
          defaultValue: 'middle',
        })}
        expandable={onWidth({
          md: {
            expandedRowRender: (record: DataType) => (
              <Flex justify="center">
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </Flex>
            ),
          },
          defaultValue: {},
        })}
        columns={columns}
        dataSource={data}
        scroll={{ y: '55vh' }}
      />
    </Wrapper>
  )
}

export default TimeManagement
