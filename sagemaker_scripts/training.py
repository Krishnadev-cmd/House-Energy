import argparse
import os
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import json

def load_data(data_dir):
    """Load parquet files from directory"""
    print(f"Loading data from {data_dir}")
    
    # List all parquet files
    files = [f for f in os.listdir(data_dir) if f.endswith('.parquet')]
    print(f"Found {len(files)} parquet files")
    
    # Load all files
    dfs = []
    for file in files:
        filepath = os.path.join(data_dir, file)
        df = pd.read_parquet(filepath)
        dfs.append(df)
    
    # Combine all dataframes
    df = pd.concat(dfs, ignore_index=True)
    print(f"Total rows loaded: {len(df)}")
    
    return df

def train(df):
    """Train the model"""
    print("Starting training...")
    
    # Define features
    feature_cols = [
        'hour', 'day_of_week', 'day', 'month', 'is_weekend',
        'Global_active_power_max', 'Global_active_power_min', 
        'Global_active_power_std', 'Voltage_mean',
        'power_lag_1h', 'power_lag_24h', 'power_lag_168h',
        'power_rolling_mean_7d', 'power_rolling_std_7d'
    ]
    
    target_col = 'target_power'
    
    # Prepare data
    X = df[feature_cols]
    y = df[target_col]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train Random Forest model
    print("Training Random Forest...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=20,
        min_samples_split=10,
        min_samples_leaf=5,
        random_state=42,
        n_jobs=-1,
        verbose=1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    print("Evaluating model...")
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    train_metrics = {
        'train_rmse': np.sqrt(mean_squared_error(y_train, y_pred_train)),
        'train_mae': mean_absolute_error(y_train, y_pred_train),
        'train_r2': r2_score(y_train, y_pred_train)
    }
    
    test_metrics = {
        'test_rmse': np.sqrt(mean_squared_error(y_test, y_pred_test)),
        'test_mae': mean_absolute_error(y_test, y_pred_test),
        'test_r2': r2_score(y_test, y_pred_test)
    }
    
    print("\nTraining Metrics:")
    print(json.dumps(train_metrics, indent=2))
    
    print("\nTest Metrics:")
    print(json.dumps(test_metrics, indent=2))
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Important Features:")
    print(feature_importance.head(10))
    
    return model, feature_cols, {**train_metrics, **test_metrics}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    
    # SageMaker specific arguments
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR', './model'))
    parser.add_argument('--train', type=str, default=os.environ.get('SM_CHANNEL_TRAINING', './data'))
    parser.add_argument('--output-data-dir', type=str, default=os.environ.get('SM_OUTPUT_DATA_DIR', './output'))
    
    args = parser.parse_args()
    
    # Load data
    df = load_data(args.train)
    
    # Train model
    model, feature_cols, metrics = train(df)
    
    # Save model
    print(f"\nSaving model to {args.model_dir}")
    os.makedirs(args.model_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(args.model_dir, 'model.joblib'))
    joblib.dump(feature_cols, os.path.join(args.model_dir, 'feature_cols.joblib'))
    
    # Save metrics
    with open(os.path.join(args.output_data_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print("Training completed successfully!")