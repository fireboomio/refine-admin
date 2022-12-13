import { Refine, ResourceProps } from '@pankod/refine-core'
import { notificationProvider, Layout, ReadyPage, ErrorComponent } from '@pankod/refine-antd'

import '@pankod/refine-antd/dist/styles.min.css'
// import 'antd/es/style/variable.less'
import routerProvider from '@pankod/refine-react-router-v6'
import AntConfigProvider from './providers/AntConfigProvider'
import { LoginPage } from './features/auth/login'

import CallbackPage from './features/auth/callback'
import { useAuth } from './providers/AuthenticationContext'
import { FireboomDataProvider, OperationDataProvider } from './providers/dataProvider'
import { UserList } from './features/identity/user'
import { RoleList } from './features/identity/role'
import { MenuList } from './features/identity/menu'
import { ApiList } from './features/identity/permission'
import { PetCreate, PetEdit, PetList, PetShow } from './features/pet'

const allResources = {
  User: {
    list: UserList
  },
  Role: {
    list: RoleList
  },
  Menu: {
    list: MenuList
  },
  Api: {
    list: ApiList
  },
  Pet: {
    list: PetList,
    create: PetCreate,
    edit: PetEdit,
    show: PetShow
  }
}

function App() {
  const { isAuthenticated, user, isLoading, logout, menus } = useAuth()

  if (isLoading) {
    return <div>loading..</div>
  }

  const resources: ResourceProps[] = []
  const routeMap: Record<number, string> = {}
  for (const menu of menus) {
    if (!routeMap[menu.id]) {
      routeMap[menu.id] = menu.path.replace(/\//g, '')
    }
    const res: ResourceProps = {
      name: menu.path,
      options: {
        label: menu.label,
      }
    }
    if (menu.parentId) {
      res.parentName = routeMap[menu.parentId]
    }
    const route = menu.path.replace(/\//g, '')
    res.options!.route = route
    const resKey = route
    Object.assign(res, allResources[resKey as keyof typeof allResources])
    resources.push(res)
  }

  console.log(resources)

  return (
    <AntConfigProvider theme={{ primaryColor: '#F21212' }}>
      <Refine
        notificationProvider={notificationProvider}
        Layout={Layout}
        LoginPage={LoginPage}
        ReadyPage={ReadyPage}
        catchAll={<ErrorComponent />}
        authProvider={{
          login: () => {
            return Promise.resolve()
          },
          logout: () => {
            return logout()
          },
          checkAuth: () => {
            return isAuthenticated ? Promise.resolve() : Promise.reject()
          },
          checkError: (error) => {
            console.log('checkError', error)
            if (error.status === 401) {
              return Promise.reject('/login')
            }
            return Promise.resolve()
          },
          getPermissions: () => Promise.resolve(),
          getUserIdentity() {
            if (user) {
              return Promise.resolve({
                ...user,
                avatar: user.avatarUrl,
              })
            }
            return Promise.reject()
          },
        }}
        routerProvider={{
          ...routerProvider,
          routes: [
            {
              path: '/auth/callback',
              element: <CallbackPage />,
            },
          ],
        }}
        dataProvider={{
          default: OperationDataProvider(),
          proxy: FireboomDataProvider()
        }}
        resources={resources}
      />
    </AntConfigProvider>
  )
}

export default App
