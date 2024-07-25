import { Input } from 'antd'
import React from 'react'

import { debounce } from '../../utils/optimize'

type Props = React.ComponentProps<typeof Input.Search> & {
  handleChange: (_value: string) => void
}

const DebounceSimpleSearcher = ({ handleChange, ...props }: Props) => {
  const debounceSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value)
  }, 500)
  return <Input {...props} onChange={debounceSearch}></Input>
}

export default DebounceSimpleSearcher
