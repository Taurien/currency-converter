import axios from "axios"

export default async function handler(req, res) {
  try {
    const latestCurrency = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGES_KEY}`)
    const allCurrencies = await axios.get(`https://openexchangerates.org/api/currencies.json`)

    const formatedCurrencies = []

    Object.entries(allCurrencies.data).map(elm =>
      formatedCurrencies.push({
        value: elm[0],
        label: elm[1],
        rate: latestCurrency.data.rates[elm[0]]
      })
    )

    const result = {
        base: latestCurrency.data.base,
        
        currencies: formatedCurrencies,
        rates: latestCurrency.data.rates
    }

    return res.status(200).json(result)
  } catch (err) {
    return res.status(404).json({error: err})
  }
}