import { Button, Flex, List, Popover } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import styled from 'styled-components'
import LinkButton from '../../../components/LinkButton'
// import GroupsListItem from './GroupListItem'

import DebounceSimpleSearcher from '../../../components/DebounceSimpleSearcher'
import route from '../../../constant/route'
import { useGlobalComponentsContext } from '../../../context/GlobalComponentsContext'
import { useGlobalConstantContext } from '../../../context/GlobalConstantContext'
import { getThemeToken } from '../../../utils/styles'
import GroupsAssessmentListItem from './GroupAssessmentItem'

import { getAllGroupAsses, getPDFReport } from '../../../api/assesAPI'
import { GroupAss } from '../../../types/groupAsses'
import GroupAssesFilter from './GroupAssesFilter'

type Props = {
  className?: string
}
const Wrapper = styled.div`
  box-shadow: ${getThemeToken('boxShadow')};
`

const _GroupsAssessmentList = styled(List)`
  height: calc(100vh - 10rem);
  overflow-y: auto;
`

const GroupsAssessmentList = ({ className = '' }: Props) => {
  const [list, setList] = useState<GroupAss[]>([])
  const [filteredLists, setFilteredLists] = useState<GroupAss[]>([])
  const originalList = useRef<GroupAss[]>([])
  const { msg } = useGlobalComponentsContext()
  const { isDueProject } = useGlobalConstantContext()
  const [loading, setLoading] = useState(false)
  const toFetch = async () => {
    try {
      const res = await getAllGroupAsses()
      const groups = res
      console.log('Due:', isDueProject)
      setList(groups)
      setFilteredLists(groups)
      originalList.current = groups
    } catch (e) {
      console.log(e)

      msg.err('Network error')
    }
  }

  const generateReport = async () => {
    try {
      setLoading(true)
      const res = await getPDFReport()
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'all_groups_report.pdf')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.open(url, '_blank')
      msg.success('Report generated successfully')
    } catch (e) {
      console.log(e)
      msg.err('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (val: string) => {
    setFilteredLists(
      list.filter((item) => {
        return (item as GroupAss).groupName
          .toLowerCase()
          .includes(val.toLowerCase())
      })
    )
  }

  useEffect(() => {
    toFetch()
    console.log('Due:', isDueProject)
  }, [msg])
  return (
    <Wrapper className={className}>
      <_GroupsAssessmentList
        bordered
        header={
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={10}>
              Assessment{' '}
              <Popover
                trigger={['click']}
                placement="top"
                content={
                  <DebounceSimpleSearcher
                    placeholder="Search by group name"
                    handleChange={handleSearchChange}
                  />
                }
              >
                <FaSearch style={{ cursor: 'pointer' }} />
              </Popover>
            </Flex>
            <Button
              loading={loading}
              onClick={generateReport}
              size="small"
              type="link"
            >
              Export
            </Button>
            <Flex vertical>
              <GroupAssesFilter
                groupAsslist={originalList.current}
                setList={setFilteredLists}
              />
            </Flex>
          </Flex>
        }
        dataSource={filteredLists}
        renderItem={(item) => (
          <List.Item
            actions={[
              // only due project/group can mark
              <LinkButton
                size="small"
                to={`${route.ASSESSMENT}/${(item as GroupAss).groupId}`}
                key={(item as GroupAss).groupId}
              >
                Mark
              </LinkButton>,
            ].filter(Boolean)}
          >
            <GroupsAssessmentListItem item={item as GroupAss} />
          </List.Item>
        )}
      />
    </Wrapper>
  )
}

export default GroupsAssessmentList
