export interface Word {
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
}

export interface Error {
  code: string
  message: string
}

export interface Success {
  success: boolean
}
