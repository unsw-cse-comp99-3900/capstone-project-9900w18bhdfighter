import { Select, Spin, Typography } from 'antd'
import { SelectProps } from 'antd/lib/select'
import { ReactNode, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { debounce } from '../../utils/optimize'
import { ProjectProfileSlim } from '../../types/proj'

const SearchBar = styled(Select)`
  width: 100%;
`
const Text = styled(Typography.Text)``

export interface ProjectSearchBarOptionValue {
  label: ReactNode
  value: number
  title: string
}

type Props = {
  getAutoCompleteProjects: (_val: string) => Promise<void>
  handleChange: (_val: ProjectSearchBarOptionValue) => Promise<void>
  setCurrAutoCompleteProjects: React.Dispatch<
    React.SetStateAction<ProjectProfileSlim[]>
  >
  initialValue?: ProjectSearchBarOptionValue | undefined
  autoCompProjectsWithoutSelf: ProjectProfileSlim[] // Adjust the prop name here
} & Partial<SelectProps>

const ProjectSearchBar = ({
  handleChange,
  getAutoCompleteProjects,
  setCurrAutoCompleteProjects,
  autoCompProjectsWithoutSelf,
  initialValue,
  ...props
}: Props) => {
  const [fetching, setFetching] = useState(false)
  const [value, setValue] = useState<ProjectSearchBarOptionValue | null>(
    initialValue
      ? {
          ...initialValue,
          label: <Text strong>{initialValue.title}</Text>,
        }
      : null
  )
  const debounceFetcher = useMemo(() => {
    const loadOptions = async (val: string) => {
      setCurrAutoCompleteProjects([])
      if (val.trim() === '') return
      setFetching(true)
      await getAutoCompleteProjects(val)
      setFetching(false)
    }
    return debounce(loadOptions, 500)
  }, [getAutoCompleteProjects, setCurrAutoCompleteProjects])

  useEffect(() => {
    console.log('autoCompProjects:', autoCompProjectsWithoutSelf) // Log the projects to ensure they are passed correctly
  }, [autoCompProjectsWithoutSelf])

  return (
    <SearchBar
      value={value}
      labelInValue
      showSearch
      filterOption={false}
      onSearch={debounceFetcher}
      options={autoCompProjectsWithoutSelf.map((project) => ({
        label: <Text strong>{project.name}</Text>,
        value: project.id,
        title: project.name,
      }))}
      notFoundContent={fetching ? <Spin size="small" /> : 'No projects found'}
      onChange={async (val) => {
        await handleChange(val as ProjectSearchBarOptionValue)
        setValue(val as ProjectSearchBarOptionValue)
      }}
      placeholder="Type project name to search"
      loading={fetching}
      {...props}
    />
  )
}

export default ProjectSearchBar
