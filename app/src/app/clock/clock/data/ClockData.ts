export class Arrow {
  type: string
  x: number
  y: number
  d: number
  image: string
}

class OneData {
  width: number
  height: number
  background: string
  arrows: Arrow[]
}

export class ClockData {
  images: OneData[]
}
