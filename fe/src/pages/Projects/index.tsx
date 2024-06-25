import { Button, Divider, Flex, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import { useState } from 'react'
import NewProjectModal from './components/NewProjectModal'
import api from '../../api/config'
import { isAxiosError } from 'axios'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'
import { ProjectCreate } from '../../types/proj'

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
  const { msg } = useGlobalComponentsContext()

  const handleOk = async (projectCreateDto: ProjectCreate) => {
    const { ProjectName, ProjectDescription, ProjectOwner } = projectCreateDto
    try {
      const res = await api.post('project_creation/', {
        ProjectName,
        ProjectDescription,
        ProjectOwner,
      })
      msg.success('Project created successfully!')
      console.log(res.data)
    } catch (err) {
      if (isAxiosError(err)) {
        msg.err(err.response?.data.error)
      } else {
        msg.err('Something went wrong')
      }
    }

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
