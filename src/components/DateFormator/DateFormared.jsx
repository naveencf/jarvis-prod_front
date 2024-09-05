import React from "react";

// Function to format a date in DD-mm-yy format
function formatDateToDDMMYY(inputDate) {
  if(inputDate == null){
    return 'N/A'
  }
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(0);
  return `${day}-${month}-${year}`;
}

// DateFormattingComponent is a reusable component that accepts a 'date' prop
function DateFormattingComponent(props) {
  const formattedDate = formatDateToDDMMYY(props.date);

  return (
    <div>
      <p>{formattedDate}</p>
    </div>
  );
}

// function App() {
//   // Define an array of dates to format
//   const datesToFormat = ['1996-01-01', '2022-09-15', '1985-05-10'];

//   return (
//     <div>
//       <h1>Formatted Dates</h1>
//       <ul>
//         {datesToFormat.map((date, index) => (
//           <li key={index}>
//             {/* Pass the 'date' prop to the DateFormattingComponent */}
//             <DateFormattingComponent date={date} />
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
export default DateFormattingComponent;
