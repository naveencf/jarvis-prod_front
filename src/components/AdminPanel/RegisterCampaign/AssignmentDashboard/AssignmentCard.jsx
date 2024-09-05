const AssignmentCard=({data})=>{
    // console.log(data)
    return (
  
         <div className="data-card is-hoverable">
          <div className="data-card__val">{data.value || 0}</div>
          <div className="data-card__label">{data.name}</div>
        </div>

    )
}

export default AssignmentCard