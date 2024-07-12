import { Button, Descriptions, Flex, List, Tag } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProjectById } from '../../api/projectAPI'
import { Project } from '../../types/proj'
import { mapProjectDTOToProject } from '../Dashboard/mapper'
import { nanoid } from 'nanoid'
import { getUserById } from '../../api/userAPI'
import { useGlobalComponentsContext } from '../../context/GlobalComponentsContext'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const ProjectDetail = () => {
  const id = useParams<{ id: string }>().id
  const [project, setProject] = useState<Project | null>(null)
  const [ownerName, setOwnerName] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState<string | null>(null)
  const { msg } = useGlobalComponentsContext()
  useEffect(() => {
    if (!id) return
    const toFetch = async () => {
      try {
        const res = await getProjectById(id)
        const _project = mapProjectDTOToProject(res.data)
        const ownerId = _project.projectOwnerId
        const creatorId = _project.createdBy
        const res1 = await getUserById(ownerId)
        const res2 = await getUserById(creatorId)
        setOwnerName(res1.data.data.FirstName + ' ' + res1.data.data.LastName)
        setCreatorName(res2.data.data.FirstName + ' ' + res2.data.data.LastName)
        setProject(_project)
      } catch (e) {
        msg.err('Failed to fetch project detail')
      }
    }
    toFetch()
  }, [id])

  return (
    <Wrapper>
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
          <Link href="/">{ownerName}</Link>
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Creator">
          <Link href="/">{creatorName}</Link>
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Description">
          {project?.description}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Expected Skills">
          {project?.requiredSkills.map((skill) => (
            <Tag style={{ margin: '0.1rem' }} color="orange" key={nanoid()}>
              {skill.skillName}
            </Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Paticipating Gorups">
          <Button size="small" type="primary">
            Assign Groups
          </Button>
          <List
            bordered
            style={{
              maxHeight: '15rem',
              overflow: 'auto',
              marginTop: '1rem',
            }}
          >
            <List.Item
              actions={[
                <Button key="1" size="small" type="primary">
                  Remove
                </Button>,
              ]}
            >
              Group 1
            </List.Item>
            <List.Item>Group 2</List.Item>
            <List.Item>Group 3</List.Item>
          </List>
        </Descriptions.Item>
      </Descriptions>
    </Wrapper>
  )
}

export default ProjectDetail
