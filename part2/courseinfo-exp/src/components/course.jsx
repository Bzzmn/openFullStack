const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
  const totalExcercises  = parts.reduce((s, p) => {
    return s + p.exercises 
  }, 0);
  return <strong>{`Total of ${totalExcercises} exercises`}</strong> 
}

const Part = ({ part }) => 
  <li>
    {part.name} {part.exercises}
  </li>

const Content = ({ parts }) => 
  <>
    <ul>
      {parts.map(part => 
        <Part part={part} key={part.id}/>
        )}
    </ul>      
  </>

const Course = ({ course }) => {
  return(
    <>
        <Header course={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts} />
    </>
  )
} 

export default Course