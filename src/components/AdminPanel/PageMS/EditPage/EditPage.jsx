import { useState } from 'react'
import FormContainer from '../../FormContainer'
import PageMaster from '../PageMaster';

const accordionButtons = ["Edit Page", "Page Health", "Performance"];


export default function EditPage() {
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
    const handleAccordionButtonClick = (index) => {
      setActiveAccordionIndex(index);
    };
  return (
    <div>
       <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        submitButton={false}
      >
        {activeAccordionIndex === 0 && <PageMaster />}
        {/* {activeAccordionIndex === 1 && <PageHealth />}
        {activeAccordionIndex === 2 && <PerformanceDashboard />} */}
      </FormContainer>
    </div>
  )
}
