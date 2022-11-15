import { useEffect } from 'react'

export const LoginPage = () => {

  useEffect(() => {
    window.location.href = `http://localhost:9991/app/main/auth/cookie/authorize/authing?redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/callback`)}`
  }, [])

  return <></>
}
