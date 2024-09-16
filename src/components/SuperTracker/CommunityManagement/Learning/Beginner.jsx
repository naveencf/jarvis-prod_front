import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Beginner = () => {
    return (
        <div className="cardAccordion">
            <Accordion style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc', padding: '10px' }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon style={{ color: '#333' }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Beginner Detail</h3>
                </AccordionSummary>
                <AccordionDetails style={{ backgroundColor: '#fff', padding: '15px' }}>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    What To Do
                                </button>
                            </h2>
                            <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <ul>
                                        <li>Selected category-wise working</li>
                                        <li>Selected pages: Choose Plate From</li>
                                        <li>Additional content here...</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    What Not To Do
                                </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <ul>
                                        <li>Avoid doing this...</li>
                                        <li>And this...</li>
                                        <li>Explanation of why these actions are not recommended</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    How to Start
                                </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <ol>
                                        <li>Step 1: Do this</li>
                                        <li>Step 2: Do that</li>
                                        <li>Step 3: Follow these guidelines</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default Beginner;