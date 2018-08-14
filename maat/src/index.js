import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

const Countries = ({ filter, countries, handleClick }) => {
    const toShow = countries.filter(country =>
        country.name.toLowerCase().includes(filter))

    if (toShow.length > 10) {
        return (
            <div>
                too many matches, specify another filter
            </div>
        )
    }

    if (toShow.length > 1) {
        return (
            <div>
                {toShow.map(country =>
                    <div
                        key={country.name}
                        onClick={handleClick(country)}>
                        {country.name}
                    </div>)}
            </div>
        )
    }

    if (toShow.length === 1) {
        return (
            <Country country={toShow[0]} />
        )
    }

    return null
}

const Country = ({ country }) =>
    <div>
        <h2>{country.name + " " + country.nativeName}</h2>
        <p>capital: {country.capital}</p>
        <p>population: {country.population}</p>
        <img src={country.flag} alt="" width="400" height="250" />
    </div>

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            countries: [],
            filter: ''
        }
    }

    componentDidMount() {
        axios
            .get('https://restcountries.eu/rest/v2/all')
            .then(response => {
                this.setState({ countries: response.data })
            })
    }

    handleFilterChange = (event) => {
        this.setState({ filter: event.target.value })
    }

    handleClick = (country) => () => {
        this.setState({ filter: country.name })
    }

    render() {
        return (
            <div>
                <div>
                    find countries: <input
                        value={this.state.filter}
                        onChange={this.handleFilterChange} />
                </div>
                <Countries
                    filter={this.state.filter.toLowerCase()}
                    countries={this.state.countries}
                    handleClick={this.handleClick} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
