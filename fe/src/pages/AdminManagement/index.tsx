import { useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import type { InputRef, TableColumnsType, TableColumnType } from 'antd'
import { Button, Divider, Flex, Modal, Table } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import styled from 'styled-components'
import { role, roleNames, roleNamesEnum } from '../../constant/role'
import { nanoid } from 'nanoid'
import { useAuthContext } from '../../context/AuthContext'
import ModalProfileEdit from '../../components/ModalProfileEdit'
import TextFilter from './components/TextFilter'

interface DataType {
  key: string
  name: string
  role: string
  email: string
}

type DataIndex = keyof DataType
const data: DataType[] = new Array(100).fill(0).map((_, i) => ({
  key: nanoid() as string,
  name: `Mock Name ${i}`,
  role: [
    roleNamesEnum.ADMIN,
    roleNamesEnum.TUTOR,
    roleNamesEnum.CORD,
    roleNamesEnum.CLIENT,
    roleNamesEnum.STUDENT,
  ][i % 5] as string,
  email: `Mock${i}@gmail.com`,
}))

const Wrapper = styled(Flex)`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 100%;
`
const AdminManagement = () => {
  const searchInput = useRef<InputRef>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { usrInfo } = useAuthContext()
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: (props) => (
      <TextFilter
        dataIndex={dataIndex}
        handleReset={handleReset}
        handleSearch={handleSearch}
        searchInput={searchInput}
        {...props}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',

      ...getColumnSearchProps('name'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',

      filters: [
        { text: roleNames[role.ADMIN], value: roleNames[role.ADMIN] },
        { text: roleNames[role.TUTOR], value: roleNames[role.TUTOR] },
        { text: roleNames[role.CORD], value: roleNames[role.CORD] },
        { text: roleNames[role.CLIENT], value: roleNames[role.CLIENT] },
        { text: roleNames[role.STUDENT], value: roleNames[role.STUDENT] },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',

      ...getColumnSearchProps('email'),
    },
    {
      title: '',
      key: 'action',
      render: () => (
        <Flex
          align="center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              setIsModalOpen(true)
            }}
            size="small"
            type="link"
          >
            Manage
          </Button>
          <Divider type="vertical" />

          <Button
            onClick={() => {
              setIsDeleteModalOpen(true)
            }}
            size="small"
            danger
            type="link"
          >
            Delete
          </Button>
        </Flex>
      ),
    },
  ]

  return (
    <Wrapper>
      <ModalProfileEdit
        title="Manage User"
        userInfo={usrInfo}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      ></ModalProfileEdit>
      <Modal
        title="You are about to delete a user. Are you sure?"
        open={isDeleteModalOpen}
        okButtonProps={{ danger: true }}
        onOk={() => setIsDeleteModalOpen(false)}
        onCancel={() => setIsDeleteModalOpen(false)}
      ></Modal>
      <Table
        style={{
          width: '100%',
          height: '100%',
        }}
        scroll={{ y: '65vh' }}
        columns={columns}
        dataSource={data}
      />
    </Wrapper>
  )
}

export default AdminManagement
