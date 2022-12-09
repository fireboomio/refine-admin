import { useEffect } from 'react'

export const LoginPage = () => {

  useEffect(() => {
    window.location.href = `http://localhost:9991/app/main/auth/cookie/authorize/auth0?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
  }, [])

  return <></>
}
