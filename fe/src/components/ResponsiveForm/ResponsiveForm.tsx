import { Form } from 'antd'
import { ComponentProps } from 'react'
import { useGlobalTheme } from '../../context/GlobalThemeContext'

type Props = ComponentProps<typeof Form>

const ResponsiveForm = (props: Props) => {
  const { onWidth } = useGlobalTheme()
  return (
    <Form
      {...props}
      size={onWidth({
        sm: 'small',
        defaultValue: 'middle',
      })}
    >
      {props.children}
    </Form>
  )
}

export default ResponsiveForm
