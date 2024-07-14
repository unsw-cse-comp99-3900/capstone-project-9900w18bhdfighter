import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Tooltip,
  Typography,
} from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import { ProjectReqDTO } from '../../types/proj'
import ProjectContextProvider, {
  useProjectContext,
} from '../../context/ProjectContext'
import { Link } from 'react-router-dom'
import route from '../../constant/route'
import ModalProjectForm from '../../components/ModalProjectForm'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const Header = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`
const ProjectCard = styled(Card)``

const _Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createProject, projectList } = useProjectContext()

  const handleOk = async (projectCreateDto: ProjectReqDTO) => {
    await createProject(projectCreateDto)

    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <Wrapper>
      <ModalProjectForm
        title="New Project"
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      ></ModalProjectForm>
      <Header>
        <Typography.Title level={3}>My Projects</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Project
        </Button>
      </Header>
      <Divider />
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
    </Wrapper>
  )
}

const Projects = () => (
  <ProjectContextProvider>
    <_Projects />
  </ProjectContextProvider>
)
export default Projects
