import { Avatar, List, Skeleton } from 'antd'
import { Link } from 'react-router-dom'

export interface DataType {
  gender?: string
  name: {
    title?: string
    first?: string
    last?: string
  }
  email?: string
  picture: {
    large?: string
    medium?: string
    thumbnail?: string
  }
  nat?: string
  loading: boolean
}

type Props = {
  item: DataType
}
const ProjectsListItem = ({ item }: Props) => {
  return (
    <Skeleton avatar title={false} loading={(item as DataType).loading} active>
      <List.Item.Meta
        avatar={<Avatar src={(item as DataType).picture.large} />}
        title={
          <Link to="https://ant.design">{(item as DataType).name?.last}</Link>
        }
        description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. "
      />
    </Skeleton>
  )
}

export default ProjectsListItem
