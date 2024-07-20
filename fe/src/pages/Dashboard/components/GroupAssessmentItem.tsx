import React from 'react'
import { List } from 'antd'
import { Group } from '../../../types/group'

type Props = {
  item: Group
}

const GroupsAssessmentListItem: React.FC<Props> = ({ item }) => {
  return (
    <List.Item.Meta
      title={item.groupName}
      description={`Description: ${item.groupDescription}`}
    />
  )
}

export default GroupsAssessmentListItem
// import React from 'react'
// import { List, Tag } from 'antd'
// import styled from 'styled-components'
// import { Group } from '../../../types/group'

// type Props = {
//   item: Group
// }

// const TitleWrapper = styled.div`
//   display: flex;
//   align-items: center;
// `

// const DescriptionWrapper = styled.div`
//   & > p {
//     margin: 0;
//   }
// `

// const Paragraph = styled.div`
//   margin: 0;
// `

// const GroupsAssessmentListItem: React.FC<Props> = ({ item }) => {
//   return (
//     <List.Item>
//       <List.Item.Meta
//         title={
//           <TitleWrapper>
//             {item.groupName}
//             <Tag style={{ marginLeft: 8 }} color="blue">
//               {item.maxMemberNum}
//             </Tag>
//           </TitleWrapper>
//         }
//         description={
//           <DescriptionWrapper>
//             <Paragraph>{`Description: ${item.groupDescription}`}</Paragraph>
//             <Paragraph>{`Created by: ${item.createdBy}`}</Paragraph>
//             <Paragraph>{`Number of members: ${item.groupMembers.length}`}</Paragraph>
//           </DescriptionWrapper>
//         }
//       />
//     </List.Item>
//   )
// }

// export default GroupsAssessmentListItem
