export enum ESex {
  male,
  female
}

export type ITag = {
  id: number
  name: string
}

export type IPet = {
  id:          number
  name:        string
  age:         number
  sex:         ESex
  category: {
    id: number
    name: string
  }
  tags:         ITag[]
}