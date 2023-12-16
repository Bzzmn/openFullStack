import { useState } from 'react'

const MostVotedAnecdote = (props) => {
  return (
    <>
      <h3>Anecdote with most votes</h3>
      <p>{props.anecdote}</p>
      <p>has {props.votes} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Uint8Array(anecdotes.length)) 
  const [mostVoted, setMostVoted] = useState(0) 

  const handleClick = () => {
    let randomSelection = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomSelection)
  }

  const handleVote = () => {
    const votes = [...vote]
    votes[selected] += 1
    setVote(votes)
    for (let i = 0; i < votes.length; i++){
      if (votes[i] > votes[mostVoted]){
        setMostVoted(i)
      }
    }
  }

  return (
    <>
      <div>
        {anecdotes[selected]}
      </div>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick} >next anecdote</button>
      <p>has {vote[selected]} votes</p>
      <MostVotedAnecdote anecdote={anecdotes[mostVoted]} votes={vote[mostVoted]} />
    </>
  )
}
export default App
