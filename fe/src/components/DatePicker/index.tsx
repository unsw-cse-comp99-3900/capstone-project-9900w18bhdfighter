import { DatePicker as DP } from 'antd'
import React, { ComponentProps, Fragment } from 'react'
import { useTheme } from 'styled-components'
import { OverrideAntdDatePicker } from '../../styles/GlobalStyle'
import { useGlobalTheme } from '../../context/GlobalThemeContext'

type Props = ComponentProps<typeof DP>

const DatePicker = (props: Props) => {
  const theme = useTheme()
  const { onWidth } = useGlobalTheme()
  return (
    <Fragment>
      <OverrideAntdDatePicker theme={theme}></OverrideAntdDatePicker>
      <DP
        size={onWidth({
          sm: 'small',
          defaultValue: 'middle',
        })}
        style={{ width: '100%' }}
        showTime
        format={'DD/MM/YYYY HH:mm'}
        popupAlign={{ offset: onWidth({ xs: [50, 0], defaultValue: [0, 0] }) }}
        {...props}
      />
    </Fragment>
  )
}

export default DatePicker
