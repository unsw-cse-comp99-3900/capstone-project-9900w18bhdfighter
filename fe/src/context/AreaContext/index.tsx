import { ReactNode, createContext, useContext, useState } from 'react'
import { useGlobalComponentsContext } from '../GlobalComponentsContext'
import { Area } from '../../types/user'
import { errHandler } from '../../utils/parse'
import { getAreasList, mapAreaDTOToArea } from '../../api/areaAPI'

interface AreaContextType {
  areaList: Area[]
  getAreaList: () => void
}
const AreaContext = createContext<AreaContextType>({} as AreaContextType)

export const useAreaContext = () => useContext(AreaContext)
const AreaContextProvider = ({ children }: { children: ReactNode }) => {
  const { msg } = useGlobalComponentsContext()
  const [areaList, setAreaList] = useState<Area[]>([])

  const getAreaList = async () => {
    try {
      const res = await getAreasList()
      const _areaList = res.data.data.map(mapAreaDTOToArea)
      setAreaList(_areaList)
    } catch (err) {
      errHandler(
        err,
        (str) => msg.err(str),
        (str) => msg.err(str)
      )
    }
  }

  const ctx = {
    areaList,
    getAreaList,
  }
  return <AreaContext.Provider value={ctx}>{children}</AreaContext.Provider>
}

export default AreaContextProvider
