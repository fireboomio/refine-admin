export type IUser = {
  id: number
  createdAt: string
  name: string
  provider: string
  avatarUrl?: string
}

export type IUserFilterVariables = {
  name?: string
  createdAt?: string
}