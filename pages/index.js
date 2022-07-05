import axios from 'axios'
import { useContext, useEffect, useState } from 'react'

import CurrencyContext from '../context/CurrencyContext'

import ContainerBlock from './ContainerBlock'
import CurrencyMarquee from '../components/CurrencyMarquee'
import CurrencyInput from '../components/CurrencyInput'
import CurrencyChart from '../components/CurrencyChart'


export default function Home(props) {

  const {
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
  } = useContext(CurrencyContext)


  useEffect(() => {
    //set data that comes from api call
    setAllCurrencies(props.currencies)
    setCurrencyRates(props.rates)
    setSecondCurrency(props.localCurrency)
  }, [])


  const handleChangeAmount = (e) => setAmount(e.target.value)

  const handleCurrencyChange = (evnt,act) => {
    // console.log(e,a)
    setChart(false)
    if (act.name === 'first-Currency') {
      setFirstCurrency(evnt)
      fetchNewCurrency(evnt.value)
    }
    else setSecondCurrency(evnt)
  }

  // fetch data from selected currency
  const fetchNewCurrency = async (currency) => {
    const latest = await axios.get(`https://api.exchangerate.host/latest?base=${currency}`)
    allCurrencies?.map(e => e.rate = latest.data.rates[e.value])
    setCurrencyRates(latest.data.rates)
  }

  // to calculate new amount typed
  useEffect(() => {
    if (currencyRates && (currencyRates[firstCurrency.value] === 1)) {
      const fromCurrency = firstCurrency.value
      const toCurrency = secondCurrency.value
      const result = (amount * currencyRates[toCurrency]).toFixed(2)
      // console.log(`base as -${firstCurrency.value}- equals 1? ${currencyRates[firstCurrency.value] === 1} / ${currencyRates[firstCurrency.value]} `)
      // console.log(`res of convert ${amount} of ${fromCurrency} to ${toCurrency} equals:`, result)
      setConvertedAmount(result)
    }
  }, [amount, firstCurrency, secondCurrency, fetchNewCurrency])
  
  // timeseries data used in chart based on selected currencies
  const fetchTimeSerie = async (time) => {
    const base = firstCurrency.value

    const res = await axios.post(
      "/api/timeseries",
      {
        base: base,
        secondCurrency: secondCurrency.value,
        time: time
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    return res.data
  }

  // handler to timeseries data. -data are stored in CTX
  const timeSerieHandler = async (query) => {
    // console.log(query, currencyTimeSeries[query])
    if (query === 'Y' && currencyTimeSeries[query]) setSelectedTime(query)
    else {
      setSelectedTime(query)
      setCurrencyTimeSeries({ ...currencyTimeSeries, [query]: await fetchTimeSerie('year')})
    }
    
    if (query === 'M' && currencyTimeSeries[query]) setSelectedTime(query)
    else {
      setSelectedTime(query)
      setCurrencyTimeSeries({ ...currencyTimeSeries, [query]: await fetchTimeSerie('month')})
    }

    if (query === 'W') setSelectedTime(query)
  }

  const chartHanlder = async () => {
      setSelectedTime('W')
      setCurrencyTimeSeries({ W: await fetchTimeSerie('week')})
      setChart(true)
  }

  const trasladeCurrency = () => {
    setFirstCurrency(secondCurrency)
    fetchNewCurrency(secondCurrency.value)
    setSecondCurrency(firstCurrency)
  }

  return (
    <ContainerBlock className='relative overflow-y-auto'>
      <CurrencyMarquee currencies={allCurrencies} actualCurrency={firstCurrency.value}/>

      <div className='max-w-sm mx-auto mt-4'>
        <div className='flex flex-col mx-4 p-4 bg-slate-500 bg-opacity-50 rounded-lg shadow-md'>
          <h1 className=' w-full text-3xl text-center font-bold mb-4' >Money Exchange</h1>
          <input type="number" className="w-full rounded-sm px-3 py-1" min={1} value={amount} onChange={(e) => handleChangeAmount(e)} />
          <CurrencyInput
            name={'first-Currency'}
            currencies={allCurrencies} 
            selectedCurrency={firstCurrency}
            handleChange={(event, action) => handleCurrencyChange(event,action)}
          />

          <div className='w-full inline-flex my-2 bg-white rounded'>
            <div className=' w-full flex flex-col px-3 py-1 border-r'>
              <p className=' font-bold'>Equals</p>
              <p className='w-full'>{convertedAmount || '0.00'} <b>{secondCurrency?.value || ''}</b></p>
            </div>
            <button onClick={() => trasladeCurrency()} className='text-3xl text-center bg-white outline-none rounded-sm'>💱</button>
          </div>

          <CurrencyInput
            name={'second-Currency'}
            currencies={allCurrencies} 
            selectedCurrency={secondCurrency}
            handleChange={(event, action) => handleCurrencyChange(event,action)}
          />

          {
            !chart &&
            <button className='my-2 bg-white rounded-sm' onClick={() => chartHanlder()}>See more</button>
          }
        </div>
      </div>

      {
        currencyTimeSeries && chart &&
        <div className='max-w-xl mx-auto mt-3'>
          <div className='flex flex-col p-2 mx-4 bg-slate-500 bg-opacity-50 rounded-lg'>
          
            <div className='w-36 self-center inline-flex items-center justify-between font-bold rounded-full overflow-hidden mb-1'>
              <button className='px-4 py-1 bg-slate-300' onClick={() => timeSerieHandler('W')}>W</button>
              <button className='px-4 py-1 bg-slate-300' onClick={() => timeSerieHandler('M')}>M</button>
              <button className='px-4 py-1 bg-slate-300' onClick={() => timeSerieHandler('Y')}>Y</button>
            </div>

            <div className="max-h-96 bg-white rounded">
              {
                currencyTimeSeries[selectedTime] &&
                <CurrencyChart timeSeries={currencyTimeSeries[selectedTime]} baseCurrency={firstCurrency.value} finalCurrency={secondCurrency.value}/>
              }
            </div>

          </div>
        </div>
      }

      <div className='absolute top-0 left-0 bg w-full h-full -z-10 bg-world-dots bg-photo bg-cover bg-no-repeat bg-origin-border'></div>
    </ContainerBlock>
  )
}

export async function getServerSideProps() {
  const currency = await axios.get('https://currency-converter-two-nu.vercel.app/api/currency')
  const localCurrency = await axios.get('https://ipapi.co/currency/')
  const local = currency.data.currencies.find(e => e.value === localCurrency.data)

  const res = {...currency.data, localCurrency: local }

  return { props: res }
}