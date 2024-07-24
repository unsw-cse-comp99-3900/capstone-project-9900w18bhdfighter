import { Button, Divider, Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import { ProjectReqDTO } from '../../types/proj'
import ProjectContextProvider, {
  useProjectContext,
} from '../../context/ProjectContext'
import ModalProjectForm from '../../components/ModalProjectForm'
import ProjectList from './components/ProjectList'
import { useAuthContext } from '../../context/AuthContext'
import { role } from '../../constant/role'

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
const NewProjectButton = styled(Button)<{
  display: boolean
}>`
  display: ${(props) => (props.display ? 'block' : 'none')};
`
const _Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { createProject } = useProjectContext()
  const { isInRoleRange } = useAuthContext()
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
        <NewProjectButton
          display={!isInRoleRange([role.STUDENT])}
          onClick={() => setIsModalOpen(true)}
          type="primary"
        >
          New Project
        </NewProjectButton>
      </Header>
      <Divider />
      <ProjectList />
    </Wrapper>
  )
}

const Projects = () => (
  <ProjectContextProvider>
    <_Projects />
  </ProjectContextProvider>
)
export default Projects
