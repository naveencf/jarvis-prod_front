import React, { use, useEffect, useState } from 'react'
import FieldContainer from '../../FieldContainer'
import axios from 'axios'

const FetchSheet = ({
    closeModal, setExcelFile, excelFile, setPlanLink
}) => {
    const [link, SetLink] = useState('');
    const [sheetData, SetSheetData] = useState([]);
    const [isPublic, SetIsPublic] = useState("");
    const [loading, setLoading] = useState(false);
    const apiKey = "AIzaSyAbxBnN-lUkYPCLLU32oSHFMFNMy1ql4dE";
    const sheetId = link.split("/")[5];

    async function convertBinary() {
        try {


            const downloadUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;

            const response = await axios.get(downloadUrl, {
                responseType: 'file', // Get the data as a Blob (binary data)
            });


            // Save the binary data in state


            // Optional: Create a Blob URL to download or display the content
            // const blobUrl = URL.createObjectURL(response.data);
            // SetSheetData('Download URL:', blobUrl);

        } catch (error) {
            console.eror(error);
        }
    }

    // useEffect(() => {

    //     if (isPublic)
    //         convertBinary();
    // }, [isPublic]);


    const handleDownload = () => {
        if (excelFile) {
            // Create a temporary link and trigger a download
            const url = URL.createObjectURL(excelFile);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'sheet.csv';  // Set the filename and format here
            link.click();
        }
    };
    async function HandelFetch() {
        setLoading(true);
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
            const res = await axios.get(url);
            setPlanLink(link);
            closeModal();
        }
        catch (err) {
            SetIsPublic(false);
        }
        finally {
            setLoading(false);
        }

    }


    return (
        <div>
            <div className="card">
                <div className="card-body row">


                    <FieldContainer
                        type="text"
                        label="Google Sheet Link"
                        value={link}
                        onChange={(e) => SetLink(e.target.value)}
                        fieldGrid={12}
                    />
                    {isPublic === false && <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 pb-3">
                        <h5 className='form-error'>Please make this Sheet Link Public</h5>
                    </div>
                    }
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 pb-2">
                        <button className="btn cmnbtn btn_sm btn-primary" onClick={HandelFetch} disabled={loading}>Fetch</button>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default FetchSheet