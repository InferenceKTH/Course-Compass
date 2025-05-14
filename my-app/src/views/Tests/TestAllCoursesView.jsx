export function TestAllCoursesView(props) {

  return (
    <div>
      {props.courses.map(mapCourse)}
    </div>
  )
}

function mapCourse(course){
  return(
    <div>
      <h2>{course.code}</h2>
      <h3>{course.name}</h3>
      <p>{course.location}</p>
      <p>{course.description}</p>
    </div>
  )
}