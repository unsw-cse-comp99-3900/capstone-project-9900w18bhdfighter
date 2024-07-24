import { Flex, List, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import route from '../../../constant/route'
import { Project } from '../../../types/proj'
import { CustomTitle } from './GroupListItem'

type Props = {
  item: Project
}

const ProjectsListItem = ({ item }: Props) => {
  return (
    <List.Item.Meta
      title={
        <Flex vertical>
          <Link to={`${route.PROJECTS}/${item.id}`}>{item.name}</Link>
          <CustomTitle>
            <Typography.Text
              style={{
                fontSize: '0.85rem',
              }}
            >
              ({item.involvedGroups.length}/{item.maxNumOfGroup})
            </Typography.Text>
          </CustomTitle>
        </Flex>
      }
      description={
        <Flex vertical>
          <Flex>
            <Tooltip title={item.description}>
              <Typography.Paragraph
                style={{
                  marginBottom: 0,
                }}
                type="secondary"
                ellipsis={{ rows: 3 }}
              >
                {item.description}
              </Typography.Paragraph>
            </Tooltip>
          </Flex>
          <Flex
            style={{
              marginTop: '0.5rem',
            }}
            wrap
          >
            {item.requiredSkills.map((skill) => (
              <Tag color="orange" key={skill.skillId}>
                {skill.skillName}
              </Tag>
            ))}
          </Flex>
        </Flex>
      }
    />
  )
}

export default ProjectsListItem
