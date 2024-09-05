// import * as React from "react";


// export default function OurAnalytics({rows}) {

// console.log(rows);

//   return (
//     <>
//       {/* <div className="card">
//         <div className="card-body p0">
//           <div className="brandCompareWrapper table-responsive">
//             <div className="divTable">
//               <div className="divTableHeading">
//                 <div className="divTableRow">
//                   <div className="divTableHead">
//                     <h6 className="divTableTH">Brands</h6>
//                   </div>
//                   <div className="divTableHead">
//                     <div className="compBrandHead titleCard">
//                       <div className="titleCardImg">
//                         <img
//                           src="https://insights.ist:8080/uploads/Brand_s%20Avatar/Hotstar.jpg"
//                           alt="img"
//                         />
//                       </div>
//                       <div className="titleCardText">
//                         <h2>Hotstar</h2>
//                         <ul>
//                           <li>Entertainment</li>
//                           <li>OTT</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="divTableHead">
//                     <div className="compBrandHead titleCard">
//                       <div className="titleCardImg">
//                         <img
//                           src="https://insights.ist:8080/uploads/Brand_s%20Avatar/Zee5.jpg"
//                           alt="img"
//                         />
//                       </div>
//                       <div className="titleCardText">
//                         <h2>Zee5</h2>
//                         <ul>
//                           <li>Entertainment</li>
//                           <li>OTT</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="divTableHead">
//                     <div className="compBrandHead titleCard">
//                       <div className="titleCardImg">
//                         <img
//                           src="https://insights.ist:8080/uploads/Brand_s%20Avatar/Amazon%20Prime.jpg"
//                           alt="img"
//                         />
//                       </div>
//                       <div className="titleCardText">
//                         <h2>Amazon Prime</h2>
//                         <ul>
//                           <li>Entertainment</li>
//                           <li>OTT</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="divTableHead">
//                     <div className="compBrandHead titleCard">
//                       <div className="titleCardImg">
//                         <img
//                           src="https://insights.ist:8080/uploads/Brand_s%20Avatar/Netflix.jpg"
//                           alt="img"
//                         />
//                       </div>
//                       <div className="titleCardText">
//                         <h2>Netflix</h2>
//                         <ul>
//                           <li>Entertainment</li>
//                           <li>OTT</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="divTableBody">
//               <div className="divTableRow">
//                   <div className="divTableCell" data-label="Hero Title">
//                     <h6 className="divTableTH">
//                       <span>
//                         <ion-icon name="chatbubble-outline"></ion-icon>
//                       </span>
//                       Major-Category
//                     </h6>
//                   </div>
//                   <div className="divTableCell">
//                     <p >
//                       674
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>638</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>
//                       372
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>965</p>
//                   </div>
//                 </div>
//                 <div className="divTableRow">
//                   <div className="divTableCell">
//                     <h6 className="divTableTH">
//                       <span>
//                         <ion-icon name="list-outline"></ion-icon>
//                       </span>
//                       Post-Count
//                     </h6>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="highest">
//                       16846 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>25952</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="lowest">
//                       25486 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>46485</p>
//                   </div>
//                 </div>
//                 <div className="divTableRow">
//                   <div className="divTableCell" data-label="Hero Title">
//                     <h6 className="divTableTH">
//                       <span>
//                         <ion-icon name="heart-outline"></ion-icon>
//                       </span>
//                       Likes
//                     </h6>
//                   </div>
//                   <div className="divTableCell">
//                     <p>4567</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="highest">
//                       5236 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="lowest">
//                       7632 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>5698</p>
//                   </div>
//                 </div>
//                 <div className="divTableRow">
//                   <div className="divTableCell" data-label="Hero Title">
//                     <h6 className="divTableTH">
//                       <span>
//                         <ion-icon name="eye-outline"></ion-icon>
//                       </span>
//                       Views
//                     </h6>
//                   </div>
//                   <div className="divTableCell">
//                     <p>45368</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="lowest">
//                       36548 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>56761</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="highest">
//                       47369 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                 </div>  <div className="divTableRow">
//                   <div className="divTableCell" data-label="Hero Title">
//                     <h6 className="divTableTH">
//                       <span>
//                         <ion-icon name="chatbubble-outline"></ion-icon>
//                       </span>
//                       Comments
//                     </h6>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="highest">
//                       674 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>638</p>
//                   </div>
//                   <div className="divTableCell">
//                     <p className="lowest">
//                       372 <i className="bi bi-caret-up-fill"></i>
//                     </p>
//                   </div>
//                   <div className="divTableCell">
//                     <p>965</p>
//                   </div>
//                 </div>
                
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

