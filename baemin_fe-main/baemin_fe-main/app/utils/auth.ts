import { User } from '../types/user.type'

export const setAccessTokenToLS = (access_token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access_token)
  }
}

export const setProfileToLS = (profile: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profile', JSON.stringify(profile))
  }
}

export const clearLS = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    localStorage.removeItem('profile')
  }
}

export const getAccessTokenFromLS = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') || ''
  }
  return ''
}

export const getProfileFromLS = () => {
  if (typeof window !== 'undefined') {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
  }
  return ''
}
