import axios from "axios"

export default async function handler(req, res) {
    const localCurrency = await axios.get('https://ipapi.co/currency/')
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

    const local = formatedCurrencies.find(e => e.value === localCurrency.data)

    const result = {
        base: latestCurrency.data.base,
        localCurrency: local,
        currencies: formatedCurrencies,
        rates: latestCurrency.data.rates
    }

    res.status(200).json(result)
}