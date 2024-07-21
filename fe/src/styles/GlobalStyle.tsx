import { createGlobalStyle } from 'styled-components'
import type { DefaultTheme } from 'styled-components'
export default createGlobalStyle`
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  html,
  body,
  #root,
  .App {
    height: 100%; 
  }
 
  ol,
  ul,
  li {
    list-style: none;
  }

  button {
    cursor: pointer;
  }


`

export const OverrideAntdDatePicker = createGlobalStyle<{
  theme: DefaultTheme
}>`
 .ant-picker-time-panel-cell-selected > .ant-picker-time-panel-cell-inner{
  color: ${({ theme }) => theme.themeColor.font} !important;
  background-color: ${({ theme }) => theme.themeColor.highlight} !important;

  }
  .ant-picker-cell-selected >.ant-picker-cell-inner{
    background-color:  ${({ theme }) => theme.themeColor.highlight} !important;
    color : ${({ theme }) => theme.themeColor.font} !important;
  }
 
`
