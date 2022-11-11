import { useEffect } from 'react'

import { useAuth } from '@/providers/AuthenticationContext'
import { useNavigation } from '@pankod/refine-core'

const AuthCallbackPage = () => {
  const { replace } = useNavigation()
  const { checkAuthentication } = useAuth()

  useEffect(() => {
    checkAuthentication().then(() => {
      replace('/')
    })
  }, [])

  return <></>
}

export default AuthCallbackPage
