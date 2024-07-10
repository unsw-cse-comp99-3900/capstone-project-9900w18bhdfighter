import { generateColorPalette } from '../../utils/styles'

interface ThemeColor {
  grayscalePalette: ReadonlyArray<string>
  basicBg: string
  highlightSecondary: string
  highlight: string

  primary: string
  font: string
}

const palette = generateColorPalette('#FFFFFF', '#404040', 36)
//current theme color
const themeColor: ThemeColor = {
  // use for multi-purpose(borders, icons, text, backgrounds, etc.)
  //step 36
  grayscalePalette: palette,
  basicBg: '#FFFFFF',
  highlight: '#FCDE12',
  highlightSecondary: '#fce362',

  primary: 'black',
  font: '#000000',
}

export { themeColor }
export type { ThemeColor }
