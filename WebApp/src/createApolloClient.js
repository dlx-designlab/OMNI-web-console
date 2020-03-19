import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import Debug from 'debug'

const debug = Debug('app:apolloClient')

const cache = new InMemoryCache()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors != null) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      debug(`Message: ${message}, Location: %o, Path: %o`, locations, path)
    })
  }
  if (networkError != null) {
    debug(`Network Error: ${networkError}`)
  }
})

const httpLink = new HttpLink({
  uri: 'https://omni-platform.appspot.com',
  credentials: 'same-origin'
})

export default function createApolloClient () {
  return new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, httpLink])
  })
}
