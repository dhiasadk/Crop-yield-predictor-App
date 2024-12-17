import requests

# Define the API endpoint
url = "http://127.0.0.1:8000/predict"

# Input features for prediction
data = {
    "Temperature": 25.5,
    "Soil_pH": 6.2,
    "Soil_Quality": 55.3
}

# Send a POST request to the API
response = requests.post(url, json=data)

# Print the response
print(response.json())
