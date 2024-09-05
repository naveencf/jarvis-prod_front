import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import axios from "axios";
import "./OrgTree.css"; // Import your CSS file
import FormContainer from "../../FormContainer";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { baseUrl } from "../../../../utils/config";

const OrgTree = () => {
  const { userID } = useAPIGlobalContext();
  const [orgData, setOrgData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          baseUrl+`report_l1_users_data/${userID}`
        );
        setOrgData(response.data.data);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const renderNode = (data) => (
    <TreeNode label={<div>{data.user_name}</div>}>
      {data &&
        data.map((acc) => (
          <TreeNode
            label={
              <div className="stabelizer">
                <div className="root">
                  {orgData[0].image !== "" ? (
                    <div className="icon-1">
                      <i className="bi bi-person-circle"></i>
                    </div>
                  ) : (
                    <div className="image-p">
                      <img
                        className="image-p"
                        src={orgData[0].image}
                        alt="IMG"
                      />
                    </div>
                  )}
                  <p>{acc.user_name}</p>
                </div>
              </div>
            }
          />
        ))}
    </TreeNode>
  );

  return (
    <div>
      <FormContainer link={true} mainTitle={"Team Tree"} />
      <div className="org-tree-container">
        {orgData ? (
          <Tree
            lineWidth={"4px"}
            lineColor={"green"}
            lineBorderRadius={"10px"}
            label={
              <div className="stabelizer">
                <div className="root">
                  {orgData[0].image !== "" ? (
                    <div className="icon-1">
                      <i className="bi bi-person-circle"></i>
                    </div>
                  ) : (
                    <img className="image-p" src={orgData[0].image} alt="IMG" />
                  )}
                  <p>{orgData[0].Report_L1N} (Manager)</p>
                </div>
              </div>
            }
          >
            {renderNode(orgData)}
          </Tree>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default OrgTree;
