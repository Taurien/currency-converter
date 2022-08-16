import axios from 'axios'
import { createContext, useState } from 'react'

const CurrencyContext = createContext()

const CurrencyContextProvider = ({ children }) => {

  const dollarUSLocale = Intl.NumberFormat('en-US');
  
  const [ allCurrencies, setAllCurrencies ] = useState(null)
  const [ currencyRates, setCurrencyRates ] = useState()
  const [ firstCurrency, setFirstCurrency ] = useState({value: 'USD', label: 'United States Dollar'})
  const [ secondCurrency, setSecondCurrency ] = useState()
  const [ amount, setAmount ] = useState(1)
  const [ convertedAmount, setConvertedAmount ] = useState(null)

  const fetchNewCurrency = async (currency) => {
    const latest = await axios.get(`https://api.exchangerate.host/latest?base=${currency}`)
    allCurrencies?.map(e => e.rate = latest.data.rates[e.value])
    setCurrencyRates(latest.data.rates)
  }

  const handleChangeAmount = (e) => setAmount(e.target.value)

  const handleCurrencyChange = (evnt,act) => {
    // console.log(e,a)
    if (act.name === 'first-Currency') {
      setFirstCurrency(evnt)
      fetchNewCurrency(evnt.value)
    }
    else setSecondCurrency(evnt)
  }

  const trasladeCurrency = () => {
    setFirstCurrency(secondCurrency)
    fetchNewCurrency(secondCurrency.value)
    setSecondCurrency(firstCurrency)
  }


  const data = {
    dollarUSLocale,
    allCurrencies,
    setAllCurrencies,
    currencyRates,
    setCurrencyRates,
    firstCurrency,
    setFirstCurrency,
    secondCurrency,
    setSecondCurrency,
    amount,
    convertedAmount,
    setConvertedAmount,
    fetchNewCurrency,
    handleChangeAmount,
    handleCurrencyChange,
    trasladeCurrency
  }

  return (
    <CurrencyContext.Provider value={ data }>
      {children}
    </CurrencyContext.Provider>
  )
}

export { CurrencyContextProvider }
export default CurrencyContext
