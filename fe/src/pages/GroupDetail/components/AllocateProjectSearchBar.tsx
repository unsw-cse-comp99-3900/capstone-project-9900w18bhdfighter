import React, { useState } from 'react'
import ProjectSearchBar from '../../../components/ProjectSearchBar'
import { ProjectProfileSlim } from '../../../types/proj'
import {
  getAutoCompleteProjectsByName,
  mapProjectSlimProfileDTOToProjectProfileSlim,
} from '../../../api/projectAPI'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useProjectContext } from '../../../context/ProjectContext'

type Props = {
  handleSelect: (_id: number) => Promise<void>
  setSelectedProject: React.Dispatch<
    React.SetStateAction<ProjectProfileSlim | null>
  >
}

const AllocateProjectSearchBar = ({
  handleSelect,
  setSelectedProject,
}: Props) => {
  const [potentialProjects, setPotentialProjects] = useState<
    ProjectProfileSlim[]
  >([])
  const { projectList = [] } = useProjectContext() // Initialize projectList with an empty array
  const { msg } = useGlobalComponentsContext()

  const autoCompProjectsWithoutSelf = potentialProjects.filter(
    (project) =>
      !projectList.some(
        (existingProject) => existingProject.name === project.name
      )
  )

  // Debugging: Log the response and mapped projects
  const handleGetAutoCompleteProjects = async (val: string) => {
    try {
      const res = await getAutoCompleteProjectsByName(val)
      console.log('API Response:', res)
      const mappedProjects = res.data.data.map(
        mapProjectSlimProfileDTOToProjectProfileSlim
      )
      console.log('Mapped Projects:', mappedProjects)
      setPotentialProjects(mappedProjects)
    } catch (e) {
      msg.err('Failed to fetch projects')
    }
  }

  console.log('Projlist', projectList)
  console.log('autoCompProjectsWithoutSelf', autoCompProjectsWithoutSelf)

  return (
    <ProjectSearchBar
      handleChange={async (option) => {
        handleSelect(option.value)
        const selectedOption = potentialProjects.find(
          (project) => project.id === option.value
        )
        if (selectedOption) {
          setSelectedProject(selectedOption)
        }
      }}
      getAutoCompleteProjects={handleGetAutoCompleteProjects}
      setCurrAutoCompleteProjects={setPotentialProjects}
      autoCompProjectsWithoutSelf={autoCompProjectsWithoutSelf} // Pass the filtered projects here
    />
  )
}

export default AllocateProjectSearchBar
