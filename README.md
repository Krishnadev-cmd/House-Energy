# 🏠⚡ House Energy Consumption Forecasting

An end-to-end machine learning pipeline for predicting household energy consumption using AWS services and Next.js web interface.

![Architecture](https://img.shields.io/badge/AWS-SageMaker-orange) ![License](https://img.shields.io/badge/license-MIT-blue) ![Python](https://img.shields.io/badge/python-3.8+-blue) ![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Model Training](#model-training)
- [Deployment](#deployment)
- [Web Application](#web-application)
- [Technologies Used](#technologies-used)
- [Results](#results)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project implements a complete MLOps pipeline for energy consumption forecasting, including:

- **Data Processing**: ETL pipeline using AWS Glue and local preprocessing
- **Feature Engineering**: Time-based features, lag features, rolling statistics
- **Model Training**: Random Forest model trained on AWS SageMaker
- **Model Deployment**: Real-time inference endpoint on SageMaker
- **API Gateway**: RESTful API for predictions via AWS Lambda
- **Web Interface**: Next.js application for user-friendly predictions
- **Monitoring**: Interactive dashboards with Plotly

## 🏗️ Architecture

```
┌─────────────────┐
│  Raw Data (CSV) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS S3 Bucket  │◄──── Data Upload
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AWS Glue ETL  │◄──── Feature Engineering
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parquet Files   │
│   (Features)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  SageMaker Training Job │◄──── Model Training
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Model Artifacts (S3)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  SageMaker Endpoint     │◄──── Real-time Inference
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│    AWS Lambda           │◄──── API Handler
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   API Gateway           │◄──── REST API
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Next.js Web App       │◄──── User Interface
└─────────────────────────┘
```

## ✨ Features

### Data Processing
- ✅ Automated ETL pipeline with AWS Glue
- ✅ Feature engineering with time-series transformations
- ✅ Lag features (1h, 24h, 168h)
- ✅ Rolling statistics (7-day windows)
- ✅ Parquet format for efficient storage

### Machine Learning
- ✅ Random Forest Regressor
- ✅ Hyperparameter optimization
- ✅ Cross-validation
- ✅ Feature importance analysis
- ✅ Model versioning

### Deployment
- ✅ Scalable SageMaker endpoints
- ✅ Lambda function for serverless inference
- ✅ API Gateway with CORS support
- ✅ Automated deployment scripts

### Web Interface
- ✅ Modern Next.js 14 application
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Real-time predictions
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive design

### Analytics
- ✅ Interactive Plotly dashboards
- ✅ Time series visualization
- ✅ Hourly/daily/monthly patterns
- ✅ Weekend vs weekday analysis
- ✅ Distribution analysis

## 📁 Project Structure

```
House-Energy/
│
├── sagemaker_scripts/          # SageMaker training & inference
│   ├── training.py            # Training script
│   └── inference.py           # Inference script
│
├── energy-forecast-app/       # Next.js web application
│   ├── app/
│   │   ├── api/
│   │   │   └── predict/
│   │   │       └── route.ts   # API route handler
│   │   ├── page.tsx           # Main UI page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.local             # Environment variables
│
├── train.ipynb                # Training orchestration notebook
├── interactive_dashboard.ipynb # Data visualization notebook
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🚀 Setup & Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- AWS Account with configured credentials
- AWS CLI installed and configured

### 1. Clone Repository

```bash
git clone https://github.com/Krishnadev-cmd/House-Energy.git
cd House-Energy
```

### 2. Python Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. AWS Configuration

```bash
# Configure AWS credentials
aws configure

# Create S3 buckets
aws s3 mb s3://energy-forecast-processed-<your-name>
aws s3 mb s3://energy-forecast-models-<your-name>
```

### 4. Next.js Application Setup

```bash
cd energy-forecast-app

# Install dependencies
npm install

# Configure environment variables
# Edit .env.local with your API Gateway URL
nano .env.local
```

## 💻 Usage

### Training the Model

1. **Open Training Notebook**
   ```bash
   jupyter notebook train.ipynb
   ```

2. **Configure Settings**
   - Update S3 bucket names
   - Update IAM role ARN
   - Adjust hyperparameters if needed

3. **Run Training Job**
   - Execute cells sequentially
   - Monitor training progress in SageMaker console

4. **Deploy Endpoint**
   - Run deployment cells
   - Note the endpoint name for Lambda configuration

### Running the Web Application

```bash
cd energy-forecast-app

# Development mode
npm run dev

# Production build
npm run build
npm start
```

Access the application at `http://localhost:3000`

### Using the API Directly

```bash
# Test Lambda function
curl -X POST https://your-api-gateway-url/prod/predict \
  -H "Content-Type: application/json" \
  -d '{
    "hour": 14,
    "day_of_week": 3,
    "day": 15,
    "month": 6,
    "is_weekend": 0,
    "max_power": 3.5,
    "min_power": 1.2,
    "std_power": 0.8,
    "avg_voltage": 240.5,
    "power_lag_1h": 2.1,
    "power_lag_24h": 2.3,
    "power_lag_168h": 2.0,
    "power_rolling_mean_7d": 2.2,
    "power_rolling_std_7d": 0.7
  }'
```

## 🎓 Model Training

### Features Used

| Feature | Description | Type |
|---------|-------------|------|
| `hour` | Hour of day (0-23) | Temporal |
| `day_of_week` | Day of week (0-6) | Temporal |
| `day` | Day of month (1-31) | Temporal |
| `month` | Month of year (1-12) | Temporal |
| `is_weekend` | Weekend indicator (0/1) | Categorical |
| `max_power` | Maximum power in period | Statistical |
| `min_power` | Minimum power in period | Statistical |
| `std_power` | Standard deviation of power | Statistical |
| `avg_voltage` | Average voltage | Statistical |
| `power_lag_1h` | Power 1 hour ago | Lag Feature |
| `power_lag_24h` | Power 24 hours ago | Lag Feature |
| `power_lag_168h` | Power 1 week ago | Lag Feature |
| `power_rolling_mean_7d` | 7-day rolling average | Rolling Feature |
| `power_rolling_std_7d` | 7-day rolling std dev | Rolling Feature |

### Model Hyperparameters

```python
RandomForestRegressor(
    n_estimators=100,
    max_depth=20,
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=42,
    n_jobs=-1
)
```

### Evaluation Metrics

- **RMSE** (Root Mean Squared Error)
- **MAE** (Mean Absolute Error)
- **R² Score**

## 🌐 Deployment

### AWS Lambda Configuration

1. **Create Lambda Function**
   - Runtime: Python 3.11
   - Memory: 512 MB
   - Timeout: 30 seconds

2. **Environment Variables**
   - `ENDPOINT_NAME`: Your SageMaker endpoint name

3. **IAM Role Permissions**
   - `sagemaker:InvokeEndpoint`

### API Gateway Setup

1. **Create REST API**
2. **Create POST method** for prediction
3. **Enable CORS**
   - Access-Control-Allow-Origin: *
   - Access-Control-Allow-Methods: POST, OPTIONS
   - Access-Control-Allow-Headers: Content-Type

4. **Deploy to Stage** (e.g., `prod`)

### Next.js Deployment Options

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd energy-forecast-app
vercel

# Add environment variables in Vercel dashboard
```

#### Option 2: AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

## 🎨 Web Application

### Features

- **Interactive Form**: 14 input fields organized in logical sections
- **Real-time Validation**: Client-side form validation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Tailwind CSS with gradient backgrounds

### Screenshots

```
┌──────────────────────────────────────────┐
│  ⚡ Energy Consumption Predictor        │
├──────────────────┬───────────────────────┤
│  Input Features  │  Prediction Results   │
│                  │                       │
│  [Time Features] │  [Loading Spinner]    │
│  [Power Stats]   │    or                 │
│  [Historical]    │  [Predicted Value]    │
│                  │  [Response Details]   │
│  [Predict Button]│  [Raw JSON]           │
└──────────────────┴───────────────────────┘
```

## 🛠️ Technologies Used

### Backend
- **AWS SageMaker** - Model training and deployment
- **AWS Lambda** - Serverless compute
- **AWS API Gateway** - REST API
- **AWS S3** - Data storage
- **AWS Glue** - ETL pipeline

### Machine Learning
- **Scikit-learn** - Random Forest model
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Joblib** - Model serialization

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Plotly** - Data visualization

### DevOps
- **Git/GitHub** - Version control
- **Jupyter Notebooks** - Development environment

## 📊 Results

### Model Performance

```
Training Metrics:
  - RMSE: 0.XXX kW
  - MAE: 0.XXX kW
  - R²: 0.XXX

Test Metrics:
  - RMSE: 0.XXX kW
  - MAE: 0.XXX kW
  - R²: 0.XXX
```

### Feature Importance

Top 5 most important features:
1. `power_lag_1h` - Previous hour's consumption
2. `power_rolling_mean_7d` - Weekly average pattern
3. `hour` - Time of day effect
4. `power_lag_24h` - Same time yesterday
5. `max_power` - Peak consumption indicator

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Krishnadev**
- GitHub: [@Krishnadev-cmd](https://github.com/Krishnadev-cmd)
- Repository: [House-Energy](https://github.com/Krishnadev-cmd/House-Energy)

## 🙏 Acknowledgments

- Dataset: UCI Machine Learning Repository - Individual Household Electric Power Consumption
- AWS Documentation for SageMaker best practices
- Next.js team for excellent documentation

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**⭐ Star this repository if you find it helpful!**
