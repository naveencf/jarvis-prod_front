import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
// import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LastestUpdate = () => {
  return (
    <div>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            LastestUpdate Detail
          </AccordionSummary>
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  what is the lastest thing
                </div>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default LastestUpdate
