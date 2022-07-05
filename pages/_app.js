import '../styles/globals.css'
import "currency-flags/dist/currency-flags.min.css"
import { CurrencyContextProvider } from '../context/CurrencyContext'

function MyApp({ Component, pageProps }) {
  return (
    <CurrencyContextProvider>
      <Component {...pageProps} />
    </CurrencyContextProvider>
  )
}

export default MyApp
