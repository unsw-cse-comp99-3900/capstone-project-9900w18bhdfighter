import React, { useState } from 'react'
import { Button, Descriptions, List, Modal, Form } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const ListHeader = styled.div`
  font-weight: bold;
`

const ListItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
// interface GroupValue {
//   label: ReactNode
//   value: number
//   title: string
//   description: string
// }

const AllocationDetail: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [autoCompGroupList, setAutoCompGroupList] = useState<Group[]>([])
  // const [selectedGroup, setSelectedGroup] = useState<GroupValue | null>(null) // Add state to store selected group

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showConfirmModal = (item: string) => {
    Modal.confirm({
      title: 'Are you sure you want to remove this allocation?',
      content: `You are about to remove ${item}. This action cannot be undone.`,
      onOk: () => {
        console.log(`Removing item: ${item}`)
        // Here you would handle the removal logic
      },
      onCancel: () => {
        // setItemToRemove(null)
      },
    })
  }

  // const getAutoCompleteGroups = async (val: GroupValue) => {
  //   const fetchedGroups = await getAutoCompleteGroups(val, true)
  //   console.log('selected group', selectedGroup)
  //   setAutoCompGroupList(fetchedGroups)
  // }

  // const handleChange = async (val: GroupValue) => {
  //   // Implement the logic to handle the selected group
  //   console.log(`Selected group: ${val.label}`)
  //   console.log('selected group', selectedGroup)
  // }

  // const addGroupMember = (val: GroupValue) => {
  //   setSelectedGroup(val)
  // }

  return (
    <Wrapper>
      <HeaderWrapper>
        <Descriptions
          title="Allocation Detail for Project 1"
          bordered={false}
          style={{ marginBottom: 0 }}
        />
        <Button type="primary" onClick={showModal}>
          Add Allocation
        </Button>
      </HeaderWrapper>
      <List
        style={{ width: '100%', marginTop: 20 }}
        header={<ListHeader>Allocation List</ListHeader>}
        bordered
        dataSource={['Allocation 1', 'Allocation 2', 'Allocation 3']}
        renderItem={(item) => (
          <List.Item>
            <ListItemWrapper>
              {item}
              <Button
                type="link"
                onClick={() => showConfirmModal(item)}
                style={{ marginLeft: 'auto' }}
              >
                Remove
              </Button>
            </ListItemWrapper>
          </List.Item>
        )}
      />
      <Modal
        title="Add Group"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item label="Group Name">
            <FlexContainer>
              {/* <GroupSearchBar
                getAutoCompleteGroups={getAutoCompleteGroups}
                handleChange={handleChange}
                setCurrAutoCompleteGroup={setAutoCompGroupList}
                autoCompGroupList={autoCompGroupList}
                handleSelect={addGroupMember} // Pass the handleSelect prop
              /> */}
            </FlexContainer>
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
