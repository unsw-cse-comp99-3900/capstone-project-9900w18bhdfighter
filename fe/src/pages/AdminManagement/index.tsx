import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import type {
  FormInstance,
  InputRef,
  TableColumnsType,
  TableColumnType,
} from 'antd'
import { Flex, Modal, Table, Tooltip } from 'antd'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import styled from 'styled-components'
import { role, roleNames } from '../../constant/role'
import ModalProfileEdit from '../../components/ModalProfileEdit'
import TextFilter from './components/TextFilter'
import ActionGroup from './components/ActionGroup'
import AccountManagementContextProvider, {
  useAccountManagementContext,
} from '../../context/AccountManagementContext'
import { UserInfo, UserUpdate } from '../../types/user'
import { useAuthContext } from '../../context/AuthContext'
import ProfileLink from '../../components/ProfileLink'
import { useGlobalTheme } from '../../context/GlobalThemeContext'
import breakPoint from '../../constant/breakPoint'
import { getThemeToken } from '../../utils/styles'

interface DataType {
  key: number
  name: string
  role: string
  email: string
}

type DataIndex = keyof DataType

const Wrapper = styled(Flex)`
  box-sizing: border-box;
  padding: ${getThemeToken('paddingMD', 'px')};
  width: 100%;
  height: 100%;
`

const _AdminManagement = () => {
  const searchInput = useRef<InputRef>(null)
  const currUsrIdOnRowRef = useRef<number | null>(null)
  const { usrInfo: _usrInfo } = useAuthContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currProfileViewing, setCurrProfileViewing] = useState<UserInfo | null>(
    null
  )
  const { windowWidth, onWidth } = useGlobalTheme()
  const { accountList, getAccountList, deleteAccount, updateAccount } =
    useAccountManagementContext()

  const data = useMemo(
    () =>
      accountList
        .map((account) => ({
          key: account.id,
          name: account.firstName + ' ' + account.lastName,
          role: roleNames[account.role],
          email: account.email,
        }))
        .filter((account) => account.key !== _usrInfo?.id),
    [accountList, _usrInfo]
  )
  useEffect(() => {
    getAccountList()
  }, [])
  const handleDelete = async (record: DataType) => {
    currUsrIdOnRowRef.current = record.key
    Modal.confirm({
      type: 'warning',
      title: 'You are about to delete a user. Are you sure?',
      onOk: async () => {
        currUsrIdOnRowRef.current &&
          (await deleteAccount(currUsrIdOnRowRef.current))
        await getAccountList()
      },
    })
  }
  const handleOk = async (form: FormInstance) => {
    //validate
    try {
      const values = await form.validateFields()
      const usrInfo: UserUpdate = {
        FirstName: values.firstName,
        LastName: values.lastName,
        EmailAddress: values.email,
        UserRole: values.role,
        UserInformation: values.description,
        Areas: values.interestAreas,
        Passwd: values.password,
      }
      Object.keys(usrInfo).forEach(
        (key) =>
          usrInfo[key as keyof UserUpdate] === undefined &&
          delete usrInfo[key as keyof UserUpdate]
      )
      currProfileViewing &&
        (await updateAccount(currProfileViewing.id, usrInfo))
      await getAccountList()
      setIsModalOpen(false)
    } catch (err) {
      console.log(err)
    }
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
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <Tooltip title={text} placement="topLeft">
          <ProfileLink usrId={record.key}>{text}</ProfileLink>
        </Tooltip>
      ),
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
      ellipsis: {
        showTitle: false,
      },
      onFilter: (value, record) => record.role === value,
      render: (_role) => (
        <Tooltip title={_role} placement="topLeft">
          {_role}
        </Tooltip>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: {
        showTitle: false,
      },
      render: (email) => (
        <Tooltip title={email} placement="topLeft">
          {email}
        </Tooltip>
      ),
      ...getColumnSearchProps('email'),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <ActionGroup
          handleDelete={() => {
            handleDelete(record)
          }}
          handleManage={() => {
            currUsrIdOnRowRef.current = record.key
            const usr = accountList.find(
              (_usr: UserInfo) => _usr.id === record.key
            )
            setCurrProfileViewing(usr || null)
            console.log(usr)

            setIsModalOpen(true)
          }}
        />
      ),
      responsive: ['md'],
    },
  ]

  return (
    <Wrapper>
      <ModalProfileEdit
        title="Manage User"
        userInfo={currProfileViewing}
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        viewerRole={role.ADMIN}
      ></ModalProfileEdit>

      <Table
        style={{
          width: '100%',
          height: '100%',
        }}
        size={onWidth({
          xs: 'middle',
          defaultValue: 'large',
        })}
        expandable={
          windowWidth > breakPoint.sm
            ? {}
            : {
                expandedRowRender: (record) => (
                  <Flex
                    vertical
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ActionGroup
                      handleDelete={() => {
                        handleDelete(record)
                      }}
                      handleManage={() => {
                        currUsrIdOnRowRef.current = record.key
                        const usr = accountList.find(
                          (_usr: UserInfo) => _usr.id === record.key
                        )
                        setCurrProfileViewing(usr || null)
                        setIsModalOpen(true)
                      }}
                    />
                  </Flex>
                ),
              }
        }
        scroll={{ y: '65vh' }}
        columns={columns}
        dataSource={data}
      />
    </Wrapper>
  )
}

const AdminManagement = () => {
  return (
    <AccountManagementContextProvider>
      <_AdminManagement />
    </AccountManagementContextProvider>
  )
}

export default AdminManagement
