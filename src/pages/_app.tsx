import { NextPage } from 'next'
import { AppProps } from 'next/app'

import { Layout } from '../layouts/layout'

import '../styles/globals.css'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
