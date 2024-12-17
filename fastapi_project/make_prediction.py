import numpy as np
import requests

# Input data (your original features)
input_data = [5.6, 3.2, 1.4]

# Pad the input data with zeros to match the required 3672 features
padded_input = np.pad(input_data, (0, 3672 - len(input_data)))

# Prepare the data for the POST request
# Ensure to match the expected field names from your FastAPI app (e.g., feature1, feature2, etc.)
data = {
    'feature1': padded_input[0],  # First feature
    'feature2': padded_input[1],  # Second feature
    'feature3': padded_input[2],  # Third feature
    # Add other features if needed, in the same way
    # For example:
    # 'feature4': padded_input[3],
    # 'feature5': padded_input[4],
    # ...
}

# Send the request to the FastAPI server
response = requests.post("http://127.0.0.1:8000/predict", json=data)

# Print the response from the server (prediction result)
print(response.json())
