import jwt, { JwtPayload } from 'jsonwebtoken'

export const verifyJWTToken = (token: string, configSecret: string) => {
  return jwt.verify(token, configSecret as string) as JwtPayload
}
