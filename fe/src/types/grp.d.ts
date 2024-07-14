interface Group {
  id: number
  name: string
  description: string
  owner: string
}

type GroupCreate = {
  GroupName: string
  GroupDescription: string
  GroupOwner: string
}

export { Group, GroupCreate }
