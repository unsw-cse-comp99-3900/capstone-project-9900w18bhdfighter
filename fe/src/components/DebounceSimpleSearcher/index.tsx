import { Input } from 'antd'
import React from 'react'

type Props = React.ComponentProps<typeof Input.Search>

const DebounceSimpleSearcher = (props: Props) => {
  return <Input.Search {...props}></Input.Search>
}

export default DebounceSimpleSearcher
