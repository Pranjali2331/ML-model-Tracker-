from flask import Flask, request, jsonify
from flask_cors import CORS

import joblib
import pandas as pd
from datetime import timedelta

app = Flask(__name__)
CORS(app)
# Load model
model = joblib.load("period_tracker_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_data = pd.DataFrame([{
        "Age": data["age"],
        "Average_Cycle_Length": data["avg_cycle"],
        "Period_Duration": data["period_duration"],
        "Flow Intensity": data["flow"],
        "Cycle Regularity": data["regularity"],
        "Sleep_Hours": data["sleep"],
        "Exercise_Frequency": data["exercise"]
    }])

    predicted_cycle = int(model.predict(input_data)[0])

    last_period = pd.to_datetime(data["last_period"])
    next_period = last_period + timedelta(days=predicted_cycle)

    return jsonify({
        "predicted_cycle_length": predicted_cycle,
        "next_period_date": str(next_period.date())
    })

if __name__ == "__main__":
    app.run(debug=True)
