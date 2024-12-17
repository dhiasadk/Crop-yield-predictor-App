import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import Background from '../assets/backgroud.jpg';
import './header.css';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Corrected import

const Header = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [dataForPrediction, setDataForPrediction] = useState(null); // store the formatted data
    const navigate = useNavigate();

    // Send the data to the backend for prediction
    const sendDataToBackend = async () => {
        if (!dataForPrediction) {
            console.error('No data available for prediction');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8001/predict', dataForPrediction);
            return response.data.predicted_crop_yield;
        } catch (error) {
            console.error('Error predicting crop yield:', error);
        }
    };

    const goToDashboard = async () => {
        try {
            const data = await sendDataToBackend();
            console.log(data);
            navigate('/dashboard', { state: { pred: data, dataForPrediction: dataForPrediction } });
        } catch (error) {
            console.error('Error navigating to dashboard:', error);
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const uploadedFile = event.dataTransfer.files[0];

        if (uploadedFile && (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls'))) {
            setFile(uploadedFile);
            setError('');
            readExcelFile(uploadedFile);
        } else {
            setError('Veuillez importer un fichier Excel valide (.xlsx ou .xls).');
            setFile(null);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    // Handle file selection
    const handleFileSelect = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile && (uploadedFile.name.endsWith('.xlsx') || uploadedFile.name.endsWith('.xls'))) {
            setFile(uploadedFile);
            setError('');
            readExcelFile(uploadedFile);
        } else {
            setError('Veuillez importer un fichier Excel valide (.xlsx ou .xls).');
            setFile(null);
        }
    };

    // Read the Excel file and extract data
    const readExcelFile = (uploadedFile) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]]; // Assume the data is in the first sheet
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Extract the necessary columns from the sheet
            if (jsonData.length > 0) {
                const extractedData = {
                    Temperature: parseFloat(jsonData[0].Temperature) || 0,  // Ensure there's data or set default
                    Soil_pH: parseFloat(jsonData[0].Soil_pH) || 0,         // Same as above
                    Soil_Quality: parseFloat(jsonData[0].Soil_Quality) || 0, // Same as above
                    Date: jsonData[0].Date ? new Date((jsonData[0].Date - 25569) * 86400 * 1000).toLocaleDateString() : 'Data not available',  // Convert Excel date to a readable format
                    Crop_Type: jsonData[0].Crop_Type || 'Unknown',  // Default to 'Unknown' if missing
                    Soil_Type: jsonData[0].Soil_Type || 'Unknown'  // Default to 'Unknown' if missing

                };
                console.log(extractedData);

                setDataForPrediction(extractedData); // Update state with the formatted data
            } else {
                setError('Le fichier Excel ne contient pas de données valides.');
            }
        };

        reader.readAsBinaryString(uploadedFile);
    };

    return (
        <div
            className="fullscreen-bg"
            style={{
                backgroundImage: `url(${Background})`,
            }}
        >
            <header>
                <img src={Logo} alt="Logo" className="logo" />
            </header>

            <main>
                <div className="main-container">
                    <h2>Welcome to Crop Yield Predictor</h2>
                    <p>
                    Download your data to predict crop yields and improve your decision-making.
                    </p>

                    <div
                        className="drag-and-drop"
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                    >
                        {file ? (
                            <p className="text-green-600 font-semibold">{file.name} importé avec succès</p>
                        ) : (
                            <>
                                <p>Drag and drop your Excel file here</p>
                                <p>(or click to select a file)</p>
                            </>
                        )}
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            id="fileInput"
                            onChange={handleFileSelect}
                        />
                        <label htmlFor="fileInput">Select a file</label>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button onClick={goToDashboard} className="button">
                        See Results
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Header;
