import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import TextEditor from "../../ReusableComponents/TextEditor";
import { axisClasses } from "@mui/x-charts";
import { baseUrl } from "../../../utils/config";

const CocMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  // const [displaySeq, setDisplaySeq] = useState("");
  // const [heading, setHeading] = useState("");
  // const [headingDesc, setHeadingDesc] = useState("");
  // const [subHeading, setSubHeading] = useState("");
  // const [subHeadingDesc, setSubHeadingDesc] = useState("");
  // const [subHeadingSeq, setSubHeadingSeq] = useState("");
  // const [description, setDescription] = useState("");
  // const [remarks, setRemarks] = useState("");

  const [cocContent, setCocContent] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   await axios.post(baseUrl+"add_coc", {
  //     display_sequence: displaySeq,
  //     heading: heading,
  //     heading_desc: headingDesc,
  //     sub_heading: subHeading,
  //     sub_heading_desc: subHeadingDesc,
  //     sub_heading_sequence: subHeadingSeq,
  //     description: description,
  //     remarks: remarks,
  //     created_by: loginUserId,
  //   });

  //   setDisplaySeq("");
  //   setHeading("");
  //   setSubHeading("");
  //   setSubHeadingSeq("");
  //   setDescription("");
  //   setRemarks("");

  //   toastAlert("Coc created");
  //   setIsFormSubmitted(true);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "newcoc", {
        coc_content: cocContent,
        created_by: loginUserId,
      });
      toastAlert("COC Created");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error Adding COC");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/pre-onboard-coc-overview" />;
  }

  // return (
  //   <>
  //     <FormContainer
  //       mainTitle="COC"
  //       title="Coc Creation"
  //       handleSubmit={handleSubmit}
  //     >
  //       <FieldContainer
  //         label="Display Sequence"
  //         type="number"
  //         fieldGrid={4}
  //         required={false}
  //         value={displaySeq}
  //         onChange={(e) => setDisplaySeq(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Heading"
  //         fieldGrid={4}
  //         required={false}
  //         value={heading}
  //         onChange={(e) => setHeading(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Sub Heading"
  //         fieldGrid={4}
  //         value={subHeading}
  //         required={false}
  //         onChange={(e) => setSubHeading(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Sub Heading Sequence"
  //         type="number"
  //         fieldGrid={4}
  //         required={false}
  //         value={subHeadingSeq}
  //         onChange={(e) => setSubHeadingSeq(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Remarks"
  //         fieldGrid={4}
  //         // type="date"
  //         value={remarks}
  //         required={false}
  //         onChange={(e) => setRemarks(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Heading Description"
  //         Tag="textarea"
  //         fieldGrid={4}
  //         required={false}
  //         value={headingDesc}
  //         onChange={(e) => setHeadingDesc(e.target.value)}
  //       />

  //       <FieldContainer
  //         label="Sub Heading Description"
  //         Tag="textarea"
  //         fieldGrid={4}
  //         required={false}
  //         value={subHeadingDesc}
  //         onChange={(e) => setSubHeadingDesc(e.target.value)}
  //       />

  //       <FieldContainer
  //         Tag="textarea"
  //         label="description"
  //         required={false}
  //         fieldGrid={4}
  //         value={description}
  //         onChange={(e) => setDescription(e.target.value)}
  //       />
  //     </FormContainer>
  //   </>
  // );

  return (
    <div>
      <FormContainer
        link={true}
        mainTitle="COC"
        handleSubmit={handleSubmit}
      >

        {/* <div style={{ border: "solid" }}>
          <div dangerouslySetInnerHTML={{ __html: cocContent }}></div>
        </div> */}
      </FormContainer>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Coc Creation
          </div>
        </div>
        <div className="card-body">
          <TextEditor value={cocContent} onChange={setCocContent} />

        </div>
      </div>
      <button className="btn btn-primary cmnbtn " onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CocMaster;
