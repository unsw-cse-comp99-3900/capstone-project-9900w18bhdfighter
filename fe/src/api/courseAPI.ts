import { Course, CourseRspDTO } from '../types/course'
import api from './config'

const getAllCourses = async () => {
  return api.get('api/courses')
}

//mapper

const mapCourseDTOToCourse = (dto: CourseRspDTO): Course => {
  return {
    id: dto.CourseCodeID,
    courseName: dto.CourseName,
  }
}
export { getAllCourses, mapCourseDTOToCourse }
