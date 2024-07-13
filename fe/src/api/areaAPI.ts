import { Area, AreaDTO } from '../types/user'
import api from './config'

const mapAreaDTOToArea: (_areaDTO: AreaDTO) => Area = (areaDTO: AreaDTO) => {
  return {
    id: areaDTO.AreaID,
    name: areaDTO.AreaName,
  }
}
const getAreasList = async () => {
  return api.get<{
    data: AreaDTO[]
  }>('api/areas')
}

export { mapAreaDTOToArea, getAreasList }
