import type { GlobalToken, ThemeConfig } from 'antd'
import 'styled-components'
import { ThemeColor } from './context/GlobalThemeContext/themeConfig'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends GlobalToken, ThemeConfig {
    themeColor: ThemeColor
  }
}
