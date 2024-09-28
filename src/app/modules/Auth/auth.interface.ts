import { USER_ROLE } from '../user/usre.constant'

export type TRegisterUser = {
  email: string
  password: string
  name: string
  role: keyof typeof USER_ROLE
}
