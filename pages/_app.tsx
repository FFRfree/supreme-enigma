import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Router, { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import MyLayout from './layout'
import NProgress from 'nprogress'

NProgress.configure({})

Router.events.on('routeChangeStart', () => {
  // console.log('onRouteChangeStart triggered');
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  // console.log('onRouteChangeComplete triggered');
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  // console.log('onRouteChangeError triggered');
  NProgress.done()
})

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MyLayout>
        <Component {...pageProps} />
      </MyLayout>
    </QueryClientProvider>
  )
}
