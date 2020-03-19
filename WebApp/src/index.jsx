import { ApolloProvider } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import App from './components/App'
import createApolloClient from './createApolloClient'

import './index.scss'

window.localStorage.debug = 'app:*'

const apolloClient = createApolloClient()

function render () {
  ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
  )
}

if (module.hot && process.env.NODE_ENV !== 'production') {
  module.hot.accept('./components/App', () => {
    render()
  })
}

render()
