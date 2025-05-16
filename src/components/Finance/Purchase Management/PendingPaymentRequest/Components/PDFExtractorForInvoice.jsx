import axios from "axios";
import { useState } from "react";
import { baseUrl } from "../../../../../utils/config";
import { useEffect } from "react";

// Levenshtein Distance Function
const getEditDistance = (a, b) => {
    if (!a || !b) return Math.max(a?.length || 0, b?.length || 0);
    const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }
    return dp[a.length][b.length];
};

export default function PDFExtractorForInvoice({ file, setExtractedData }) {
    // const [file, setFile] = useState(null);
    // const [extractedData, setExtractedData] = useState({});
    const token = sessionStorage.getItem("token");
    const COMPANY_NAME = "CREATIVEFUEL PRIVATE LIMITED";

    useEffect(() => {
        extractText()
    }, [file])

    // useEffect(() => {
    //     if (file) {
    //         axios.get(file, { responseType: "blob" }) // Fetch as binary
    //             .then(response => extractText(response.data)) // Send blob to extractText
    //             .catch(error => console.error("Error fetching PDF:", error));
    //     }
    // }, [file]);

    const normalizeText = (text) => {
        return text
            .replace(/\s+/g, " ") // Replace multiple spaces/newlines with a single space
            .trim() // Remove leading/trailing spaces
            .toUpperCase(); // Convert to uppercase for case-insensitive comparison
    };

    const checkCompanyName = (text) => {
        const COMPANY_NAME = "CREATIVEFUEL PRIVATE LIMITED";
        const normalizedCompanyName = normalizeText(COMPANY_NAME);

        const words = text.split("\n").map((line) => normalizeText(line));

        for (let line of words) {
            if (line.includes(normalizedCompanyName)) {
                return { foundName: line, isCorrect: true };
            }
        }

        return { foundName: "Not Found", isCorrect: false };
    };

    const extractDetails = (text) => {
        // Extract Account Number (9-18 digits, various formats)
        const accountPatterns = [
            /Account\s*Number[:\s-]*(\d{9,18})/i,  // Account Number: 1234567890123456
            /A\/c\s*No[:\s-]*(\d{9,18})/i,         // A/c No: 1234567890
            /A\/c[:\s-]*(\d{9,18})/i,              // A/c: 123456789012
            /\b\d{9,18}\b/                         // Generic 9-18 digit number
        ];
        let accountNumber = "Not Found";
        for (let pattern of accountPatterns) {
            const match = text.match(pattern);
            if (match) {
                accountNumber = match[1];
                break;
            }
        }

        // Extract IFSC Code
        const ifscPattern = /\b[A-Z]{4}0[A-Z0-9]{6}\b/; // Example: SBIN0011560
        const ifscCode = text.match(ifscPattern)?.[0] || "Not Found";


        // Extract Invoice or Bill Number
        const invoicePatterns = [
            /(?:Invoice|Bill)\s*No\.?\s*[-:]?\s*(\S+)/i,  // Matches: Bill No. - 1, Invoice No: 12345
            /Invoice[:\s-]*(\S+)/i,                       // Matches: Invoice: 00628
            /Bill[:\s-]*(\S+)/i                           // Matches: Bill No: 1
        ];

        let invoiceNo = "Not Found";
        for (let pattern of invoicePatterns) {
            const match = text.match(pattern);
            if (match) {
                invoiceNo = match[1];
                break;
            }
        }

        // Extract "Bill To" (First line after "Bill To:")
        const billToPattern = /Bill\s*to[:\s-]*(.*?)(?=\n|Invoice)/i;
        const billTo = text.match(billToPattern)?.[1]?.trim() || "Not Found";

        // Extract Date (handles multiple formats like 13-03-25, March 2025, 2025-03-13)
        const datePattern = /\b(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{1,2} [A-Za-z]+ \d{4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/;
        const date = text.match(datePattern)?.[1] || "Not Found";

        // Extract PAN Card Number (ABCDE1234F)
        const panPattern = /\b[A-Z]{5}\d{4}[A-Z]\b/;
        const panCardNo = text.match(panPattern)?.[0] || "Not Found";

        // Extract Vendor Name (Account Holder Name)
        const vendorPatterns = [
            /Account\s*Holder\s*Name[:\s-]*(.*?)(?=\n|Bank)/i,
            /Name[:\s-]*(.*?)(?=\n|Bank)/i,
            /Payee\s*Name[:\s-]*(.*?)(?=\n|Bank)/i
        ];
        let vendorName = "Not Found";
        for (let pattern of vendorPatterns) {
            const match = text.match(pattern);
            if (match) {
                vendorName = match[1].trim();
                break;
            }
        }

        return { accountNumber, ifscCode, invoiceNo, billTo, date, panCardNo, vendorName };
    };

    const extractText = async () => {
        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        if (file instanceof Blob) {
            // If `file` is a Blob (actual file), send as `pdf`
            formData.append("pdf", file);
        } else if (typeof file === "string" && file.startsWith("http")) {
            // If `file` is a URL, send as `pdfUrl`
            formData.append("pdfUrl", file);
        } else {
            console.error("Invalid file format");
            return;
        }
        try {
            const response = await axios.post(baseUrl + "add_pdf_extract", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const text = response.data.extractedText || "";
            const details = extractDetails(text);
            const companyCheck = checkCompanyName(text);

            setExtractedData({ ...details, companyName: companyCheck.foundName, isCorrect: companyCheck.isCorrect });

            console.log("Extracted Details:", text);

        } catch (error) {
            console.error("Error uploading PDF:", error);
        }
    };


    const extractTextmanually = () => {
        console.log("Extracting Manually...");

        const tempText = `\n\nName - Nikita Kishor Loungani\nAddress  - F2/401, Rockford, Greencity, Ambernath East - 421501, Thane, Maharashtra\n
        PAN No. - BNCPL6704Q\nBill No. - 1\nDate - 13-03-25\nEmail - lounganinikita25@gmail.com\nContact -  8390932905\n
        Buyer: CREATIVEFUEL PRIVATE LIMITED\n105, Gravity Mall\nVijay Nagar\nIndore Madhya Pradesh 452010\nIndia\n
        GSTIN 23AAJCC1807B1ZC\nNature of Business: Payment to advertising agency to carry out the work of advertisement\n
        Account Holder Name - Nikita Kishor Loungani\nBank Name - HDFC Bank\nAccount Number - 50100596723483\nIFSC Code - HDFC0008390\nBranch -  Andheri West`;

        const details = extractDetails(tempText);
        const companyCheck = checkCompanyName(tempText);

        setExtractedData({ ...details, companyName: companyCheck.foundName, isCorrect: companyCheck.isCorrect });

        console.log("Extracted Details:", details);
        console.log("Company Name Check:", companyCheck);
    };

    return (
        <div>
            {/* <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={extractText} disabled={!file}>
                Upload & Extract Text
            </button> */}
            {/* <button onClick={extractTextmanually} >
                Extract Text
            </button> */}

            {/* {Object.keys(extractedData).length > 0 && (
                <div>
                    <h3>Extracted Details</h3>
                    <p><strong>Invoice No:</strong> {extractedData.invoiceNo}</p>
                    <p><strong>Bill To:</strong> {extractedData.billTo}</p>
                    <p><strong>Date:</strong> {extractedData.date}</p>
                    <p><strong>PAN Card No:</strong> {extractedData.panCardNo}</p>
                    <p><strong>Vendor Name:</strong> {extractedData.vendorName}</p>
                    <p><strong>Account Number:</strong> {extractedData.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {extractedData.ifscCode}</p>
                </div>
            )} */}
        </div>
    );
}
