import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import { Project, ProjectReqDTO } from '../../types/proj'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { Group } from '../../types/group'
import {
  getProjectById,
  killOneProject,
  mapProjectDTOToProject,
  updateProject,
} from '../../api/projectAPI'
import { getUserById } from '../../api/userAPI'
import {
  assignGroupToProject,
  getGroupByProjectId,
  mapGroupDTOToGroup,
  removeGroupFromProject,
} from '../../api/groupAPI'
import { errHandler } from '../../utils/parse'

interface ProjectDetailContextType {
  project: Project | null
  setProject: Dispatch<SetStateAction<Project | null>>
  ownerName: string | null
  setOwnerName: Dispatch<SetStateAction<string | null>>
  creatorName: string | null
  setCreatorName: React.Dispatch<SetStateAction<string | null>>
  groupsList: Group[] | null
  setGroupsList: Dispatch<SetStateAction<Group[] | null>>
  fetchProjectDetail: () => Promise<void>
  removeGroup: (_groupId: number) => Promise<void>
  addGroup: (_data: { GroupID: number; ProjectID: number }) => Promise<void>
  updateCurrentGroup: (_projectUpdateDTO: ProjectReqDTO) => Promise<void>
  deleteProject: (_id: number | string) => Promise<void>
}

const ProjectDetailContext = createContext({} as ProjectDetailContextType)
export const useProjectDetailContext = () => useContext(ProjectDetailContext)
const ProjectDetailContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const id = useParams<{
    id: string
  }>().id
  const [project, setProject] = useState<Project | null>(null)
  const [ownerName, setOwnerName] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState<string | null>(null)
  const [groupsList, setGroupsList] = useState<Group[] | null>(null)

  const { msg } = useGlobalComponentsContext()

  const fetchProjectDetail = async () => {
    if (!id) return
    try {
      const res = await getProjectById(id)
      const _project = mapProjectDTOToProject(res.data)
      const ownerId = _project.projectOwnerId
      const creatorId = _project.createdBy
      const res1 = await getUserById(ownerId)
      const res2 = await getUserById(creatorId)
      const res3 = await getGroupByProjectId(_project.id)
      setOwnerName(res1.data.data.FirstName + ' ' + res1.data.data.LastName)
      setCreatorName(res2.data.data.FirstName + ' ' + res2.data.data.LastName)
      const _groupsList = res3.data.map(mapGroupDTOToGroup)
      setGroupsList(_groupsList)
      setProject(_project)
    } catch (e) {
      errHandler(
        e,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const removeGroup = async (groupId: number) => {
    try {
      await removeGroupFromProject(project?.id as number, groupId)
      await fetchProjectDetail()
      msg.success('Remove group success')
    } catch (e) {
      msg.err('Failed to remove group')
    }
  }
  const updateCurrentGroup = async (projectUpdateDTO: ProjectReqDTO) => {
    if (!id) return
    try {
      await updateProject(projectUpdateDTO, id)
      await fetchProjectDetail()
      msg.success('Update project success')
    } catch (e) {
      msg.err('Failed to update project')
    }
  }
  const addGroup = async (data: { GroupID: number; ProjectID: number }) => {
    try {
      await assignGroupToProject(data)
      await fetchProjectDetail()
      msg.success('Assign group success')
    } catch (e) {
      msg.err('Failed to assign group to project')
    }
  }
  const deleteProject = async (projId: string | number) => {
    try {
      await killOneProject(projId)
      msg.success('Project deleted successfully!')
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  useEffect(() => {
    fetchProjectDetail()
  }, [id])
  const ctx = {
    project,
    setProject,
    ownerName,
    setOwnerName,
    deleteProject,
    creatorName,
    setCreatorName,
    groupsList,
    setGroupsList,
    fetchProjectDetail,
    removeGroup,
    addGroup,
    updateCurrentGroup,
  }
  return (
    <ProjectDetailContext.Provider value={ctx}>
      {children}
    </ProjectDetailContext.Provider>
  )
}

export default ProjectDetailContextProvider
