import { LeapFrog } from "@uiball/loaders"
import Marquee from "react-fast-marquee"

const CurrencyMarquee = ({ currencies, actualCurrency }) => {

    const MarqueeItems = () => currencies.map(item => {
        const rate = item.rate?.toFixed(2)
    
        return (
            <div key={item.value} className='h-full flex flex-col justify-center px-3 border'>
                <div className='inline-flex items-center'>
                    <p className='mr-2 font-bold'>{item.value}</p>
                    <span className={`currency-flag currency-flag-${item.value.toLowerCase()}`} />
                </div>
                <p>{rate} / <b>{actualCurrency}</b></p>
            </div>
        )
    })

    return (
        <Marquee className='w-full h-16 grid grid-rows-1 grid-flow-col bg-white shadow-md'
            play={true}
            // pauseOnHover={true}
            direction='left'
            speed={20}
            gradient={false}
        >
            {
                currencies 
                ? <MarqueeItems />
                : <div className="relative w-full inline-flex items-center justify-center ">
                        <span className="font-bold text-lg relative bottom-1 mr-1">Loading</span>
                        <LeapFrog size={20} />
                  </div>
            }
        </Marquee>
    )
}

export default CurrencyMarquee