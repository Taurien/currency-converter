import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const CurrencyChart = ({ timeSeries, baseCurrency, finalCurrency }) => {
    const options = {
        fill: true,
        responsive: true,
        scales: {
            y: {
                min: 0,
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: `${baseCurrency} vs. ${finalCurrency}`
            }
        },
    }

    const labels = Object.keys(timeSeries)

    const baseValues = []
    const finalValues = []

    Object.keys(timeSeries).map(elm => {
        baseValues.push(timeSeries[elm][baseCurrency])
        finalValues.push(timeSeries[elm][finalCurrency])
    })

    const data = {
        datasets: [
            {
                label: baseCurrency,
                data: baseValues,
                tension: 0.3,
                pointRadius: 3,
                borderColor: "rgb(75, 192, 192)",
                pointBackgroundColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.3)",
            },
            {
                label: finalCurrency,
                data: finalValues,
                tension: 0.3,
                pointRadius: 3,
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.3)",
            }
        ],
        labels,
    }

    return <Line data={data} options={options} />
}

export default CurrencyChart
