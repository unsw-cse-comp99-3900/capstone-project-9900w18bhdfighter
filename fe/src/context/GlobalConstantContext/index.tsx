import { createContext, useContext, useEffect, useState } from 'react'
import { Area } from '../../types/user'
import { getAreasList, mapAreaDTOToArea } from '../../api/areaAPI'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { getTimeRules, mapTimeRuleDTOToTimeRule } from '../../api/timeRuleAPI'
import { TimeRule } from '../../types/timeRule'
import { Course } from '../../types/course'
import { getAllCourses, mapCourseDTOToCourse } from '../../api/courseAPI'

interface GlobalConstantContextType {
  AREA_LIST: Area[] | null
  PROJECT_DUE: string | null
  GROUP_FORMATION_DUE: string | null
  fetchTimeRules: () => Promise<void>
  timeRules: TimeRule[] | null
  COURSE_LIST: Course[] | null
}

const GlobalConstantContext = createContext({} as GlobalConstantContextType)

export const useGlobalConstantContext = () => useContext(GlobalConstantContext)

const GlobalConstantProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [AREA_LIST, setAreaList] = useState<Area[] | null>(null)
  const [timeRules, setTimeRules] = useState<TimeRule[] | null>(null)
  const [PROJECT_DUE, setProjectDue] = useState<string | null>(null)
  const [GROUP_FORMATION_DUE, setGroupFormationDue] = useState<string | null>(
    null
  )
  const [COURSE_LIST, setCourseList] = useState<Course[] | null>(null)
  const { msg } = useGlobalComponentsContext()
  const fetchAreas = async () => {
    try {
      const res = await getAreasList()
      setAreaList(res.data.data.map(mapAreaDTOToArea))
    } catch (e) {
      msg.err('Network error')
    }
  }
  const fetchTimeRules = async () => {
    try {
      const res = await getTimeRules()
      const rules = res.data.data.map(mapTimeRuleDTOToTimeRule)
      const activeRule = rules.find((rule) => rule.isActive)
      const pTime = activeRule?.projectDeadline
      const gTime = activeRule?.groupFreezeTime
      setTimeRules(rules)
      setGroupFormationDue(gTime || null)
      setProjectDue(pTime || null)
    } catch (e) {
      msg.err('Network error')
    }
  }
  const fetchCourseList = async () => {
    try {
      const res = await getAllCourses()
      setCourseList(res.data.data.map(mapCourseDTOToCourse))
    } catch (e) {
      msg.err('Network error')
    }
  }
  useEffect(() => {
    // fetch area list
    fetchAreas()
    fetchTimeRules()
    fetchCourseList()
  }, [])

  const ctx = {
    AREA_LIST,
    PROJECT_DUE,
    GROUP_FORMATION_DUE,
    fetchTimeRules,
    timeRules,
    COURSE_LIST,
  }
  return (
    <GlobalConstantContext.Provider value={ctx}>
      {children}
    </GlobalConstantContext.Provider>
  )
}

export default GlobalConstantProvider
