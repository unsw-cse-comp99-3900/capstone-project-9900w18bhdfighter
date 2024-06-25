import { ConfigProvider, theme as _theme } from 'antd'
import { Dispatch, ReactNode, createContext, useContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { ThemeColor, themeColor as _themeColor } from './themeConfig'

//https://ant.design/docs/spec/colors-cn
type Props = {
  children: ReactNode
}

interface GlobalThemeContextType {
  setThemeColor: Dispatch<ThemeColor>
}

const GlobalThemeContext = createContext<GlobalThemeContextType>(
  {} as GlobalThemeContextType
)

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
              Menu: {
                itemSelectedColor: 'white',
              },
              Table: {
                rowSelectedBg: _themeColor.grayscalePalette[20] as string,
                rowSelectedHoverBg: _themeColor.grayscalePalette[20] as string,
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
