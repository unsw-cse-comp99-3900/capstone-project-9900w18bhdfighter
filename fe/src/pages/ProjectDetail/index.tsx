import { Button, Descriptions, Flex, List, Tag } from 'antd'
import styled from 'styled-components'
import { getThemeToken } from '../../utils/styles'
import Link from 'antd/es/typography/Link'

import { nanoid } from 'nanoid'

import route from '../../constant/route'
import GroupSearchBar from './components/GroupSearchBar'
import ProjectDetailContextProvider, {
  useProjectDetailContext,
} from '../../context/ProjectDetailContext'

const Wrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding: ${getThemeToken('paddingLG', 'px')};
`

const _ProjectDetail = () => {
  const { project, ownerName, creatorName, groupsList, removeGroup } =
    useProjectDetailContext()

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
          {project?.description}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="Expected Skills">
          {project?.requiredSkills.map((skill) => (
            <Tag style={{ margin: '0.1rem' }} color="orange" key={nanoid()}>
              {skill.skillName}
            </Tag>
          ))}
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
                    key="1"
                    size="small"
                    type="text"
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
