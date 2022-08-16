import axios from 'axios'
import { useContext, useEffect } from 'react'

import CurrencyContext from '../context/CurrencyContext'

import ContainerBlock from './ContainerBlock'
import CurrencyMarquee from '../components/CurrencyMarquee'
import CurrencyInput from '../components/CurrencyInput'


export default function Home(props) {

  const {
    dollarUSLocale,
    allCurrencies,
    setAllCurrencies,
    currencyRates,
    setCurrencyRates,
    firstCurrency,
    secondCurrency,
    setSecondCurrency,
    amount,
    convertedAmount,
    setConvertedAmount,
    fetchNewCurrency,
    handleChangeAmount,
    handleCurrencyChange,
    trasladeCurrency
  } = useContext(CurrencyContext)

  const setLocalCurrency = async () => {
    const localCurrency = await axios.get('https://ipapi.co/currency/')
    const local = props.currencies.find(e => e.value === localCurrency.data)
    setSecondCurrency(local)
  }

  useEffect(() => {
    //set data that comes from api call
    setAllCurrencies(props.currencies)
    setCurrencyRates(props.rates)
    setLocalCurrency()
  }, [])


  // to calculate new amount typed
  useEffect(() => {
    if (secondCurrency && currencyRates && (currencyRates[firstCurrency.value] === 1)) {
      const fromCurrency = firstCurrency.value
      const toCurrency = secondCurrency.value
      const result = (amount * currencyRates[toCurrency]).toFixed(2)
      // console.log(`base as -${firstCurrency.value}- equals 1? ${currencyRates[firstCurrency.value] === 1} / ${currencyRates[firstCurrency.value]} `)
      // console.log(`res of convert ${amount} of ${fromCurrency} to ${toCurrency} equals:`, result)
      setConvertedAmount(result)
    }
  }, [amount, firstCurrency, secondCurrency, fetchNewCurrency])
  

  return (
    <ContainerBlock className='relative w-full overflow-y-auto'>
      <CurrencyMarquee currencies={allCurrencies} actualCurrency={firstCurrency.value}/>

      <div className='w-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex justify-center'>
        <div className='w-96 flex flex-col mx-4 px-2 py-4 bg-slate-500 bg-opacity-50 rounded-lg shadow-md'>
          <h1 className=' text-3xl text-center font-bold mb-4' >Money Exchange</h1>

          <input type="number" className="w-full rounded-sm px-3 py-1" min={1} value={amount} onChange={(e) => handleChangeAmount(e)} />

          <CurrencyInput
            name={'first-Currency'}
            currencies={allCurrencies} 
            selectedCurrency={firstCurrency}
            handleChange={(event, action) => handleCurrencyChange(event,action)}
          />

          <div className='w-full inline-flex my-2 bg-white rounded'>
            <div className=' w-full flex flex-col px-3 py-2 text-xl'>
              <p className=' font-bold'>Equals</p>
              <p className='w-full italic'>{dollarUSLocale.format(convertedAmount) || '0.00'} <b>{(secondCurrency?.value) || ''}</b></p>
            </div>
            <button onClick={() => trasladeCurrency()} className='text-3xl text-center bg-white outline-none rounded-sm'>💱</button>
          </div>

          <CurrencyInput
            name={'second-Currency'}
            currencies={allCurrencies} 
            selectedCurrency={secondCurrency? secondCurrency : firstCurrency}
            handleChange={(event, action) => handleCurrencyChange(event,action)}
          />

        </div>
      </div>

      <div className='absolute bottom-0 left-0 w-full flex justify-center bg-white'>
        <p className='w-fit my-0.5 text-center text-xs'>
          Made w/ 🖤 by <a href='https://www.michelcruz.me/' target='_blank' rel='noreferrer' className='font-semibold'>Taurien</a>
        </p>
      </div>

      <div className='absolute top-0 left-0 bg w-full h-full -z-10 bg-world-dots bg-photo bg-cover bg-no-repeat bg-origin-border'></div>
    </ContainerBlock>
  )
}

export async function getServerSideProps() {
  const currency = await axios.get('https://currency-converter-two-nu.vercel.app/api/currency')
  return { props: currency.data }
}