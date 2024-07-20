import { createContext, useContext, useEffect, useState } from 'react'
import { useAuthContext } from '../AuthContext'
import {
  getProjectByParticipant,
  mapProjectDTOToProject,
} from '../../api/projectAPI'
import { errHandler } from '../../utils/parse'
import { Project } from '../../types/proj'

interface SubmissionTabContextType {
  selectedSubmissionId: number
  setSelectedSubmissionId: (_id: number) => void
  participatedProject: Project[] | null
  getMyProject: () => Promise<void>
  undueProjects: Project[]
}

const SubmissionTabContext = createContext<SubmissionTabContextType>(
  {} as SubmissionTabContextType
)

export const useSubmissionTabContext = () => useContext(SubmissionTabContext)

const SubmissionTabProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(0)
  const { usrInfo } = useAuthContext()
  const [participatedProject, setParticipatedProject] = useState<
    Project[] | null
  >(null)
  const undueProjects =
    participatedProject?.filter((project) => {
      const dueTime = project.dueTime.toDate()
      const currentTime = new Date()
      return dueTime <= currentTime
    }) || []
  const getMyProject = async () => {
    if (!usrInfo) return
    try {
      const res = await getProjectByParticipant(usrInfo?.id)
      setParticipatedProject(res.data.map(mapProjectDTOToProject))
    } catch (e) {
      errHandler(
        e,
        (str) => console.log(str),
        (str) => console.log(str)
      )
    }
  }
  useEffect(() => {
    getMyProject()
  }, [])

  const ctx = {
    selectedSubmissionId,
    setSelectedSubmissionId,
    participatedProject,
    getMyProject,
    undueProjects,
  }
  return (
    <SubmissionTabContext.Provider value={ctx}>
      {children}
    </SubmissionTabContext.Provider>
  )
}

export default SubmissionTabProvider
