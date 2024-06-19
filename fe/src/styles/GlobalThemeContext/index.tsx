import { ConfigProvider, theme as _theme } from 'antd'
import { ReactNode, createContext, useContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { generateColorPalette } from '../../utils/styles'

//https://ant.design/docs/spec/colors-cn
type Props = {
  children: ReactNode
}

const _themeColor = {
  // use for multi-purpose(borders, icons, text, backgrounds, etc.)
  //step 36
  grayscalePalette: generateColorPalette('#FFFFFF', '#404040', 36),
  basicBg: '#FFFFFF',
  highlight: '#FCDE12',
  primary: '#000000',
  font: '#000000',
}

console.log(_themeColor)

export type _themeColorKeys = keyof typeof _themeColor
export type ThemeColor = typeof _themeColor
const GlobalThemeContext = createContext({})

export const useGlobalTheme = () => useContext(GlobalThemeContext)
const GlobalAntdThemeProvider = ({ children }: Props) => {
  const { token } = _theme.useToken()
  const [themeColor, setThemeColor] = useState<ThemeColor>(_themeColor)

  const ctx = {
    setThemeColor,
  }
  return (
    <GlobalThemeContext.Provider value={ctx}>
      <ThemeProvider theme={{ ...token, themeColor: themeColor }}>
        <ConfigProvider
          theme={{
            ..._theme,
            components: {
              Typography: {
                titleMarginBottom: 0,
                fontWeightStrong: 700,
              },
              Layout: {
                headerBg: _themeColor.basicBg,
                siderBg: _themeColor.basicBg,
                footerBg: _themeColor.basicBg,
              },
            },
            token: {
              colorPrimary: _themeColor.primary,

              borderRadius: 0,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </GlobalThemeContext.Provider>
  )
}

export default GlobalAntdThemeProvider
