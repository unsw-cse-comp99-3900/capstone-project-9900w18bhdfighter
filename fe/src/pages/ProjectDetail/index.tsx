import {
  Button,
  Descriptions,
  Flex,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd'
import styled from 'styled-components'
import type { DescriptionsProps } from 'antd/es/descriptions'
import { getThemeToken } from '../../utils/styles'
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
import dayjs from 'dayjs'
import { useGlobalTheme } from '../../context/GlobalThemeContext'
import { Link, useNavigate } from 'react-router-dom'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`
const Title = styled(Typography.Text)`
  font-size: 1.2rem;
`
const Header = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: end;
  padding: ${getThemeToken('paddingMD', 'px')};
`
const EditButton = styled(Button)``
const Description = styled(Descriptions)`
  box-shadow: ${getThemeToken('boxShadow')};
`
const _ProjectDetail = () => {
  const {
    project,
    ownerName,
    creatorName,
    groupsList,
    removeGroup,
    updateCurrentGroup,
    deleteProject,
  } = useProjectDetailContext()

  const [isOpened, setIsOpened] = useState(false)
  const { usrInfo, isInRoleRange } = useAuthContext()
  const { onWidth } = useGlobalTheme()
  const navigate = useNavigate()
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
      dueTime: dayjs(project.dueTime),
    }
  }, [project])

  const isCreator = () => {
    return project?.createdBy === usrInfo?.id
  }

  const accessToEditProjectMeta = () => {
    return isInRoleRange([role.ADMIN, role.CORD]) || isCreator()
  }
  const accessToAssignGroup = () => {
    return isInRoleRange([role.ADMIN, role.CORD, role.TUTOR])
  }

  const items: DescriptionsProps['items'] = [
    {
      span: 2,
      label: 'Project Name',
      children: project?.name,
    },
    {
      span: 2,
      label: 'Due',
      children: (
        <Space>
          {
            <Typography.Text ellipsis>
              {project?.dueTime.format('DD/MM/YYYY HH:mm')}
            </Typography.Text>
          }
        </Space>
      ),
    },
    {
      span: 2,
      label: 'Owner',
      children: (
        <Link to={`${route.PROFILE}/${project?.projectOwnerId}`}>
          {ownerName}
        </Link>
      ),
    },
    {
      span: 2,
      label: 'Creator',
      children: (
        <Link to={`${route.PROFILE}/${project?.createdBy}`}>{creatorName}</Link>
      ),
    },
    {
      span: 3,

      label: 'Description',
      children: project?.description ? (
        <Typography.Text>{project?.description}</Typography.Text>
      ) : (
        <Typography.Text type="secondary">
          No description provided.
        </Typography.Text>
      ),
    },
    {
      span: 3,
      label: 'Expected Skills',
      children: project?.requiredSkills.length ? (
        project?.requiredSkills.map((skill) => (
          <Tag style={{ margin: '0.1rem' }} color="orange" key={nanoid()}>
            {skill.skillName}
          </Tag>
        ))
      ) : (
        <Typography.Text type="secondary">
          No expected skills provided.
        </Typography.Text>
      ),
    },
    {
      span: 3,
      label: 'Participating Groups',
      children: (
        <Flex vertical>
          <Flex>
            <GroupSearchBar
              style={{
                display: accessToAssignGroup() ? 'block' : 'none',
              }}
            />
          </Flex>

          <List
            bordered
            itemLayout={onWidth({
              sm: 'vertical',
              defaultValue: 'horizontal',
            })}
            size={onWidth({
              sm: 'small',
              defaultValue: 'default',
            })}
            style={{
              maxHeight: '15rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            {groupsList?.map((group) => (
              <List.Item key={group.groupId}>
                <Typography.Text>
                  <Link to={`${route.GROUPS}/${group.groupId}`}>
                    {group.groupName}
                  </Link>
                </Typography.Text>
                <Button
                  size={onWidth({
                    sm: 'small',
                    defaultValue: 'default',
                  })}
                  onClick={() => removeGroup(group.groupId)}
                  key={group.groupId}
                  type="text"
                  style={{
                    display: accessToAssignGroup() ? 'block' : 'none',
                    width: onWidth({
                      sm: '100%',
                      defaultValue: 'unset',
                    }),
                  }}
                  danger
                >
                  Remove
                </Button>
              </List.Item>
            ))}
          </List>
        </Flex>
      ),
    },
  ]
  if (!project)
    return (
      <Wrapper>
        <Spin></Spin>
      </Wrapper>
    )
  return (
    <Wrapper>
      <ModalProjectForm
        title="Edit Project"
        initialData={initialData}
        isModalOpen={isOpened}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <Header>
        <Title strong>Project Detail</Title>

        <Space align="center">
          <EditButton
            style={{
              display: accessToEditProjectMeta() ? 'block' : 'none',
            }}
            type="primary"
            onClick={() => setIsOpened(true)}
          >
            Edit
          </EditButton>
          <Button
            style={{
              display: accessToEditProjectMeta() ? 'block' : 'none',
            }}
            danger
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: 'Do you want to delete this project?',
                content:
                  'When clicked the OK button, this project will be deleted.',
                onOk: async () => {
                  await deleteProject(project.id)
                  navigate(route.DASHBOARD, {
                    replace: true,
                  })
                },
              })
            }}
          >
            Delete
          </Button>
        </Space>
      </Header>

      <Description
        style={{
          width: onWidth({
            xs: 'unset',
            defaultValue: '100%',
          }),
        }}
        size={onWidth({
          xs: 'small',
          defaultValue: 'default',
        })}
        bordered
        items={items}
      ></Description>
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
