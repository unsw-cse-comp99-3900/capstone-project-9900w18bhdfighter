interface Project {
  id: number
  name: string
  description: string
  owner: string
  maxNumOfGroup: number
  requiredSkills: string[]
}

type ProjectCreate = {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
}

export { Project, ProjectCreate }
