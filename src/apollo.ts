import ApolloClient from 'apollo-boost'
import { tokenStorage } from './utils'

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST + '/graphql' : '/graphql',
  request: async (operation) => {
    const token = await tokenStorage.get()?.jwt
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
  }
})

export default client
