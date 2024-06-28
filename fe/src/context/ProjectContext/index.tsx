import { ReactNode, createContext, useContext } from 'react'
import { ProjectCreate } from '../../types/proj'
import api from '../../api/config'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { isAxiosError } from 'axios'

interface ProjectContextType {
  createProject: (_project: ProjectCreate) => void
  updateProject: () => void
  deleteProject: () => void
  getProjectsList: () => void
}

const ProjectContext = createContext({} as ProjectContextType)
export const useProjectContext = () =>
  useContext<ProjectContextType>(ProjectContext)

const ProjectContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const createProject = async (project: ProjectCreate) => {
    try {
      const res = await api.post('project_creation/', project)
      msg.success('Project created successfully!')
      console.log(res)
    } catch (err) {
      if (isAxiosError(err)) {
        msg.err(err.response?.data.error)
      } else {
        msg.err('Something went wrong')
      }
    }

    //todo: implement create project
  }
  const updateProject = () => {
    //todo: implement update project
  }
  const deleteProject = () => {
    //todo: implement delete project
  }
  const getProjectsList = () => {
    //todo: implement get projects list
  }

  const ctx = {
    createProject,
    updateProject,
    deleteProject,
    getProjectsList,
  }

  return (
    <ProjectContext.Provider value={ctx}>{children}</ProjectContext.Provider>
  )
}

export default ProjectContextProvider
