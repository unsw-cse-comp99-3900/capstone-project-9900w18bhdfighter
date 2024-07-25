import { createContext, useContext, useEffect, useState } from 'react'
import { getGroupByParticipant, mapGroupDTOToGroup } from '../../api/groupAPI'
import {
  getProjectByParticipant,
  mapProjectDTOToProject,
} from '../../api/projectAPI'
import { getSubmissionByGroup } from '../../api/submissionAPI'
import { Group } from '../../types/group'
import { Project } from '../../types/proj'
import { Submission } from '../../types/submission'
import { errHandler } from '../../utils/parse'
import { useAuthContext } from '../AuthContext'

interface SubmissionTabContextType {
  selectedSubmissionId: number
  setSelectedSubmissionId: (_id: number) => void
  participatedProject: Project | null
  getMyProject: () => Promise<void>
  submission: Submission | null
  participatedGroup: Group | null
  getMySubmission: () => Promise<void>
}

const SubmissionTabContext = createContext<SubmissionTabContextType>(
  {} as SubmissionTabContextType
)

export const useSubmissionTabContext = () => useContext(SubmissionTabContext)

const SubmissionTabProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(0)
  const { usrInfo } = useAuthContext()
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [participatedProject, setParticipatedProject] =
    useState<Project | null>(null)
  const [participatedGroup, setParticipatedGroup] = useState<Group | null>(null)
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
  const getMyGroup = async () => {
    if (!usrInfo) return
    try {
      const res = await getGroupByParticipant(usrInfo?.id)
      setParticipatedGroup(res.data.map(mapGroupDTOToGroup)[0] || null)
    } catch (e) {
      errHandler(
        e,
        (str) => console.log(str),
        (str) => console.log(str)
      )
    }
  }

  const getMySubmission = async () => {
    if (!participatedGroup) return
    try {
      const res = await getSubmissionByGroup(participatedGroup?.groupId)
      setSubmission(res[0] || null)
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
    getMyGroup()
  }, [])

  useEffect(() => {
    getMySubmission()
  }, [participatedGroup])

  const ctx = {
    selectedSubmissionId,
    setSelectedSubmissionId,
    participatedProject,
    getMyProject,
    submission,
    participatedGroup,
    getMySubmission,
  }
  return (
    <SubmissionTabContext.Provider value={ctx}>
      {children}
    </SubmissionTabContext.Provider>
  )
}

export default SubmissionTabProvider
