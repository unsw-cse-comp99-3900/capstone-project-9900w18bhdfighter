/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GlobalToken } from 'antd'
import { css, type DefaultTheme } from 'styled-components'
import { ThemeColor } from '../context/GlobalThemeContext/themeConfig'
import breakPoint from '../constant/breakPoint'

// parse the theme token from styled-components
const getThemeToken = <T extends keyof GlobalToken>(key: T, unit = '') => {
  return ({ theme }: { theme: GlobalToken }) => theme[key] + unit
}
// parse the theme color from styled-components
const getThemeColor = (key: keyof ThemeColor, degrees = 0) => {
  if (key === 'grayscalePalette') {
    return ({ theme }: { theme: DefaultTheme }) =>
      theme.themeColor[key][degrees]
  } else {
    return ({ theme }: { theme: DefaultTheme }) => theme.themeColor[key]
  }
}

const getHeaderHeight = ({ theme }: { theme: DefaultTheme }) =>
  theme.components?.Layout?.headerHeight + 'px'

const generateColorPalette = (
  startColor: string,
  endColor: string,
  steps: number
) => {
  const start = parseInt(startColor.slice(1), 16)
  const end = parseInt(endColor.slice(1), 16)

  const r1 = (start >> 16) & 0xff
  const g1 = (start >> 8) & 0xff
  const b1 = start & 0xff

  const r2 = (end >> 16) & 0xff
  const g2 = (end >> 8) & 0xff
  const b2 = end & 0xff

  const palette = []
  for (let i = 0; i < steps; i++) {
    const r = Math.round(r1 + ((r2 - r1) / (steps - 1)) * i)
    const g = Math.round(g1 + ((g2 - g1) / (steps - 1)) * i)
    const b = Math.round(b1 + ((b2 - b1) / (steps - 1)) * i)
    const hex = ((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)
      .toUpperCase()
    palette.push(`#${hex}`)
  }
  return palette
}

type Media = {
  sm: (
    _strings: TemplateStringsArray,
    ..._args: any[]
  ) => ReturnType<typeof css>
  md: (
    _strings: TemplateStringsArray,
    ..._args: any[]
  ) => ReturnType<typeof css>
  lg: (
    _strings: TemplateStringsArray,
    ..._args: any[]
  ) => ReturnType<typeof css>
}

const media: Media = {
  sm: (strings, ...args) => css`
    @media (max-width: ${breakPoint.sm}) {
      ${css(strings, ...args)}
    }
  `,
  md: (strings, ...args) => css`
    @media (max-width: ${breakPoint.md}) {
      ${css(strings, ...args)}
    }
  `,
  lg: (strings, ...args) => css`
    @media (max-width: ${breakPoint.lg}) {
      ${css(strings, ...args)}
    }
  `,
}
// const breakPoint = {
//   xs: '480px',
//   sm: '576px',
//   md: '768px',
//   lg: '992px',
//   xl: '1200px', //1200px
//   xxl: '1600px',
// }

export {
  getThemeToken,
  getThemeColor,
  generateColorPalette,
  getHeaderHeight,
  media,
}
