import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const VendorDocuments = () => {
  return (
    <>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Documents
          </AccordionSummary>
          <AccordionDetails className="p0 border-0">
          saim yual 
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  )
}

export default VendorDocuments