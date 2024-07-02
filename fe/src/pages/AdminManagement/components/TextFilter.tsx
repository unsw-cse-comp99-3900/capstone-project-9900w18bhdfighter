import { Button, Flex, Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { FilterDropdownProps } from 'antd/es/table/interface'
import type { InputRef } from 'antd/es/input/Input'

type Props = {
  dataIndex: string
  searchInput: React.RefObject<InputRef>
  handleSearch: (_confirm: FilterDropdownProps['confirm']) => void
  handleReset: (_clearFilters: () => void) => void
} & FilterDropdownProps

const TextFilter = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  dataIndex,
  searchInput,
  handleSearch,
  handleReset,
}: Props) => {
  return (
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
          onClick={() => {
            clearFilters && handleReset(clearFilters)
            handleSearch(confirm)
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </Flex>
  )
}

export default TextFilter
