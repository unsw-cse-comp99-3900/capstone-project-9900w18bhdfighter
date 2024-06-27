import { Button, Divider, Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import NewProjectModal from './components/NewProjectModal'
import { ProjectCreate } from '../../types/proj'
import { useProjectContext } from '../../context/ProjectContext'

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

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createProject } = useProjectContext()

  const handleOk = async (projectCreateDto: ProjectCreate) => {
    createProject(projectCreateDto)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <Wrapper>
      <NewProjectModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      ></NewProjectModal>
      <Header>
        <Typography.Title level={3}>My Projects</Typography.Title>
        <Button onClick={() => setIsModalOpen(true)} type="primary">
          New Project
        </Button>
      </Header>
      <Divider />
    </Wrapper>
  )
}

export default Projects
