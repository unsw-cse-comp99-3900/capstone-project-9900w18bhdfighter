// // import { useState } from 'react'
// // import GroupSearchBar from '../../../components/GroupSearchBar'
// // import { GroupRspDTO } from '../../../types/group'
// // import {
// //   getAutoCompleteGroups,
// //   //   mapGroupDTOToGroupRspDTO,
// // } from '../../../api/groupAPI'
// // import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
// // // import { useAuthContext } from '../../../context/AuthContext'

// // type Props = {
// //   handleSelect: (_id: number) => Promise<void>
// // }

// // const AddGroupAllocationSearchBar = ({ handleSelect }: Props) => {
// //   const [potentialGroups, setPotentialGroups] = useState<GroupRspDTO[]>([])
// //   //   const { usrInfo } = useAuthContext()
// //   //   const autoCompGroupWithoutSelf = potentialGroups.filter(
// //   //     (group) => group.GroupName !== usrInfo?.email
// //   //   )
// //   const autoCompGroupWithoutSelf = potentialGroups
// //   const { msg } = useGlobalComponentsContext()

// //   return (
// //     <GroupSearchBar
// //       handleChange={async (option) => {
// //         handleSelect(option.value)
// //       }}
// //       getAutoCompleteGroups={async (val) => {
// //         try {
// //           const res = await getAutoCompleteGroups(val)
// //           //   setPotentialGroups(res.data.data.map(mapGroupDTOToGroupRspDTO))
// //           setPotentialGroups(res.data.data)
// //         } catch (e) {
// //           msg.err('Failed to fetch groups')
// //         }
// //       }}
// //       setCurrAutoCompleteGroup={setPotentialGroups}
// //       autoCompGroupList={autoCompGroupWithoutSelf}
// //       placeholder="Type name to add a group"
// //     />
// //   )
// // }

// // export default AddGroupAllocationSearchBar
// import { useState } from 'react'
// import GroupSearchBar from '../../../components/GroupSearchBar'
// import { GroupRspDTO, GroupSlim } from '../../../types/group'
// import {
//   getAutoCompleteGroups,
//   //   mapGroupDTOToGroupRspDTO,
// } from '../../../api/groupAPI'
// import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
// // import { useAuthContext } from '../../../context/AuthContext'

// type Props = {
//   handleSelect: (_id: number) => Promise<void>
// }

// const mapGroupRspDTOToGroupSlim = (groupRspDTO: GroupRspDTO): GroupSlim => ({
//   groupId: groupRspDTO.GroupID,
//   groupName: groupRspDTO.GroupName,
//   groupDescription: groupRspDTO.GroupDescription,
// })

// const AddGroupAllocationSearchBar = ({ handleSelect }: Props) => {
//   const [potentialGroups, setPotentialGroups] = useState<GroupSlim[]>([])
//   //   const { usrInfo } = useAuthContext()
//   //   const autoCompGroupWithoutSelf = potentialGroups.filter(
//   //     (group) => group.GroupName !== usrInfo?.email
//   //   )
//   const autoCompGroupWithoutSelf = potentialGroups
//   const { msg } = useGlobalComponentsContext()

//   return (
//     <GroupSearchBar
//       handleChange={async (option) => {
//         handleSelect(option.value)
//       }}
//       getAutoCompleteGroups={async (val) => {
//         try {
//           const res = await getAutoCompleteGroups(val)
//           const mappedGroups = res.data.data.map(mapGroupRspDTOToGroupSlim)
//           setPotentialGroups(mappedGroups)
//         } catch (e) {
//           msg.err('Failed to fetch groups')
//         }
//       }}
//       setCurrAutoCompleteGroup={setPotentialGroups}
//       autoCompGroupList={autoCompGroupWithoutSelf}
//       placeholder="Type name to add a group"
//     />
//   )
// }

// export default AddGroupAllocationSearchBar
