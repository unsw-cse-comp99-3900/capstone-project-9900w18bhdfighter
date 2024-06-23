import type { GlobalToken } from 'antd'
import 'styled-components'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends GlobalToken {}
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    requiresToken?: boolean
  }
}
