import { Refine } from '@pankod/refine-core'
import { notificationProvider, Layout, ReadyPage, ErrorComponent } from '@pankod/refine-antd'

import '@pankod/refine-antd/dist/styles.min.css'
// import 'antd/es/style/variable.less'
import routerProvider from '@pankod/refine-react-router-v6'
import AntConfigProvider from './providers/AntConfigProvider'
import { PetCreate, PetList, PetShow } from './features/pet'
import { LoginPage } from './pages/auth/login'

import CallbackPage from './pages/auth/callback'
import { useAuth } from './providers/AuthenticationContext'
import { FireboomDataProvider } from './providers/dataProvider'

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
        dataProvider={FireboomDataProvider()}
        resources={[{ name: 'Pet', list: PetList, show: PetShow, create: PetCreate }]}
      />
    </AntConfigProvider>
  )
}

export default App
