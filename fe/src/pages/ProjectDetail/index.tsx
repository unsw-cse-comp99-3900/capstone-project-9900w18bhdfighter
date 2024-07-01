import { Button, Descriptions, Flex, List, Tag } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const ProjectDetail = () => {
  return (
    <Wrapper>
      <Descriptions bordered title="Project Detail">
        <Descriptions.Item span={3} label="Project Name">
          Mock Name
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Owner">
          <Link href="/">Client</Link>
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Creator">
          <Link href="/">TUT</Link>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          123
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Expected Skills">
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: '0.1rem' }} color="magenta">
            magenta
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Paticipating Gorups">
          <Button size="small" type="primary">
            Assign Groups
          </Button>
          <List
            bordered
            style={{
              maxHeight: '15rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <List.Item
              actions={[
                <Button key="1" size="small" type="primary">
                  Remove
                </Button>,
              ]}
            >
              Group 1
            </List.Item>
            <List.Item>Group 2</List.Item>
            <List.Item>Group 3</List.Item>
          </List>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

export default ProjectDetail
