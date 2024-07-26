import { Flex, List, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import route from '../../../constant/route'
import { GroupAss } from '../../../types/groupAsses'
import { timeFormat } from '../../../utils/parse'

type Props = {
  item: GroupAss
}

const GroupsAssessmentListItem: React.FC<Props> = ({ item }) => {
  const ProjectLink = () => {
    if (item.project)
      return (
        <Flex vertical>
          <Typography.Text>
            Related Project:{' '}
            <Link to={`${route.PROJECTS}/${item.project.projectId}`}>
              {item.project.projectName}
            </Link>
          </Typography.Text>

          {item.submission && (
            <Typography.Text>
              Last Submission: {timeFormat(item.submission.submissionTime)}
            </Typography.Text>
          )}
        </Flex>
      )

    return (
      <Typography.Text type="secondary">
        This Group is not assigned to any project.
      </Typography.Text>
    )
  }

  return (
    <List.Item.Meta
      title={
        <Flex vertical>
          <Typography.Text ellipsis>
            <Link to={`${route.GROUPS}/${item.groupId}`}>{item.groupName}</Link>
          </Typography.Text>
          <Typography.Text type="secondary">
            {item.groupScore && '(Marked)'}
          </Typography.Text>
        </Flex>
      }
      description={<ProjectLink />}
    />
  )
}

export default GroupsAssessmentListItem
