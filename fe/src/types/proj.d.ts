interface Project {
  id: number
  name: string
  description: string
  owner: string
}

type ProjectCreate = {
  ProjectName: string
  ProjectDescription: string
  ProjectOwner: string
}

export { Project, ProjectCreate }
