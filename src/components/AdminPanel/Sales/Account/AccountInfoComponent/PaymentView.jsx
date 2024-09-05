import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PaymentView = () => {
  return (
    <>
      <div className="cardAccordion">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Payment View
          </AccordionSummary>
          <AccordionDetails>
            <div className="row"></div>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default PaymentView;
