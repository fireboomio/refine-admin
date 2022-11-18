import { Refine } from '@pankod/refine-core'
import { notificationProvider, Layout, ReadyPage, ErrorComponent } from '@pankod/refine-antd'

import '@pankod/refine-antd/dist/styles.min.css'
// import 'antd/es/style/variable.less'
import routerProvider from '@pankod/refine-react-router-v6'
import AntConfigProvider from './providers/AntConfigProvider'
import { PetCreate, PetList, PetShow, PostEdit } from './features/pet'
import { LoginPage } from './features/auth/login'

import CallbackPage from './features/auth/callback'
import { useAuth } from './providers/AuthenticationContext'
import { FireboomDataProvider, OperationDataProvider } from './providers/dataProvider'
import { UserList, UserShow } from './features/identity/user'
import { RoleList, RoleShow } from './features/identity/role'
import { MenuList, MenuShow } from './features/identity/menu'
import { ApiList, ApiShow } from './features/identity/permission'

function App() {
  const { isAuthenticated, user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>loading..</div>
  }

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
        resources={[
          { name: 'Pet', list: PetList, show: PetShow, create: PetCreate, edit: PostEdit },
          { name: 'User', list: UserList, show: UserShow },
          { name: 'Role', list: RoleList, show: RoleShow },
          { name: 'Menu', list: MenuList, show: MenuShow },
          { name: 'Api', list: ApiList, show: ApiShow },
        ]}
      />
    </AntConfigProvider>
  )
}

export default App
