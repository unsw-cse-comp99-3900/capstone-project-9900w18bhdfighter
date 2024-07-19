import React, { useState } from 'react'
import { Button, Descriptions, List, Spin, Modal, Input, Form } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const ListHeader = styled.div`
  font-weight: bold;
`

const AllocationDetail: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <Wrapper>
      <Spin spinning={false}>
        <Descriptions title="Allocation Details" bordered>
          <Descriptions.Item label="Item 1">Content 1</Descriptions.Item>
          <Descriptions.Item label="Item 2">Content 2</Descriptions.Item>
          <Descriptions.Item label="Item 3">Content 3</Descriptions.Item>
        </Descriptions>
      </Spin>
      <Button type="primary" style={{ marginTop: 20 }} onClick={showModal}>
        Add Allocation
      </Button>
      <List
        style={{ width: '100%', marginTop: 20 }}
        header={<ListHeader>Allocation List</ListHeader>}
        bordered
        dataSource={['Allocation 1', 'Allocation 2', 'Allocation 3']}
        renderItem={(item) => (
          <List.Item>
            {item}
            <Button type="link" style={{ marginLeft: 'auto' }}>
              Edit
            </Button>
          </List.Item>
        )}
      />
      <Modal
        title="Add Allocation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Allocation Name">
            <Input placeholder="Enter allocation name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Wrapper>
  )
}

export default AllocationDetail
