import '../styles/globals.scss'
import React from 'react'
import AuthProvider from '../context/auth/authProvider'
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Dashboard from '../components/dashboard'
import SocketProvider from '../context/socketReceiver/socketProvider'
function MyApp ({ Component, pageProps }) {
  const queryClient = React.useRef(new QueryClient())

  return (
    <QueryClientProvider client={queryClient.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <AuthProvider>
          <SocketProvider>
            <div className="cont">
              <Dashboard />
              <Component {...pageProps} />
            </div>
          </SocketProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
