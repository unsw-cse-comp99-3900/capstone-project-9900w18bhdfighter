import { createContext, useContext, useEffect, useState } from 'react'
import { Area } from '../../types/user'
import { getAreasList, mapAreaDTOToArea } from '../../api/areaAPI'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'

interface GlobalConstantContextType {
  AREA_LIST: Area[] | null
}

const GlobalConstantContext = createContext({} as GlobalConstantContextType)

export const useGlobalConstantContext = () => useContext(GlobalConstantContext)

const GlobalConstantProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [AREA_LIST, setAreaList] = useState<Area[] | null>(null)
  const { msg } = useGlobalComponentsContext()
  const fetchAreas = async () => {
    try {
      const res = await getAreasList()
      setAreaList(res.data.data.map(mapAreaDTOToArea))
    } catch (e) {
      msg.err('Network error')
    }
  }
  useEffect(() => {
    // fetch area list
    fetchAreas()
  }, [])

  const ctx = {
    AREA_LIST,
  }
  return (
    <GlobalConstantContext.Provider value={ctx}>
      {children}
    </GlobalConstantContext.Provider>
  )
}

export default GlobalConstantProvider
