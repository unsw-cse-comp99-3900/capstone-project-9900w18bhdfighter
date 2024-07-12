const breakPoint = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200, //1200px
  xxl: 1600,
} as const
type BreakPointKey = keyof typeof breakPoint
export default breakPoint
export type { BreakPointKey }