import React from 'react';

export default function OurAnalytics({ rows }) {
  // Extract the first 4 brands from the rows array
  
  const topBrands = rows.slice(0, 4);
// console.log(topBrands);
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  const formatString = (s) => {
    // Remove leading underscores
    let formattedString = s.replace(/^_+/, "");
  
    // Capitalize the first letter of each word and make the rest lowercase
    if (formattedString) {
      formattedString = formattedString
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }
  
    return formattedString;
  };
  
  return (
    <>
     {rows.length >0 && 
     <div className="card">
        <div className="card-body p0">
          <div className="brandCompareWrapper table-responsive">
            <div className="divTable">
              <div className="divTableHeading">
                <div className="divTableRow">
                  <div className="divTableHead">
                    <h5 >Brands</h5>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableHead" key={index}>
                      <div className="compBrandHead titleCard">
                        <div className="titleCardImg">
                          <img
                            src={brand.brand_image ||  "https://storage.googleapis.com/insights_backend_bucket/br/dummybrand.jpeg"}
                            alt='i'
                          />
                        </div>
                        <div className="titleCardText">
                          <h2>{brand.instaBrandName}</h2>
                          <ul>
                            <li>{formatString(brand.majorCategory)}</li>
                    
                            <li>{formatString(brand.brandCategoryName)}</li>
                            <li>{formatNumber(brand.postcount)}</li>
                          </ul>
                          {/* <h6 style={{ fontWeight: 'normal' }}>{formatString(brand.brandSubCategoryName)}</h6> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="divTableBody">
                <div className="divTableRow">
                  <div className="divTableCell" data-label="Hero Title">
                    <h6 className="divTableTH">
                      <span>
                        <ion-icon name="chatbubble-outline"></ion-icon>
                      </span>
                      Major-Category
                    </h6>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableCell" key={index}>
                      <p>{brand.majorCategory}</p>
                    </div>
                  ))}
                </div>
                <div className="divTableRow">
                  <div className="divTableCell">
                    <h6 className="divTableTH">
                      <span>
                        <ion-icon name="list-outline"></ion-icon>
                      </span>
                      Post-Count
                    </h6>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableCell" key={index}>
                      <p>{brand.post_count}</p>
                    </div>
                  ))}
                </div>
                <div className="divTableRow">
                  <div className="divTableCell" data-label="Hero Title">
                    <h6 className="divTableTH">
                      <span>
                        <ion-icon name="heart-outline"></ion-icon>
                      </span>
                      Likes
                    </h6>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableCell" key={index}>
                      <p>{brand.likes || 'N/A'}</p>
                    </div>
                  ))}
                </div>
                <div className="divTableRow">
                  <div className="divTableCell" data-label="Hero Title">
                    <h6 className="divTableTH">
                      <span>
                        <ion-icon name="eye-outline"></ion-icon>
                      </span>
                      Views
                    </h6>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableCell" key={index}>
                      <p>{brand.views || 'N/A'}</p>
                    </div>
                  ))}
                </div>
                <div className="divTableRow">
                  <div className="divTableCell" data-label="Hero Title">
                    <h6 className="divTableTH">
                      <span>
                        <ion-icon name="chatbubble-outline"></ion-icon>
                      </span>
                      Comments
                    </h6>
                  </div>
                  {topBrands.map((brand, index) => (
                    <div className="divTableCell" key={index}>
                      <p>{brand.comments || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}
