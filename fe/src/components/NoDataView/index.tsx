import { Flex, Typography } from 'antd'

const NoDataView = ({ children }: { children: string }) => (
  <Flex
    style={{
      height: '100%',

      justifyContent: 'center',
      marginTop: '1rem',
    }}
  >
    <Typography.Paragraph type="secondary">{children}</Typography.Paragraph>
  </Flex>
)
export default NoDataView
