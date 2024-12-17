import React, { useState, useEffect } from "react";
import "./dashboard.css";
import BackgroundImage from "../assets/BG.jpg"; // Ensure the background image is imported
import * as XLSX from "xlsx"; // Import xlsx library
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaThermometerHalf, FaTint, FaLeaf, FaCalendarAlt, FaSeedling, FaTree } from 'react-icons/fa';



const Dashboard = () => {
    const [data, setData] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState(null); // Crop type from the file
    const [file, setFile] = useState(null); // File state

    useEffect(() => {
        const exampleData = [
            {
                Date: "01/01/2014",
                Crop_Type: "Wheat",
                Soil_Type: "Peaty",
                Soil_pH: 5.5,
                Temperature: 9.44,
                Humidity: 80,
                Wind_Speed: 10.95,
                N: 60.5,
                P: 45,
                K: 31.5,
                Crop_Yield: 22.83,
                Soil_Quality: 22.8,
            },
            {
                Date: "01/01/2014",
                Crop_Type: "Corn",
                Soil_Type: "Loamy",
                Soil_pH: 6.5,
                Temperature: 20.05,
                Humidity: 79.95,
                Wind_Speed: 8.59,
                N: 84,
                P: 66,
                K: 50,
                Crop_Yield: 104.87,
                Soil_Quality: 66.6,
            },
        ];
        setData(exampleData);
    }, []);

    // Handle file upload and parse it
    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            parseExcel(uploadedFile);
        }
    };

    const parseExcel = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);

            const cropType = parsedData[0]?.Crop_Type;
            if (cropType) {
                setSelectedCrop(cropType);
                sendDataToBackend(parsedData);
            }
        };
        reader.readAsBinaryString(file);
    };

    // Send the data to the backend for prediction
    const sendDataToBackend = async (data) => {
        // Prepare data for backend (exclude Crop_Yield)
        // const dataForPrediction = data.map(({ Crop_Yield, ...rest }) => rest);

        const dataForPrediction = {
            "Temperature": 25.0,
            "Soil_pH": 6.5,
            "Soil_Quality": 7.8
        }

        try {
            const response = await axios.post("http://127.0.0.1:8001/predict", dataForPrediction);
            const predictedYield = response.data.cropYield;
            setPrediction(predictedYield);

            console.log(predictedYield)
        } catch (error) {
            console.error("Error predicting crop yield:", error);
            setPrediction("Error occurred");
        }
    };

    const temperature = data.find((item) => item.Crop_Type === selectedCrop)?.Temperature;
    const humidity = data.find((item) => item.Crop_Type === selectedCrop)?.Humidity;
    const soilQuality = data.find((item) => item.Crop_Type === selectedCrop)?.Soil_Quality;

    const location = useLocation();


    const { pred, dataForPrediction } = location.state || {};



    const num = parseFloat(pred);

    // Specify the number of decimal places (e.g., 2 decimal places)
    const numWithDecimals = num.toFixed(2);

    console.log(pred)
    return (
        <div
            className="fullscreen-bg"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
            }}
        >
            <h1 className="title">Crop Yield Prediction Dashboard</h1>

            {/* File upload field */}
            <div className="file-input-container">
                <input
                    type="file"
                    className="file-input"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                />
            </div>

            {/* Display selected crop type */}
            {selectedCrop && (
                <div>
                    <h3>Selected Crop: {selectedCrop}</h3>
                </div>
            )}

            {/* Card displaying temperature, humidity, and soil quality */}
            <div className="card-container">
                <div className="card">
                    <FaThermometerHalf size={40} color="#FF6347" />
                    <h3>Temperature</h3>
                    <div className="value">
                        {dataForPrediction.Temperature ? `${dataForPrediction.Temperature}°C` : 'Data not available'}
                    </div>
                </div>

                <div className="card">
                    <FaTint size={40} color="#1E90FF" />
                    <h3>Soil pH</h3>
                    <div className="value">
                        {dataForPrediction.Soil_pH ? `${dataForPrediction.Soil_pH}` : 'Data not available'}
                    </div>
                </div>

                <div className="card">
                    <FaLeaf size={40} color="#228B22" />
                    <h3>Soil Quality</h3>
                    <div className="value">
                        {dataForPrediction.Soil_Quality ? `${dataForPrediction.Soil_Quality}%` : 'Data not available'}
                    </div>
                </div>

                <div className="card">
                    <FaCalendarAlt size={40} color="#FFD700" />
                    <h3>Date</h3>
                    <div className="value">
                        {dataForPrediction.Date
                            ? new Date((dataForPrediction.Date - 25569) * 86400 * 1000).toLocaleDateString() // Convert Excel serial date to readable format
                            : 'Data not available'}
                    </div>
                </div>


                <div className="card">
                    <FaSeedling size={40} color="#228B22" />
                    <h3>Crop Type</h3>
                    <div className="value">
                        {dataForPrediction.Crop_Type ? dataForPrediction.Crop_Type : 'Data not available'}
                    </div>
                </div>

                <div className="card">
                    <FaTree size={40} color="#8B4513" />
                    <h3>Soil Type</h3>
                    <div className="value">
                        {dataForPrediction.Soil_Type ? dataForPrediction.Soil_Type : 'Data not available'}
                    </div>
                </div>
            </div>


            <div className="prediction">
                <h2>Predicted Crop Yield</h2>
                <p className="prediction-result">
                    <FaSeedling size={40} color="#32CD32" />
                    {numWithDecimals ? `${numWithDecimals} tons` : "Loading..."}
                </p>
            </div>



            <button className="back-button" onClick={() => window.location.href = "/"}>
                Predict Again
            </button>
        </div>
    );
};

export default Dashboard;
