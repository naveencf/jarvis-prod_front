import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import Select from "react-select";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import TextEditor from "../../ReusableComponents/TextEditor";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import image_upload from "/image_upload.png";
import { set } from "date-fns";
import { it } from "date-fns/locale";
import getDecodedToken from "../../../utils/DecodedToken";
const announcementForList = [
  { value: "yes", label: "All Employees" },
  { value: "no", label: "Only Selected Employees" },
];
const AnnoucementPost = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const token = getDecodedToken();
  const loginUserId = token.id;
  const [announcementFor, setAnnouncementFor] = useState("");
  const [department, setDepartment] = useState([]);
  const [departmentdata, setDepartmentData] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [jobType, setJobType] = useState("");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContect] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [image, setImage] = useState(null);
  const [notify_user_on_mail, setNotifyUserOnMail] = useState("no");
  const clean_depdata = () => {
    if (announcementFor?.value === "yes") {
      setDepartment([]);
      setDesignation([]);
      setJobType([]);
    }
  };
  useEffect(() => {
    if (announcementFor?.value === "no") {
      axios.get(baseUrl + "get_all_departments").then((res) => {
        setDepartmentData(res.data);
      });
      axios.get(baseUrl + "get_all_job_types").then((res) => {
        setJobTypeData(res.data.data);
      });
    }

    if (department.length > 0 && departmentdata.length !== department.length) {
      axios
        .get(
          baseUrl +
          `get_all_designations_by_deptId/${department[department.length - 1]
          }`
        )
        .then((res) => {
          const newDesignations = res.data.data;

          const updatedDesignationData = [
            ...new Set([...designationData, ...newDesignations]),
          ];
          setDesignationData(updatedDesignationData);
        });
    }
  }, [announcementFor, department]);

  const handleAttachmentSelect = (event) => {
    const files = event.target.files;

    setAttachments([...files]);
  };

  const handleSelectAllDepartments = () => {
    const allDepartmentIds = departmentdata.map((dept) => dept.dept_id);
    setDepartment(allDepartmentIds);

    axios.get(baseUrl + "get_all_designations").then((res) => {
      setDesignationData(res.data.data, "designaation");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("all_emp", announcementFor?.value);
    formData.append("dept_id", department);
    formData.append("desi_id", designation);
    formData.append("job_type", jobType);

    for (let i = 0; i < attachments.length; i++) {
      formData.append(`attachment`, attachments[i]);
    }

    formData.append("post_content", announcementContent);
    formData.append("post_subject", announcementTitle);
    formData.append("notify_by_user_email", notify_user_on_mail);
    formData.append("email_response", "lsfkj;aljf;lasfl");
    formData.append("image", image);
    formData.append("created_by", loginUserId);
    console.log(Object.fromEntries(formData.entries()));
    try {
      const response = await axios.post(
        `${baseUrl}add_announcement`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toastAlert(response.data.message);
    } catch (error) {
      toastError(response.data.message);
    }
  };

  return (
    <div className="master-card-css">
      <FormContainer
        mainTitle="Announcement"
        handleSubmit={false}
        link={true}
      />

      <form className="master-card-css" onSubmit={handleSubmit}>
        <div
          className="card body-padding"
          style={{
            height: "100px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <img src={image_upload} alt="Add Image"/> */}
          <input
            id="image-up"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            style={{ display: "none" }}
          />
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
            }}
            htmlFor="image-up"
          >
            <img className="img-upload" src={image_upload} alt="" />
            <div className="d-flex">
              <p>+ Add Header Image</p> &nbsp;{" "}
              <span style={{ color: "var(--gray-500)" }}>(optional)</span>
            </div>
          </label>
        </div>
        <div className="card body-padding ">
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              name="title"
              id="title"
              placeholder="title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
            />
          </div>
          {/* <FieldContainer
          label="Title"
          type="text"
          placeholder="Enter title here"
          fieldGrid={6}
          required={true}
          value={announcementTitle}
          onChange={(e) => setAnnouncementTitle(e.target.value)}
          
        /> */}

          <div className="form-group m-0">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <TextEditor
              id="description"
              value={announcementContent}
              onChange={setAnnouncementContect}
            />
          </div>
        </div>
        <div className="card body-padding">
          <h6 className="mb-3">Publish Option</h6>
          <div className="row">
            <div className="form-group w-100">
              <label className="form-label">
                Select Target Audience <sup style={{ color: "red" }}>*</sup>
              </label>
              <div className="pack sb">
                {announcementForList.map((item, index) => (
                  <div
                    key={index}
                    className="form-check form-check-inline w-100"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="select_target_audience"
                      value={item}
                      id={`flexRadioDefault${index}`}
                      checked={item.value === announcementFor?.value}
                      onChange={() => {
                        setAnnouncementFor(item), clean_depdata();
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`flexRadioDefault${index}`}
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
              {/*           
  
          <Select
            options={announcementForList}
            value={announcementFor}
            onChange={(e) => {
              setAnnouncementFor(e);
            }}
            required
          /> */}
            </div>

            {announcementFor?.value === "no" && (
              <div className="d-flex justify-content-spacebetween w-100">
                <div className="form-group col-3">
                  <label className="form-label">
                    Department Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllDepartments}
                    className="btn btn-primary btn-sm ml-5 mb-1"
                  >
                    Select All Departments
                  </button>
                  <Select
                    options={departmentdata?.map((option) => ({
                      value: option.dept_id,
                      label: option.dept_name,
                    }))}
                    value={departmentdata
                      ?.filter((option) => department?.includes(option.dept_id))
                      ?.map((option) => ({
                        value: option.dept_id,
                        label: option.dept_name,
                      }))}
                    onChange={(e) =>
                      setDepartment(e.map((option) => option.value))
                    }
                    isMulti
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Designation <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={designationData.map((option) => ({
                      value: option.desi_id,
                      label: `${option.desi_name}`,
                    }))}
                    value={designationData
                      .filter((option) => designation.includes(option.desi_id))
                      .map((option) => ({
                        value: option.desi_id,
                        label: option.desi_name,
                      }))}
                    onChange={(e) => {
                      setDesignation(e.map((option) => option.value));
                    }}
                    isDisabled={!department.length}
                    isMulti
                    required
                  />
                </div>

                <div className="form-group col-3">
                  <label className="form-label">
                    Job Type <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={jobTypeData.map((option) => ({
                      value: option.job_type,
                      label: `${option.job_type}`,
                    }))}
                    value={jobTypeData
                      .filter((option) => jobType.includes(option.job_type))
                      .map((option) => ({
                        value: option.job_type,
                        label: option.job_type,
                      }))}
                    onChange={(e) => {
                      setJobType(e.map((option) => option.value));
                    }}
                    isMulti
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group form-check form-check-inline w-100">
              <input
                className="form-check-input"
                type="checkbox"
                name="notify_user_on_mail"
                value={notify_user_on_mail}
                id="notify_user_on_mail"
                onChange={() => {
                  notify_user_on_mail === "yes"
                    ? setNotifyUserOnMail("no")
                    : setNotifyUserOnMail("yes");
                }}
              />

              <label className="form-check-label" htmlFor="notify_user_on_mail">
                Notify User On Mail
              </label>
            </div>
          </div>
        </div>
        <div className="card body-padding">
          <div
            className="pack"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              gap: "10px",
            }}
          >
            <button
              type="submit"
              className="btn cmnbtn btn-primary"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40px",
                width: "130px",
              }}
            >
              Publish
            </button>

            <label
              htmlFor="attachment-multi2"
              className="btn cmnbtn btn-outline-primary"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40px",
                width: "130px",
              }}
            >
              Attachment <i className="bi bi-paperclip" />
            </label>
            <input
              id="attachment-multi2"
              type="file"
              multiple
              onChange={handleAttachmentSelect}
              className="form-control"
              style={{ display: "none" }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnnoucementPost;
