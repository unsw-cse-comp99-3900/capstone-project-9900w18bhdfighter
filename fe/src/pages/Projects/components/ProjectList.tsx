import { Card, Col, Flex, Row, Tooltip, Typography } from 'antd'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import route from '../../../constant/route'
import { useProjectContext } from '../../../context/ProjectContext'
import NoDataView from '../../../components/NoDataView'
const ProjectCard = styled(Card)``
const ProjectList = () => {
  const { projectList } = useProjectContext()

  if (!projectList) {
    return (
      <NoDataView>You do not have any projects to view or manage.</NoDataView>
    )
  }
  return (
    <Row gutter={[16, 8]}>
      {projectList.map((project) => (
        <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
          <ProjectCard
            style={{
              height: '10rem',
            }}
            title={project.name}
            extra={<Link to={`${route.PROJECTS}/${project.id}`}>More</Link>}
          >
            <Flex vertical>
              <Flex>
                <Tooltip title={project.description}>
                  {project.description ? (
                    <Typography.Paragraph ellipsis={{ rows: 3 }}>
                      {project.description}
                    </Typography.Paragraph>
                  ) : (
                    <Typography.Paragraph type="secondary">
                      No Description Provided.
                    </Typography.Paragraph>
                  )}
                </Tooltip>
              </Flex>
            </Flex>
          </ProjectCard>
        </Col>
      ))}
    </Row>
  )
}

export default ProjectList
