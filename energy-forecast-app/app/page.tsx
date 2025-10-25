'use client'

import { useState } from 'react'

interface PredictionData {
  hour: number
  day_of_week: number
  day: number
  month: number
  is_weekend: number
  max_power: number
  min_power: number
  std_power: number
  avg_voltage: number
  power_lag_1h: number
  power_lag_24h: number
  power_lag_168h: number
  power_rolling_mean_7d: number
  power_rolling_std_7d: number
}

export default function Home() {
  const [formData, setFormData] = useState<PredictionData>({
    hour: 14,
    day_of_week: 3,
    day: 15,
    month: 6,
    is_weekend: 0,
    max_power: 3.5,
    min_power: 1.2,
    std_power: 0.8,
    avg_voltage: 240.5,
    power_lag_1h: 2.1,
    power_lag_24h: 2.3,
    power_lag_168h: 2.0,
    power_rolling_mean_7d: 2.2,
    power_rolling_std_7d: 0.7
  })

  const [prediction, setPrediction] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData })
      })

      const result = await response.json()

      if (result.success) {
        setPrediction(result.prediction)
      } else {
        setError(result.error || 'Prediction failed')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ Energy Consumption Predictor
          </h1>
          <p className="text-gray-600">
            Enter features to predict energy consumption
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Input Features
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Time Features */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">Time Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hour (0-23)
                    </label>
                    <input
                      type="number"
                      name="hour"
                      value={formData.hour}
                      onChange={handleChange}
                      min="0"
                      max="23"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week (0-6)
                    </label>
                    <input
                      type="number"
                      name="day_of_week"
                      value={formData.day_of_week}
                      onChange={handleChange}
                      min="0"
                      max="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day (1-31)
                    </label>
                    <input
                      type="number"
                      name="day"
                      value={formData.day}
                      onChange={handleChange}
                      min="1"
                      max="31"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Month (1-12)
                    </label>
                    <input
                      type="number"
                      name="month"
                      value={formData.month}
                      onChange={handleChange}
                      min="1"
                      max="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Is Weekend
                    </label>
                    <select
                      name="is_weekend"
                      value={formData.is_weekend}
                      onChange={(e) => handleChange(e as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Power Statistics */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">Power Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Power (kW)
                    </label>
                    <input
                      type="number"
                      name="max_power"
                      value={formData.max_power}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Power (kW)
                    </label>
                    <input
                      type="number"
                      name="min_power"
                      value={formData.min_power}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Std Power (kW)
                    </label>
                    <input
                      type="number"
                      name="std_power"
                      value={formData.std_power}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avg Voltage (V)
                    </label>
                    <input
                      type="number"
                      name="avg_voltage"
                      value={formData.avg_voltage}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Lag Features */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">Historical Data</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Power Lag 1h (kW)
                    </label>
                    <input
                      type="number"
                      name="power_lag_1h"
                      value={formData.power_lag_1h}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Power Lag 24h (kW)
                    </label>
                    <input
                      type="number"
                      name="power_lag_24h"
                      value={formData.power_lag_24h}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Power Lag 168h (kW)
                    </label>
                    <input
                      type="number"
                      name="power_lag_168h"
                      value={formData.power_lag_168h}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rolling Mean 7d (kW)
                    </label>
                    <input
                      type="number"
                      name="power_rolling_mean_7d"
                      value={formData.power_rolling_mean_7d}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rolling Std 7d (kW)
                    </label>
                    <input
                      type="number"
                      name="power_rolling_std_7d"
                      value={formData.power_rolling_std_7d}
                      onChange={handleChange}
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Predicting...' : '🔮 Get Prediction'}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Prediction Results
            </h2>

            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">❌ Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {prediction && !loading && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                  <p className="text-sm font-medium opacity-90 mb-2">
                    Predicted Energy Consumption
                  </p>
                  <p className="text-5xl font-bold">
                    {prediction.predicted_power_kw?.toFixed(3) || 'N/A'}
                  </p>
                  <p className="text-sm opacity-90 mt-2">kilowatts (kW)</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-gray-700">Response Details</h3>
                  <div className="space-y-2 text-sm">
                    {prediction.timestamp && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="font-medium">{prediction.timestamp}</span>
                      </div>
                    )}
                    {prediction.message && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">{prediction.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Raw Response</h3>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(prediction, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {!prediction && !loading && !error && (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <p className="text-6xl mb-4">📊</p>
                  <p>Enter values and click predict to see results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}