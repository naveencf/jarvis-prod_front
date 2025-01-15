import { TextField } from "@mui/material";
import { useState } from "react";
// import React, { useState } from "react";

const OpreationLinkUpdateDirect = ({ setShortcode }) => {

    const [shtCode, setShtCode] = useState('')
    const handleClick = () => {
        setShortcode(shtCode);
    };

    return (
        <div>
            <div className="d-flex m-1">
                <TextField
                    style={{ width: "300px" }}
                    className="form-control mr-2"
                    label="Link Update"
                    type="text"
                    onChange={(e) => setShtCode(e.target.value)}
                />
                <button
                    className="btn cmnbtn btn_sm btn-outline-danger"
                    onClick={handleClick}
                >
                    Update
                </button>
            </div>
        </div>
    );
};

export default OpreationLinkUpdateDirect;
