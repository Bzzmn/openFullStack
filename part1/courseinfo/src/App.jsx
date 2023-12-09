const Header = (props) => {
  return(
    <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return(
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  return(
    <>
      <Part part={props.name1} exercises={props.exercises1} />
      <Part part={props.name2} exercises={props.exercises2} />
      <Part part={props.name3} exercises={props.exercises3} />
    </>
  )
}

const Total = (props) => {
  return(
    <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <>
      <Header course={course} />
      <Content 
        name1={part1.name}
        name2={part2.name}
        name3={part3.name}
        exercises1={part1.exercises} 
        exercises2={part2.exercises} 
        exercises3={part3.exercises}
      />
      <Total 
        exercises1={part1.exercises} 
        exercises2={part2.exercises} 
        exercises3={part3.exercises}
      />
    </>
  )
}

export default App