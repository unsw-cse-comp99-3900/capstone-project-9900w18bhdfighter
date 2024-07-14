const randomChoose = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)] as T
}
const randomColor = (
  arr = [
    'blue',
    'green',
    'red',
    'orange',
    'purple',
    'magenta',
    'volcano',
    'gold',
    'lime',
    'cyan',
  ]
): string => {
  return arr[Math.floor(Math.random() * arr.length)] as string
}

export { randomChoose, randomColor }
