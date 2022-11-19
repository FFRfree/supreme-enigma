import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import MyLayout from './layout'

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
