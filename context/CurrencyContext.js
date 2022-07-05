import { createContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

const CurrencyContextProvider = ({ children }) => {
    
    const [ allCurrencies, setAllCurrencies ] = useState(null)
    const [ currencyRates, setCurrencyRates ] = useState()
    const [ firstCurrency, setFirstCurrency ] = useState({value: 'USD', label: 'United States Dollar'})
    const [ secondCurrency, setSecondCurrency ] = useState()
    const [ amount, setAmount ] = useState(1)
    const [ convertedAmount, setConvertedAmount ] = useState(null)
    const [ currencyTimeSeries, setCurrencyTimeSeries ] = useState(null)
    const [ chart, setChart ] = useState(false)
    const [ selectedTime, setSelectedTime ] = useState('W')

    const data = {
        allCurrencies,
        setAllCurrencies,
        currencyRates,
        setCurrencyRates,
        firstCurrency,
        setFirstCurrency,
        secondCurrency,
        setSecondCurrency,
        amount,
        setAmount,
        convertedAmount,
        setConvertedAmount,
        currencyTimeSeries,
        setCurrencyTimeSeries,
        chart,
        setChart,
        selectedTime,
        setSelectedTime,
    }

    return (
        <CurrencyContext.Provider value={ data }>
            {children}
        </CurrencyContext.Provider>
    )
}

export { CurrencyContextProvider }
export default CurrencyContext
