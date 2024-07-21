import { Flex, List, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Project } from '../../../types/proj'
import route from '../../../constant/route'

type Props = {
  item: Project
}
const ProjectsListItem = ({ item }: Props) => {
  return (
    <List.Item.Meta
      title={<Link to={`${route.PROJECTS}/${item.id}`}>{item.name}</Link>}
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
