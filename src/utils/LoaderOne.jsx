import React from 'react';
import './loader.css'; // Make sure this file is in the same folder or update the path

const LoaderOne = () => {
    return (
        <div className="loaderBgScreen">
            <div className="loaderElement">
                <div className="loaderOne">
                    <div className="loaderOneFile" style={{ "--i": 0 }}></div>
                    <div className="loaderOneFile" style={{ "--i": 1 }}></div>
                    <div className="loaderOneFile" style={{ "--i": 2 }}></div>
                    <div className="loaderOneFile" style={{ "--i": 3 }}></div>
                    <div className="loaderOneFile" style={{ "--i": 4 }}></div>
                    <div className="loaderOneFile" style={{ "--i": 5 }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoaderOne;
