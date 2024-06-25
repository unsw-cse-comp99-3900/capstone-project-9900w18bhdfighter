type Role = {
  ADMIN: 5
  CLIENT: 2
  TUTOR: 3
  STUDENT: 1
  CORD: 4
}
const role: Role = {
  ADMIN: 5,
  CLIENT: 2,
  TUTOR: 3,
  STUDENT: 1,
  CORD: 4,
}
const roleNamesEnum = {
  ADMIN: 'Admin',
  CLIENT: 'Client',
  TUTOR: 'Tutor',
  STUDENT: 'Student',
  CORD: 'Coordinator',
}
const roleNames = {
  [role.ADMIN]: 'Admin',
  [role.CLIENT]: 'Client',
  [role.TUTOR]: 'Tutor',
  [role.STUDENT]: 'Student',
  [role.CORD]: 'Coordinator',
}
export { role, roleNames, Role, roleNamesEnum }
