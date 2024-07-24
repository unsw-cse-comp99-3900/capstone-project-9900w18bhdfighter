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
  participatedProject: Project | null
  getMyProject: () => Promise<void>
}

const SubmissionTabContext = createContext<SubmissionTabContextType>(
  {} as SubmissionTabContextType
)

export const useSubmissionTabContext = () => useContext(SubmissionTabContext)

const SubmissionTabProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(0)
  const { usrInfo } = useAuthContext()

  const [participatedProject, setParticipatedProject] =
    useState<Project | null>(null)

  const getMyProject = async () => {
    if (!usrInfo) return
    try {
      const res = await getProjectByParticipant(usrInfo?.id)
      setParticipatedProject(res.data.map(mapProjectDTOToProject)[0] || null)
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
  }
  return (
    <SubmissionTabContext.Provider value={ctx}>
      {children}
    </SubmissionTabContext.Provider>
  )
}

export default SubmissionTabProvider
