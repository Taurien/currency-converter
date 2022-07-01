import { components } from 'react-select'
const { Option } = components
import Select from 'react-select'

const IconOption = (props) => (
    <Option {...props}>
        <span className={`currency-flag currency-flag-${props.data.value.toLowerCase()}`} />
        {`(${props.data.value}) ${props.data.label}`}
    </Option>
)

const CurrencyInput = ({ currencies, name, selectedCurrency, handleChange }) => {
    return (
        <Select
            className='font-bol w- 16'
            id={`${name}-id`} instanceId={`${name}-id`}
            onChange={handleChange}
            value={selectedCurrency}
            name={name}
            options={currencies}
            components={{ Option: IconOption }}
        />
    )
}

export default CurrencyInput
