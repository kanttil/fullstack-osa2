import React from 'react'
import personService from './services/persons'
import './index.css'

const FilterForm = ({ handleChange, filter }) =>
    <div>
        rajaa näytettäviä: <input
            value={filter}
            onChange={handleChange} />
    </div>

const AddPersonForm = ({ addNumber, newName, newNumber, handleNameChange, handleNumberChange }) =>
    <div>
        <h2>Lisää uusi</h2>
        <form onSubmit={addNumber}>
            <div>
                nimi: <input
                    value={newName}
                    onChange={handleNameChange} />
            </div>
            <div>
                numero: <input
                    value={newNumber}
                    onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">lisää</button>
            </div>
        </form>
    </div>

const Persons = ({ filter, persons, removeName }) => {
    const personsToShow = persons.filter(person =>
        person.name.toLowerCase().includes(filter))

    return (
        <div>
            <h2>Numerot</h2>
            <table>
                <tbody>
                    {personsToShow.map(person => <Person
                        key={person.name}
                        name={person.name}
                        number={person.number}
                        remove={removeName(person.id)} />)}
                </tbody>
            </table>
        </div>
    )
}

const Person = ({ name, number, remove }) =>
    <tr>
        <td>{name}</td>
        <td>{number}</td>
        <td>
            <button onClick={remove}>poista</button>
        </td>
    </tr>

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className="notification">
            {message}
        </div>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            filter: '',
            notification: null
        }
    }

    componentDidMount() {
        personService
            .getAll()
            .then(response => {
                this.setState({ persons: response.data })
            })
    }

    addNumber = (event) => {
        event.preventDefault()

        const newPerson = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        const names = this.state.persons.map(person => person.name)
        if (names.includes(newPerson.name)) {
            if (window.confirm(newPerson.name + ' on jo luettelossa, korvataanko vanha numero uudella?')) {
                const person = this.state.persons.find(person => person.name === newPerson.name)
                const id = person.id

                personService
                    .update(id, newPerson)
                    .then(response => {
                        this.setState({
                            persons: this.state.persons.map(person =>
                                person.id !== id ? person : response.data),
                            notification: 'muutettiin henkilön ' + newPerson.name + ' numero'
                        })
                        setTimeout(() => {
                            this.setState({ notification: null })
                        }, 5000)
                    })
                    .catch(error => {
                        this.setState({
                            persons: this.state.persons.filter(person => person.name !== newPerson.name)
                        })
                        this.addNewName(newPerson)
                    })
            }

            this.setState({
                newName: '',
                newNumber: ''
            })
            return
        }

        this.addNewName(newPerson)
    }

    addNewName = (newPerson) => {
        personService
            .create(newPerson)
            .then(response => {
                this.setState({
                    persons: this.state.persons.concat(response.data),
                    newName: '',
                    newNumber: '',
                    notification: 'lisättiin ' + newPerson.name
                })
                setTimeout(() => {
                    this.setState({ notification: null })
                }, 5000)
            })
    }

    removeName = (id) => () => {
        const person = this.state.persons.find(person => person.id === id)
        if (window.confirm('Poistetaanko ' + person.name + '?')) {
            personService
                .remove(id)

            this.setState({
                persons: this.state.persons.filter(person => person.id !== id),
                notification: 'poistettiin ' + person.name
            })
            setTimeout(() => {
                this.setState({ notification: null })
            }, 5000)
        }
    }

    handleNameChange = (event) => {
        this.setState({ newName: event.target.value })
    }

    handleNumberChange = (event) => {
        this.setState({ newNumber: event.target.value })
    }

    handleFilterChange = (event) => {
        this.setState({ filter: event.target.value })
    }

    render() {
        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Notification
                    message={this.state.notification} />
                <FilterForm
                    handleChange={this.handleFilterChange}
                    filter={this.state.filter} />
                <AddPersonForm
                    addNumber={this.addNumber}
                    newName={this.state.newName}
                    newNumber={this.state.newNumber}
                    handleNameChange={this.handleNameChange}
                    handleNumberChange={this.handleNumberChange} />
                <Persons
                    filter={this.state.filter.toLowerCase()}
                    persons={this.state.persons}
                    removeName={this.removeName} />
            </div>
        )
    }
}

export default App