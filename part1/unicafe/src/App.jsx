import { useState } from 'react'
const Button = (props) => {
  return (
  <button onClick={props.handleClick}>{props.text}</button>
  )
}
const StatisticLine = (props) => {
  return (
    <>
          <tr>
            <td>{props.text}</td>
            <td>{props.value}</td>
          </tr>
    </>
  )
}
const Statistics = (props) => {
  if (props.all == 0){
    return (
      <p>No feedback given</p>
    )
  }
  return (
    <>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticLine text='good' value={props.good} />
          <StatisticLine text='neutral' value={props.neutral} />
          <StatisticLine text='bad' value={props.bad} />
          <StatisticLine text='all' value={props.all} />
          <StatisticLine text='average' value={props.average} />
          <StatisticLine text='positive' value={((props.good / props.all)*100).toFixed(1)+"%"} />
        </tbody>
      </table>
    </>
  )
}  

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  
  const handleClick = (feedback) => {
    switch(feedback){
      case 'good':
        setGood(good + 1)
        setAll(all + 1)
        setAverage(average + 1)
        break
      case 'neutral':
        setNeutral(neutral + 1)
        setAll(all + 1)
        break
      case 'bad':
        setBad(bad + 1)
        setAll(all + 1)
        setAverage(average - 1)
        break
    }
  }
  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() => handleClick('good')} text='good'/>
      <Button handleClick={() => handleClick('neutral')} text='neutral'/>
      <Button handleClick={() => handleClick('bad')} text='bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} />
    </div>    
  )
}
export default App