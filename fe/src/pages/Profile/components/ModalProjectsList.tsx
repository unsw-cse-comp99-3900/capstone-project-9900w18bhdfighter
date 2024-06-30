import { Modal, Transfer } from 'antd'
import React, { useState } from 'react'
import type { TransferProps } from 'antd/es/transfer'
import styled from 'styled-components'

interface Props extends React.ComponentProps<typeof Modal> {
  isModalOpen: boolean
  handleOk: () => void
  handleCancel: () => void
  noEdit: boolean
}

interface RecordType {
  key: string
  title: string
  description: string
}
const _Modal = styled(Modal)`
  width: 1000px;
`
const mockData: RecordType[] = Array.from({ length: 30 }).map((_, i) => ({
  key: i.toString(),
  title: `project${i + 1}`,
  description: `description of content${i + 1}`,
}))

const initialTargetKeys = mockData
  .filter((item) => Number(item.key) > 10)
  .map((item) => item.key)

const ModalProjectsList = ({
  isModalOpen,
  handleOk,
  handleCancel,
  noEdit,
}: Props) => {
  const [targetKeys, setTargetKeys] =
    useState<TransferProps['targetKeys']>(initialTargetKeys)
  const [selectedKeys, setSelectedKeys] = useState<TransferProps['targetKeys']>(
    []
  )

  const onChange: TransferProps['onChange'] = (
    nextTargetKeys,
    direction,
    moveKeys
  ) => {
    console.log('targetKeys:', nextTargetKeys)
    console.log('direction:', direction)
    console.log('moveKeys:', moveKeys)
    setTargetKeys(nextTargetKeys)
  }

  const onSelectChange: TransferProps['onSelectChange'] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => {
    console.log('sourceSelectedKeys:', sourceSelectedKeys)
    console.log('targetSelectedKeys:', targetSelectedKeys)
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
  }

  const onScroll: TransferProps['onScroll'] = (direction, e) => {
    console.log('direction:', direction)
    console.log('target:', e.target)
  }
  return (
    <_Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      styles={{
        body: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <Transfer
        disabled={noEdit}
        listStyle={{
          width: 300,
          height: 400,
        }}
        dataSource={mockData}
        titles={['Projects List', 'My Preferred Projects']}
        targetKeys={targetKeys as string[]}
        selectedKeys={selectedKeys as string[]}
        onChange={onChange}
        onSelectChange={onSelectChange}
        onScroll={onScroll}
        render={(item) => item.title}
      />
    </_Modal>
  )
}

export default ModalProjectsList
