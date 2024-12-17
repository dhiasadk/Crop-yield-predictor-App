from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
import logging

# Initialize FastAPI app
app = FastAPI()

# Load the trained model and scaler
model = joblib.load("C:/Users/dhias/Downloads/LGBM_crop_yield_model.pkl")
scaler = joblib.load("C:/Users/dhias/Downloads/scaler.pkl")



logging.basicConfig(level=logging.INFO)  
logger = logging.getLogger(__name__)

# Define the request schema
class PredictionRequest(BaseModel):
    Temperature: float
    Soil_pH: float
    Soil_Quality: float



# Define the prediction endpoint
@app.post("/predict")
def predict(request: PredictionRequest):

   

    try:
        

            # Extract features from the request
            features = np.array([[request.Temperature, request.Soil_pH, request.Soil_Quality]])

            # Scale the features
            scaled_features = scaler.transform(features)

            # Make a prediction
            prediction = model.predict(scaled_features)

            # Return the prediction
            return{"predicted_crop_yield": prediction[0]}
        
    except Exception as e:
        return {"error": str(e)}
    
    

# Define a health check endpoint
@app.get("/")
def health_check():
    return {"status": "Server is running"}




# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins if necessary
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

