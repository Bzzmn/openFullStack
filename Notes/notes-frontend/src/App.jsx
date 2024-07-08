import { useState, useEffect, useRef } from 'react'

import Note from './components/notes'
import Notification from './components/notification'
import Footer from './components/footer'
import LoginForm from './components/loginform'
import Toggable from './components/toggable'
import NoteForm from './components/noteform'

import loginService from './services/login'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [user, setUser] = useState(null) 

  const noteFormRef = useRef()

  useEffect( () => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect( () => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const notesToShow = showAll ? notes : notes.filter(notes => notes.important === true)

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = {note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then( returnedNote => {
        setNotes(notes.map(n => n.id !== id? n : returnedNote))
      })
      .catch(error => {
        setErrorMsg(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMsg(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (loginObject) => {
    try {
      const user = await loginService.login(loginObject)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMsg('Wrong credentials')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser('')
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const noteForm = () => (
    <Toggable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={ addNote } />
    </Toggable>
  )

  const loginForm = () => (
      <Toggable buttonLabel='login'>
          <LoginForm 
            createLogin={handleLogin}
          />
      </Toggable>
    )
  
  return (
    <>
      <h1>Notes App</h1>
      <Notification message={errorMsg} />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={() => handleLogout()}>Logout</button>
        {noteForm()} 
        </div> 
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
         {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance = {() => toggleImportanceOf(note.id)}
          />
        )}
      </ul> 
      <Footer />
    </>
  )
}
export default App
