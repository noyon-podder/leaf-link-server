import { USER_ROLE } from '../user/user.constant'

export type TRegisterUser = {
  email: string
  password: string
  name: string
  role: keyof typeof USER_ROLE
}

export type TLoginUser = {
  email: string
  password: string
}
