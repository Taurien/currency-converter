import axios from "axios"

export default async function handler(req, res) {
    const { base, secondCurrency, time } = req.body

    const now = new Date()
    const dateAsString = (objDate) => `${objDate.getFullYear()}-${String(objDate.getMonth()+1).padStart(2, '0')}-${String(objDate.getDate()).padStart(2, '0')}`
    const end = dateAsString(now)

    if (req.method === 'POST') {
        if (time === 'week') {
            try {
                const week = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
                const lastWeek = dateAsString(week)
                const {data} = await axios.get(`https://api.exchangerate.host/timeseries?start_date=${lastWeek}&end_date=${end}&base=${base}&symbols=${base},${secondCurrency}&places=2`)
                return res.status(200).json(data.rates)
            } catch (error) {
                return res.status(400).json({error})
            }
        } 
        
        if (time === 'month') {
            try {
                const month = new Date(now.getFullYear(), now.getMonth()-1, now.getDate())
                const lastMonth = dateAsString(month)
                const {data} = await axios.get(`https://api.exchangerate.host/timeseries?start_date=${lastMonth}&end_date=${end}&base=${base}&symbols=${base},${secondCurrency}&places=2`)
                return res.status(200).json(data.rates)
            } catch (error) {
                return res.status(400).json({error})
            }
        } 
        
        if (time === 'year') {
            console.log('hi')
            try {
                const year = new Date(now.getFullYear()-1, now.getMonth(), now.getDate())
                const lastYear = dateAsString(year)
                const {data} = await axios.get(`https://api.exchangerate.host/timeseries?start_date=${lastYear}&end_date=${end}&base=${base}&symbols=${base},${secondCurrency}&places=2`)
                console.log(data)
                return res.status(200).json(data.rates)
            } catch (error) {
                return res.status(400).json({error})
            }
        } 
        
        return res.status(404).json({ err: 'Invalid Data' })
    } else res.status(404).json({ err: 'Invalid Method' })
}