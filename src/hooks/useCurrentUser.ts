import * as React from 'react'
import { tokenStorage } from '../utils'

function useCurrentUser() {
  const [user, setUser] = React.useState<any>({ id: '', email: '', username: '' })

  React.useEffect(() => {
    async function getCurrentUser() {
      try {
        const TokenStorage = tokenStorage.get()
        setUser(TokenStorage.user)
      } catch (error) {
        setUser(undefined)
      }
    }
    getCurrentUser()
  }, [])

  return { user }
}

export default useCurrentUser
