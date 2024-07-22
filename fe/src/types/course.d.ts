interface Course {
  id: number
  courseName: string
}

interface CourseReqDTO {
  courseName: string
}

interface CourseRspDTO {
  CourseCodeID: number
  CourseName: string
}

export { Course, CourseReqDTO, CourseRspDTO }
