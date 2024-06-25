const randomChoose = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export { randomChoose }
