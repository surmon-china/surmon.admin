/**
 * @file Auth constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum AvatarType {
  Gravatar = 1,
  URL = 2,
}

export interface Auth {
  name: string
  slogan: string
  email: string
  avatar_type: AvatarType
  avatar?: string
  password?: string
  new_password?: string
}
