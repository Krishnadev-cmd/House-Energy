import joblib
import numpy as np
import pandas as pd
import json
import os
import traceback

def model_fn(model_dir):
    """Load the model and feature columns"""
    print(f"Loading model from {model_dir}")
    try:
        model = joblib.load(os.path.join(model_dir, 'model.joblib'))
        feature_cols = joblib.load(os.path.join(model_dir, 'feature_cols.joblib'))
        print(f"Model loaded successfully. Feature columns: {feature_cols}")
        return {'model': model, 'feature_cols': feature_cols}
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        print(traceback.format_exc())
        raise

def input_fn(request_body, content_type='application/json'):
    """Parse input data"""
    print(f"Received request with content type: {content_type}")
    print(f"Request body: {request_body[:500]}")  # Print first 500 chars
    try:
        if content_type == 'application/json':
            data = json.loads(request_body)
            print(f"Parsed data type: {type(data)}")
            print(f"Parsed data: {data}")
            return data
        else:
            raise ValueError(f"Unsupported content type: {content_type}")
    except Exception as e:
        print(f"Error in input_fn: {str(e)}")
        print(traceback.format_exc())
        raise

def predict_fn(input_data, model_dict):
    """Make prediction"""
    print("Making prediction...")
    print(f"Input data type: {type(input_data)}")
    print(f"Input data: {input_data}")
    try:
        model = model_dict['model']
        feature_cols = model_dict['feature_cols']
        
        # Handle different input formats
        # Format 1: List of dictionaries [{"hour": 10, ...}, {...}]
        # Format 2: 2D array [[10, 1, 15, ...], [...]]
        
        if isinstance(input_data, list):
            if len(input_data) > 0:
                # Check if first element is a dict or list
                if isinstance(input_data[0], dict):
                    # Format 1: List of dicts
                    df = pd.DataFrame(input_data)
                    print(f"Input format: List of dictionaries")
                elif isinstance(input_data[0], (list, tuple)):
                    # Format 2: 2D array - create DataFrame with feature names
                    df = pd.DataFrame(input_data, columns=feature_cols)
                    print(f"Input format: 2D array")
                else:
                    raise ValueError(f"Unsupported input format: {type(input_data[0])}")
            else:
                raise ValueError("Empty input data")
        else:
            raise ValueError(f"Input must be a list, got {type(input_data)}")
        
        print(f"Input DataFrame shape: {df.shape}")
        print(f"Input DataFrame columns: {df.columns.tolist()}")
        print(f"Expected feature columns: {feature_cols}")
        
        # Ensure columns are in the same order as training
        df = df[feature_cols]
        
        # Make prediction
        predictions = model.predict(df)
        print(f"Predictions shape: {predictions.shape}")
        print(f"Predictions: {predictions}")
        return predictions
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        print(traceback.format_exc())
        raise

def output_fn(prediction, accept='application/json'):
    """Format output"""
    print(f"Formatting output with accept type: {accept}")
    try:
        if accept == 'application/json':
            # Return just the list of predictions (simpler format for Lambda)
            output = json.dumps(prediction.tolist())
            print(f"Output: {output}")
            return output, accept
        raise ValueError(f"Unsupported accept type: {accept}")
    except Exception as e:
        print(f"Error in output_fn: {str(e)}")
        print(traceback.format_exc())
        raise