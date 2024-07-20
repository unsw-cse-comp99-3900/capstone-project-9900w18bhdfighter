import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Project, ProjectCreate } from '../../types/proj'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { errHandler } from '../../utils/parse'
import {
  getProjectsByCreator,
  mapProjectDTOToProject,
} from '../../api/projectAPI'

import { useAuthContext } from '../AuthContext'
interface ProjectContextType {
  createProject: (_project: ProjectCreate) => Promise<void>
  updateProject: () => void

  getProjectsList: (_email: string) => Promise<void>
  projectList: Project[] | null
}

const ProjectContext = createContext({} as ProjectContextType)
export const useProjectContext = () =>
  useContext<ProjectContextType>(ProjectContext)

const ProjectContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const [projectList, setProjectList] = useState<Project[] | null>(null)
  const { usrInfo } = useAuthContext()

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
  const createProject = async (project: ProjectCreate) => {
    try {
      await api.post('project_creation/', project)
      msg.success('Project created successfully!')
      await getProjectsList(usrInfo?.email as string)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }

    //todo: implement create project
  }

  useEffect(() => {
    if (!usrInfo) return
    getProjectsList(usrInfo.email)
  }, [usrInfo?.id])
  const ctx = {
    createProject,
    updateProject,

    getProjectsList,
    projectList,
  }

  return (
    <ProjectContext.Provider value={ctx}>{children}</ProjectContext.Provider>
  )
}

export default ProjectContextProvider
