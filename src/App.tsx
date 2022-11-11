import { Refine } from '@pankod/refine-core'
import { notificationProvider, Layout, ReadyPage, ErrorComponent } from '@pankod/refine-antd'

import '@pankod/refine-antd/dist/styles.min.css'
// import 'antd/es/style/variable.less'
import routerProvider from '@pankod/refine-react-router-v6'
import dataProvider from '@pankod/refine-simple-rest'
import AntConfigProvider from './providers/AntConfigProvider'
import { PetList } from './features/pet'
import { LoginPage } from './pages/auth/login'

import CallbackPage from './pages/auth/callback'
import { useAuth } from './providers/AuthenticationContext'

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
                avatar: user.avatarUrl
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
        dataProvider={dataProvider('https://api.fake-rest.refine.dev')}
        resources={[{ name: 'pets', list: PetList }]}
      />
    </AntConfigProvider>
  )
}

export default App
