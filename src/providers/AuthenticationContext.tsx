import axios from 'axios'
import { IMenu } from '../features/identity/menu/interfaces'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { IApi } from '../features/identity/permission/interfaces'
import { IRole, IRoleWithApi } from '../features/identity/role/interfaces'
import { mockMyMenus, mockMyRoles } from '../features/identity/mock'

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
  roles: IRole[]
  menus: IMenu[]
  apis: IApi[]
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
  const [roles, setRoles] = useState<IRole[]>([])
  const [menus, setMenus] = useState<IMenu[]>([])
  const [apis, setApis] = useState<IApi[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const login = useCallback(() => {
    window.location.href = `http://localhost:9991/app/main/auth/cookie/authorize/authing?redirect_uri=${encodeURIComponent(
      `${window.location.origin}/auth/callback`
    )}`
  }, [])

  const logout = useCallback(() => {
    return axios.get('/app/main/auth/cookie/user/logout').then(() => {
      window.location.href = '/login'
    })
  }, [])

  const fetchUserPermissions = useCallback(async () => {
    const _roles: IRoleWithApi[] = await new Promise(resolve => {
      setTimeout(() => resolve(mockMyRoles), 500)
    })
    // TODO
    const _menus: IMenu[] = mockMyMenus
    setRoles(_roles)
    // TODO
    setApis(_roles.reduce<IApi[]>((arr, item) => {
      // @ts-ignore
      arr.push(...item.apis)
      return arr
    }, []))
    setMenus(_menus)
  }, [])

  const checkAuthentication = useCallback(() => {
    setIsLoading(true)
    return axios
      .get('/app/main/auth/cookie/user', {
        withCredentials: true,
      })
      .then((data) => {
        if (data.status < 300 && data.status >= 200) {
          setUser(data.data as UserInfo)
          // return fetchUserPermissions().then(() => true)
          return true
        }
      })
      .catch(() => {})
      .then((ret) => {
        setIsLoading(false)
        return fetchUserPermissions().then(() => ret ?? false)
      })
  }, [])

  useEffect(() => {
    console.log('checkAuthentication')
    checkAuthentication()
  }, [])

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        menus,
        apis,
        roles,
        login,
        logout,
        checkAuthentication,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
