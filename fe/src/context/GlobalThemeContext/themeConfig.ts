import { generateColorPalette } from '../../utils/styles'

interface ThemeColor {
  grayscalePalette: ReadonlyArray<string>
  basicBg: string
  highlight: string
  primary: string
  font: string
}

//current theme color
const themeColor = {
  // use for multi-purpose(borders, icons, text, backgrounds, etc.)
  //step 36
  grayscalePalette: generateColorPalette('#FFFFFF', '#404040', 36),
  basicBg: '#FFFFFF',
  highlight: '#FCDE12',
  primary: '#000000',
  font: '#000000',
}

export { themeColor }
export type { ThemeColor }
