import { Button, Divider, Flex } from 'antd'

type Props = {
  handleManage: () => void
  handleDelete: () => void
  className?: string
}

const ActionGroup = ({ handleManage, handleDelete, className }: Props) => {
  return (
    <Flex
      align="center"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className={className}
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
