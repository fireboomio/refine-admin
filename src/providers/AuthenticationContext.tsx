import axios from 'axios'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type UserInfo = {
  name?: string
  avatarUrl: string
  provider: string
  providerId: string
  roles: string[] | null
  userId: string
}

export type UserState = {
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void> | void
  logout: () => Promise<void>
  checkAuthentication: () => Promise<boolean>
}

/** @ts-ignore */
const AuthenticationContext = createContext<UserState>(null)

export function useAuth() {
  return useContext(AuthenticationContext)
}

export function AuthenticationProvider({ children }: { children?: ReactNode }) {
  const [user, setUser] = useState<UserState['user']>(null)
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(() => {
    window.location.href = `http://localhost:9991/app/main/auth/cookie/authorize/authing?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
  }, [])

  const logout = useCallback(() => {
    return axios.get('/app/main/auth/cookie/user/logout').then(() => {
      window.location.href = '/login'
    })
  }, [])

  const checkAuthentication = useCallback(() => {
    setIsLoading(true)
    return axios.get('/app/main/auth/cookie/user', {
      withCredentials: true
    }).then(data => {
      if (data.status < 300 && data.status >= 200) {
        setUser(data.data as UserInfo)
        return true
      }
    }).catch(() => {}).then((ret) => {
      setIsLoading(false)
      return ret ?? false
    })
  }, [])

  useEffect(() => {
    console.log('checkAuthentication')
    checkAuthentication()
  }, [])

  return (
    <AuthenticationContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      checkAuthentication
    }}>{children}</AuthenticationContext.Provider>
  )
}