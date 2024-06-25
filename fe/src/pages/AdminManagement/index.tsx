import React, { useRef } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import type { InputRef, TableColumnsType, TableColumnType } from 'antd'
import { Button, Flex, Input, Space, Table } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { role, roleNames, roleNamesEnum } from '../../constant/role'
import { nanoid } from 'nanoid'

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
  padding: ${getThemeToken('paddingLG', 'px')};
  box-shadow: ${getThemeToken('boxShadow')};
  height: 100%;
`
const AdminManrolement: React.FC = () => {
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (confirm: FilterDropdownProps['confirm']) => {
    confirm()
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <Flex
        vertical
        style={{ padding: 8 }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false })
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </Flex>
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
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '20%',
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
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle" align="center">
          <Button size="small" type="primary">
            Manage
          </Button>
          <Button size="small" danger type="primary">
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Wrapper>
      <Table
        style={{
          width: '100%',
          height: '100%',
        }}
        columns={columns}
        dataSource={data}
      />
    </Wrapper>
  )
}

export default AdminManrolement