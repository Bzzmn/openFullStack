import { useState, useEffect } from 'react'
import namesServices from './services/names'
import Notification from './components/notification'

const PersonsForm = (props) => {
  return(
    <form>
    <div>
      name: <input  onChange={props.handleNameChange} value={props.newName}/>
      number: <input onChange={props.handleNumberChange} value={props.newNumber}/>
    </div>
    <div>
      <button type="submit" onClick={props.handleNameAdd}>add</button>
    </div>
  </form>
  )
}

const Filter = ({ filter }) => {
  return(
    <>
     filter shown with: <input onChange={filter} />
    </>
  )
}

const Persons = ({ names, filter, handleDelete }) => {
  filter = filter.toLowerCase()
  const objectFilter = names.filter(objeto => { return objeto.name.toLowerCase().includes(filter)})
  return (
    <>
      <ul>
        {objectFilter.map(number => 
          <li key={number.id}>
                  {number.name} - {number.number}
                  <button onClick={() => handleDelete(number.id)}>delete</button>
          </li>
          )
        }
      </ul>
    </>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')

  
  useEffect(() => {
    namesServices
      .getAll()
      .then( response => setPersons(response) )
  }, [])

  const handleNameUpdate = (name, newNumber) => {
    let oldContact = persons.find ( p => p.name == name)
    let newContact = {...oldContact , number: newNumber}
    namesServices
    .update(oldContact.id, newContact)
    .then( response => {
      setNewName('')
      setNewNumber('')
      const newPersons = persons.map(p => p.id !== newContact.id ? p : newContact)
      setPersons(newPersons)
      handleNotificationMessage('success', `${newContact.name} was successfully updated`)
    })
    .catch( error => {
      handleNotificationMessage('error', `${newContact.name} does not exists in Numbers`)
      setPersons(persons.filter( p => p.id !== newContact.id))
    })
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  
  const handleNameAdd = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const nameExists = persons.some( person => person.name === newName)
    if (nameExists){
      let confirmation = confirm(`${newName} is already added to phonebook, replace the old numer with the new one?`)
      if (confirmation){
        handleNameUpdate(newName, newNumber)
      } else {
        setNewName('')
        setNewNumber('')
      }
    } else {
      namesServices
        .create(nameObject)
        .then( response => {
          setPersons(persons.concat(response))
       })
      setNewName('')
      setNewNumber('')
      handleNotificationMessage('success', `${newName} was successfully added to Numbers`)
    }
  }
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleFilterChange = (event) => setNewFilter(event.target.value)

  const handleDelete = (id) => { 
    const person = persons.find( p => p.id === id )
    const confirmation = confirm(`Delete ${person.name}?`)
    if (confirmation){
      namesServices
      .erase(id)
      const newPersons = persons.filter(p => p.id !== id)
      setPersons(newPersons)
    }
  }
  
  const handleNotificationMessage = (type, message) => {
    setNotificationType(type)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 2000)
  }

  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
      <h2>Phonebook</h2>
      <Filter filter={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonsForm 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleNameAdd={handleNameAdd} 
        newName = {newName}
        newNumber = {newNumber}
      />
      <h3>Numbers</h3>
      <Persons names={persons} filter={newFilter} handleDelete={handleDelete} />
    </div>
  )
}
export default App
