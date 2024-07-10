import { Button, Divider, Flex } from 'antd'

type Props = {
  handleManage: () => void
  handleDelete: () => void
}

const ActionGroup = ({ handleManage, handleDelete }: Props) => {
  return (
    <Flex
      align="center"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button onClick={handleManage} size="small" type="link">
        Manage
      </Button>
      <Divider type="vertical" />

      <Button onClick={handleDelete} size="small" danger type="link">
        Delete
      </Button>
    </Flex>
  )
}

export default ActionGroup
