export interface ILogin {
  name: string
  password: string
  rememberMe: boolean
}

export interface ILoginResponse {
  id: number
  name?: string
  token: string
}
