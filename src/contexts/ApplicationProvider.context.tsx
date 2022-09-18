import * as React from 'react'
import { useGetUserQuery, UsersPermissionsUser } from '../generated/graphql'

type AppContextType = {
  drawerOpen: boolean
  toggleDrawer: () => void
  userProfile?: UsersPermissionsUser
  profileImage?: string
}

export const AppContext = React.createContext<AppContextType>({
  drawerOpen: false,
  toggleDrawer: () => null
})

export const useAppContext = () => React.useContext(AppContext)

const AppProvider: React.FC<{ userProfile?: UsersPermissionsUser }> = ({ children, ...rest }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState<
    Omit<UsersPermissionsUser, 'client'> | undefined
  >(undefined)
  const [profileImage] = React.useState<string | undefined>(undefined)

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  const { user: id } = JSON.parse(window.localStorage.getItem('user') || '{}')

  const { data } = useGetUserQuery({ variables: { id } })

  React.useEffect(() => {
    if (data && data.user) {
      setUserProfile({
        ...data.user,
        created_at: undefined,
        updated_at: undefined
      })
    }
  }, [data])

  // React.useEffect(() => {
  //   Storage.get('profileImage', { level: 'protected' })
  //     .then((result) => {
  //       result && typeof result === 'string' && setProfileImage(result)
  //     })
  //     .catch((error) => console.log(error))
  // }, [profileImage])

  return (
    <AppContext.Provider value={{ drawerOpen, toggleDrawer, userProfile, profileImage, ...rest }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
