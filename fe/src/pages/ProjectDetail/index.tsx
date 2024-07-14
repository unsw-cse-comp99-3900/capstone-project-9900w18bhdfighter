import { Button, Descriptions, Flex, List, Tag, Typography } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'

import { nanoid } from 'nanoid'

import route from '../../constant/route'
import GroupSearchBar from './components/GroupSearchBar'
import ProjectDetailContextProvider, {
  useProjectDetailContext,
} from '../../context/ProjectDetailContext'

import { useMemo, useState } from 'react'
import { ProjectReqDTO } from '../../types/proj'
import ModalProjectForm from '../../components/ModalProjectForm'
import { role } from '../../constant/role'
import { useAuthContext } from '../../context/AuthContext'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const EditWrapper = styled(Flex)`
  width: 100%;
  justify-content: flex-end;
`
const EditButton = styled(Button)``
const _ProjectDetail = () => {
  const {
    project,
    ownerName,
    creatorName,
    groupsList,
    removeGroup,
    updateCurrentGroup,
  } = useProjectDetailContext()
  const [isOpened, setIsOpened] = useState(false)
  const { role: _role, usrInfo } = useAuthContext()
  const handleOk = async (projectUpdateDTO: ProjectReqDTO) => {
    updateCurrentGroup(projectUpdateDTO)
    setIsOpened(false)
  }
  const handleCancel = () => {
    setIsOpened(false)
  }
  const initialData = useMemo(() => {
    if (!project) return undefined
    return {
      projectName: project.name,
      description: project.description,
      skills: project.requiredSkills.map((skill) => ({
        area: skill.area.id,
        skill: skill.skillName,
      })),
      email: project.owner,
      maxGroupNumber: project.maxNumOfGroup,
    }
  }, [project])

  const isAdmin = () => {
    return _role === role.ADMIN
  }
  const isManager = () => {
    return _role === role.ADMIN || _role === role.TUTOR || _role === role.CORD
  }
  const isOwner = () => {
    return project?.projectOwnerId === usrInfo?.id
  }
  const isCreator = () => {
    return project?.createdBy === usrInfo?.id
  }
  const shouldDisplayEdit = () => {
    return isAdmin() || isOwner() || isCreator()
  }
  const shouldDisplayRemove = () => {
    return isManager()
  }
  return (
    <Wrapper>
      <ModalProjectForm
        title="Edit Project"
        initialData={initialData}
        isModalOpen={isOpened}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <EditWrapper
        style={{
          display: shouldDisplayEdit() ? 'flex' : 'none',
        }}
      >
        <EditButton type="primary" onClick={() => setIsOpened(true)}>
          Edit
        </EditButton>
      </EditWrapper>
      <Descriptions
        style={{
          width: '100%',
        }}
        bordered
        title="Project Detail"
      >
        <Descriptions.Item span={3} label="Project Name">
          {project?.name}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Owner">
          <Link href={`${route.PROFILE}/${project?.projectOwnerId}`}>
            {ownerName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Creator">
          <Link
            href={`
            ${route.PROFILE}/${project?.createdBy}
          `}
          >
            {creatorName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          {project?.description ? (
            <Typography.Text>{project?.description}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">
              No description provided.
            </Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Expected Skills">
          {project?.requiredSkills.length ? (
            project?.requiredSkills.map((skill) => (
              <Tag style={{ margin: '0.1rem' }} color="orange" key={nanoid()}>
                {skill.skillName}
              </Tag>
            ))
          ) : (
            <Typography.Text type="secondary">
              No expected skills provided.
            </Typography.Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Participating Groups">
          <GroupSearchBar />
          <List
            bordered
            style={{
              maxHeight: '15rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {groupsList?.map((group) => (
              <List.Item
                key={group.groupId}
                actions={[
                  <Button
                    onClick={() => removeGroup(group.groupId)}
                    key={group.groupId}
                    size="small"
                    type="text"
                    style={{
                      display: shouldDisplayRemove() ? 'block' : 'none',
                    }}
                    danger
                  >
                    Remove
                  </Button>,
                ]}
              >
                {group.groupName}
              </List.Item>
            ))}
          </List>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

const ProjectDetail = () => {
  return (
    <ProjectDetailContextProvider>
      <_ProjectDetail />
    </ProjectDetailContextProvider>
  )
}
export default ProjectDetail
