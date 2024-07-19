import { Button, Descriptions, Flex, List, Space, Tag, Typography } from 'antd'
import styled from 'styled-components'
import type { DescriptionsProps } from 'antd/es/descriptions'
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
import dayjs from 'dayjs'
import { useGlobalTheme } from '../../context/GlobalThemeContext'

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
  const { onWidth } = useGlobalTheme()
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

  const isAdmin = () => {
    return _role === role.ADMIN
  }
  const isManager = () => {
    return _role === role.ADMIN || _role === role.TUTOR || _role === role.CORD
  }

  const isCreator = () => {
    return project?.createdBy === usrInfo?.id
  }
  const isCord = () => {
    return _role === role.CORD
  }
  const shouldDisplaySearchAndRemove = () => {
    return isManager()
  }
  const shouldDisplayEdit = () => {
    return isCreator() || isAdmin() || isCord()
  }

  const items: DescriptionsProps['items'] = [
    {
      span: 2,
      label: 'Project Name',
      children: project?.name,
    },
    {
      span: 1,
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
        <Link href={`${route.PROFILE}/${project?.projectOwnerId}`}>
          {ownerName}
        </Link>
      ),
    },
    {
      span: 1,
      label: 'Creator',
      children: (
        <Link
          href={`
        ${route.PROFILE}/${project?.createdBy}
      `}
        >
          {creatorName}
        </Link>
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
                display: shouldDisplaySearchAndRemove() ? 'block' : 'none',
              }}
            />
          </Flex>

          <List
            bordered
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
              <List.Item
                key={group.groupId}
                actions={[
                  <Button
                    onClick={() => removeGroup(group.groupId)}
                    key={group.groupId}
                    type="text"
                    style={{
                      display: shouldDisplaySearchAndRemove()
                        ? 'block'
                        : 'none',
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
        </Flex>
      ),
    },
  ]

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
          width: onWidth({
            sm: 'unset',
            defaultValue: '100%',
          }),
        }}
        size={onWidth({
          sm: 'small',
          defaultValue: 'default',
        })}
        bordered
        title="Project Detail"
        items={items}
      ></Descriptions>
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
