import axios from 'axios'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import CurrencyMarquee from '../components/CurrencyMarquee'
import CurrencyInput from '../components/CurrencyInput'
import ContainerBlock from './ContainerBlock'
import CurrencyChart from '../components/CurrencyChart'
// import { dateAsString } from '../utils/dates'

export default function Home() {

  const [ allCurrencies, setAllCurrencies ] = useState(null)
  const [ currencyRates, setCurrencyRates ] = useState()
  const [ firstCurrency, setFirstCurrency ] = useState({value: 'USD', label: 'United States Dollar'})
  const [ secondCurrency, setSecondCurrency ] = useState()
  const [ amount, setAmount ] = useState(1)
  const [ convertedAmount, setConvertedAmount ] = useState(null)
  const [ currencyTimeSeries, setCurrencyTimeSeries ] = useState(null)
  const [ currencyFluctuatuion, setCurrencyFluctuatuion ] = useState(null)
  const [ chart, setChart ] = useState(false)
  const [ selectedTime, setSelectedTime ] = useState('W')
  

  const firstData = async () => {
    const { data } = await axios.get('/api/currency')
    setAllCurrencies(data.currencies)
    setCurrencyRates(data.rates)
    setSecondCurrency(data.localCurrency)
  }

  useEffect(() => {
    firstData()
  }, [])

  const handleChangeAmount = (e, x) => {
    // console.log(e.target.value)
    setAmount(e.target.value)
  }

  const handleCurrencyChange = (e,a) => {
    // console.log(e,a)
    setChart(false)
    if (a.name === 'first-Currency') {
      setFirstCurrency(e)
      fetchNewCurrency(e.value)
    }
    else setSecondCurrency(e)
  }

  const fetchNewCurrency = async (currency) => {
    console.log('------------2nd fetch')
    const latest = await axios.get(`https://api.exchangerate.host/latest?base=${currency}`)
    allCurrencies?.map(e => e.rate = latest.data.rates[e.value])
    setCurrencyRates(latest.data.rates)
  }

  useEffect(() => {
    if (currencyRates && (currencyRates[firstCurrency.value] === 1)) {
      const fromCurrency = firstCurrency.value
      const toCurrency = secondCurrency.value
      const result = (amount * currencyRates[toCurrency]).toFixed(2)

      // console.log(`base as -${firstCurrency.value}- equals 1? ${currencyRates[firstCurrency.value] === 1} / ${currencyRates[firstCurrency.value]} `)
      // console.log()
      // console.log(`res of convert ${amount} of ${fromCurrency} to ${toCurrency} equals:`, result)
      // console.log(currencyRates[fromCurrency],'<->',currencyRates[toCurrency], '=', result)

      setConvertedAmount(result)
    }
  }, [amount, firstCurrency, secondCurrency, fetchNewCurrency])
  
  const fetchTimeSerie = async (time) => {
    const base = firstCurrency.value
    // console.log('------------extra', base)

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

  const timeSerieHandler = async (query) => {

    console.log(query, currencyTimeSeries[query])

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

  // const fluctuation = await axios.get(`https://api.exchangerate.host/fluctuation?start_date=${start}&end_date=${start}&base=${base}&places=2`)
    // const fluctuation = await axios.get(`https://api.exchangerate.host/fluctuation?start_date=${start}&end_date=${start}&base=${base}&symbols=${base},${secondCurrency.value}&places=2`)
    // setCurrencyTimeSeries({...currencyTimeSeries, W: timeseries.data.rates})
    // setCurrencyFluctuatuion(fluctuation.data.rates)
    // setChart(true)

    const chartHanlder = async () => {
        setSelectedTime('W')
        setCurrencyTimeSeries({ W: await fetchTimeSerie('week')})
        setChart(true)
    }

  return (
    <ContainerBlock className=' overflow-y-auto'>

      <CurrencyMarquee currencies={allCurrencies} actualCurrency={firstCurrency.value}/>

      <div className='max-w-sm mx-auto mt-6'>
        <h1>Money Exchange</h1>
        <div className='flex flex-col mx-4 p-4 bg-slate-500 rounded-md shadow-md'>
          <input type="number" className="w-full rounded-sm px-3 py-1" min={1} value={amount} onChange={(e) => handleChangeAmount(e)} />
          {/* <div className=''> */}
            <CurrencyInput
              name={'first-Currency'}
              currencies={allCurrencies} 
              selectedCurrency={firstCurrency}
              handleChange={(event, action) => handleCurrencyChange(event,action)}
            />
            <div className='w-full inline-flex my-2 bg-white rounded-sm'>
              <div className=' w-full flex flex-col px-3 py-1 border-r'>
                <span className=' font-bold'>Equals</span>
                <span className='w-full'>{convertedAmount || '0.00'} <b>{secondCurrency?.value || ''}</b></span>
              </div>
              <span className='aspect-square text-3xl text-center bg-white outline-none rounded-sm'>💱</span>
            </div>

            <CurrencyInput
              name={'second-Currency'}
              currencies={allCurrencies} 
              selectedCurrency={secondCurrency}
              handleChange={(event, action) => handleCurrencyChange(event,action)}
            />
          {/* </div> */}
          

          {
            !chart &&
            <button className='my-2 bg-white rounded-sm' onClick={() => chartHanlder()}>See more</button>
          }
        </div>
      </div>

      {
        currencyTimeSeries && chart &&
        <div className='max-w-xl mx-auto mt-3'>
          <div className='w-full inline-flex items-center justify-center'>
            <button className=' bg-orange-400 w-8 border' onClick={() => timeSerieHandler('W')}>W</button>
            <button className=' bg-orange-400 w-8 border' onClick={() => timeSerieHandler('M')}>M</button>
            <button className=' bg-orange-400 w-8 border' onClick={() => timeSerieHandler('Y')}>Y</button>
          </div>
          <div className="mx-4 max-h-96">
            {
              currencyTimeSeries[selectedTime] &&
              <CurrencyChart timeSeries={currencyTimeSeries[selectedTime]} baseCurrency={firstCurrency.value} finalCurrency={secondCurrency.value}/>
            }
          </div>
          
        </div>
      }

    </ContainerBlock>
  )
}
