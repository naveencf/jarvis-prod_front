import React from 'react'
import logo from "/logo.png";

const PDFHeader = () => {
  return (
    <header className="header-letter">
     <img src={logo} alt="Creativefuel Logo" width={70} height={70} />
        <div className="brandtext">
            Creative <span>Fuel</span>
        </div>
    </header>
  )
}

export default PDFHeader
