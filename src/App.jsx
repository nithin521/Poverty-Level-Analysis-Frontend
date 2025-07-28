import React, { useState } from "react";
import WhatIfAnalysis from "./components/WhatIfAnalysis";
import FeatureImportance from "./components/FeatureImportance";
import "./App.css";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    state: "UTTAR PRADESH",
    district: "Bahraich",
    area: "5237.0",
    households: "603754",
    totalPopulation: "3487731",
    totalMales: "1843884",
    totalFemales: "1643847",
    literatePopulation: "1398368",
    literateMales: "878285",
    literateFemales: "739956",
    illiteratePopulation: "2089363",
    maleIlliterates: "965599",
    femaleIlliterates: "1123764",
    totalWorkingPopulation: "1152160",
    totalWorkingMales: "895576",
    totalWorkingFemales: "256584",
    unemployedPopulation: "2335571",
    unemployedMales: "948308",
    unemployedFemales: "1387263",
    households1: "760262",
    ruralHouseholds: "698520",
    urbanHouseholds: "61742",
    householdsWithInternet: "2681",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(true);
  const [showXAI, setShowXAI] = useState(true);
  const [whatIfResults, setWhatIfResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form data submitted:", formData);
    try {
      const response = await axios.post(
        "https://nithin521-poverty-level.hf.space/predict",
        formData
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction(null);
    }
    setLoading(false);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   // Simulate API call to your model
  //   setTimeout(() => {
  //     // Mock prediction results - replace with actual API call
  //     const mockMpiHcr = (Math.random() * 0.6 + 0.1).toFixed(3);
  //     const mockPovertyLevel = parseFloat(mockMpiHcr) > 0.3 ? "High" : "Low";

  //     setPrediction({
  //       mpiHcr: mockMpiHcr,
  //       povertyLevel: mockPovertyLevel,
  //       confidence: (Math.random() * 0.2 + 0.8).toFixed(2),
  //     });
  //     setLoading(false);
  //   }, 2000);
  // };

  const resetForm = () => {
    setFormData({
      state: "",
      district: "",
      area: "",
      households: "",
      totalPopulation: "",
      totalMales: "",
      totalFemales: "",
      literatePopulation: "",
      literateMales: "",
      literateFemales: "",
      illiteratePopulation: "",
      maleIlliterates: "",
      femaleIlliterates: "",
      totalWorkingPopulation: "",
      totalWorkingMales: "",
      totalWorkingFemales: "",
      unemployedPopulation: "",
      unemployedMales: "",
      unemployedFemales: "",
      households1: "",
      ruralHouseholds: "",
      urbanHouseholds: "",
      householdsWithInternet: "",
    });
    setPrediction(null);
  };

  const handleWhatIfAnalysis = (results) => {
    setWhatIfResults(results);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Poverty Level Prediction System</h1>
          <p>Advanced demographic analysis for poverty assessment</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <form
            onSubmit={handleSubmit}
            className="prediction-form"
            method="POST"
          >
            {/* Location Information */}
            <div className="form-section">
              <h3>Location Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="district">District</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="area">Area (sq km)</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Population Demographics */}
            <div className="form-section">
              <h3>Population Demographics</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="households">Households</label>
                  <input
                    type="number"
                    id="households"
                    name="households"
                    value={formData.households}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalPopulation">Total Population</label>
                  <input
                    type="number"
                    id="totalPopulation"
                    name="totalPopulation"
                    value={formData.totalPopulation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalMales">Total Males</label>
                  <input
                    type="number"
                    id="totalMales"
                    name="totalMales"
                    value={formData.totalMales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalFemales">Total Females</label>
                  <input
                    type="number"
                    id="totalFemales"
                    name="totalFemales"
                    value={formData.totalFemales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Literacy Statistics */}
            <div className="form-section">
              <h3>Literacy Statistics</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="literatePopulation">
                    Literate Population
                  </label>
                  <input
                    type="number"
                    id="literatePopulation"
                    name="literatePopulation"
                    value={formData.literatePopulation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="literateMales">Literate Males</label>
                  <input
                    type="number"
                    id="literateMales"
                    name="literateMales"
                    value={formData.literateMales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="literateFemales">Literate Females</label>
                  <input
                    type="number"
                    id="literateFemales"
                    name="literateFemales"
                    value={formData.literateFemales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="illiteratePopulation">
                    Illiterate Population
                  </label>
                  <input
                    type="number"
                    id="illiteratePopulation"
                    name="illiteratePopulation"
                    value={formData.illiteratePopulation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maleIlliterates">Male Illiterates</label>
                  <input
                    type="number"
                    id="maleIlliterates"
                    name="maleIlliterates"
                    value={formData.maleIlliterates}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="femaleIlliterates">Female Illiterates</label>
                  <input
                    type="number"
                    id="femaleIlliterates"
                    name="femaleIlliterates"
                    value={formData.femaleIlliterates}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Employment Statistics */}
            <div className="form-section">
              <h3>Employment Statistics</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="totalWorkingPopulation">
                    Total Working Population
                  </label>
                  <input
                    type="number"
                    id="totalWorkingPopulation"
                    name="totalWorkingPopulation"
                    value={formData.totalWorkingPopulation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalWorkingMales">Total Working Males</label>
                  <input
                    type="number"
                    id="totalWorkingMales"
                    name="totalWorkingMales"
                    value={formData.totalWorkingMales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalWorkingFemales">
                    Total Working Females
                  </label>
                  <input
                    type="number"
                    id="totalWorkingFemales"
                    name="totalWorkingFemales"
                    value={formData.totalWorkingFemales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unemployedPopulation">
                    Unemployed Population
                  </label>
                  <input
                    type="number"
                    id="unemployedPopulation"
                    name="unemployedPopulation"
                    value={formData.unemployedPopulation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unemployedMales">Unemployed Males</label>
                  <input
                    type="number"
                    id="unemployedMales"
                    name="unemployedMales"
                    value={formData.unemployedMales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="unemployedFemales">Unemployed Females</label>
                  <input
                    type="number"
                    id="unemployedFemales"
                    name="unemployedFemales"
                    value={formData.unemployedFemales}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Household Types */}
            <div className="form-section">
              <h3>Household Types</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="households1">Households (Secondary)</label>
                  <input
                    type="number"
                    id="households1"
                    name="households1"
                    value={formData.households1}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ruralHouseholds">Rural Households</label>
                  <input
                    type="number"
                    id="ruralHouseholds"
                    name="ruralHouseholds"
                    value={formData.ruralHouseholds}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="urbanHouseholds">Urban Households</label>
                  <input
                    type="number"
                    id="urbanHouseholds"
                    name="urbanHouseholds"
                    value={formData.urbanHouseholds}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="householdsWithInternet">
                    Households with Internet
                  </label>
                  <input
                    type="number"
                    id="householdsWithInternet"
                    name="householdsWithInternet"
                    value={formData.householdsWithInternet}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Analyzing..." : "Predict Poverty Level"}
              </button>
            </div>
            {prediction && (
              <div className="analysis-buttons">
                <button
                  type="button"
                  onClick={() => setShowWhatIf(!showWhatIf)}
                  className="btn btn-analysis"
                >
                  {showWhatIf ? "📊 Hide Analysis" : "🔧 What-If Analysis"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowXAI(!showXAI)}
                  className="btn btn-xai"
                >
                  {showXAI ? "🧠 Hide XAI" : "🧠 Feature Importance"}
                </button>
              </div>
            )}
          </form>

          {prediction && (
            <div className="results-section">
              <h3>Prediction Results</h3>
              <div className="results-grid">
                <div className="result-card">
                  <div className="result-label">MPI HCR (Regression)</div>
                  <div className="result-value">{prediction.mpiHcr}</div>
                  <div className="result-description">
                    Multidimensional Poverty Index Headcount Ratio
                  </div>
                </div>
                <div className="result-card">
                  <div className="result-label">
                    Poverty Level (Classification)
                  </div>
                  <div
                    className={`result-value ${prediction.povertyLevel.toLowerCase()}-poverty`}
                  >
                    {prediction.povertyLevel}
                  </div>
                  <div className="result-description">
                    Classification based on demographic analysis
                  </div>
                </div>
                {/* <div className="result-card">
                  <div className="result-label">Model Confidence</div>
                  <div className="result-value">
                  {(prediction.confidence * 100).toFixed(0)}%
                  </div>
                  <div className="result-description">
                  Prediction reliability score
                  </div>
                  </div> */}
              </div>
            </div>
          )}

          {showXAI && prediction && (
            <FeatureImportance formData={formData} prediction={prediction} />
          )}
          {showWhatIf && (
            <WhatIfAnalysis
              originalData={formData}
              onAnalysisChange={handleWhatIfAnalysis}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
