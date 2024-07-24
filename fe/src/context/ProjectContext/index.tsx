import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Project, ProjectCreate } from '../../types/proj'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { errHandler } from '../../utils/parse'
import {
  getProjectByParticipant,
  getProjectsByCreator,
  mapProjectDTOToProject,
} from '../../api/projectAPI'

import { useAuthContext } from '../AuthContext'
import { role } from '../../constant/role'
interface ProjectContextType {
  createProject: (_project: ProjectCreate) => Promise<void>
  updateProject: () => void
  getProjList: () => Promise<void>
  projectList: Project[] | null
}

const ProjectContext = createContext({} as ProjectContextType)
export const useProjectContext = () =>
  useContext<ProjectContextType>(ProjectContext)

const ProjectContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const [projectList, setProjectList] = useState<Project[] | null>(null)
  const { usrInfo, isInRoleRange } = useAuthContext()

  const updateProject = () => {
    //todo: implement update project
  }

  const getProjectsList = async (email: string) => {
    try {
      const res = await getProjectsByCreator(email)
      setProjectList(res.data.map(mapProjectDTOToProject))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const getParticipatedProjects = async () => {
    if (!usrInfo) return
    try {
      const res = await getProjectByParticipant(usrInfo?.id)
      setProjectList(res.data.map(mapProjectDTOToProject))
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  const createProject = async (project: ProjectCreate) => {
    try {
      await api.post('api/project_creation/', project)
      msg.success('Project created successfully!')
      await getProjectsList(usrInfo?.email as string)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }
  //get project list based on user role
  const getProjList = useCallback(() => {
    if (!usrInfo) return Promise.resolve()
    if (isInRoleRange([role.STUDENT])) {
      return getParticipatedProjects()
    } else {
      return getProjectsList(usrInfo.email)
    }
  }, [usrInfo?.id])

  useEffect(() => {
    if (!usrInfo) return
    getProjList()
  }, [usrInfo?.id])
  const ctx = {
    createProject,
    updateProject,
    getParticipatedProjects,
    getProjList,
    projectList,
  }

  return (
    <ProjectContext.Provider value={ctx}>{children}</ProjectContext.Provider>
  )
}

export default ProjectContextProvider
