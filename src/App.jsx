import React, { useState } from "react";
import WhatIfAnalysis from "./components/WhatIfAnalysis";
import FeatureImportance from "./components/FeatureImportance";
import "./App.css";
import axios from "axios";

function App() {
  // Empty initial form data
  const [formData, setFormData] = useState({
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

  // Test cases data
  const testCases = {
    "": {
      label: "Select a test case...",
      data: {
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
      },
    },
    uttar_pradesh_bahraich: {
      label: "Uttar Pradesh - Bahraich (High Poverty)",
      data: {
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
      },
    },
    maharashtra_mumbai: {
      label: "Maharashtra - Mumbai (Low Poverty)",
      data: {
        state: "MAHARASHTRA",
        district: "Mumbai",
        area: "603.4",
        households: "3142696",
        totalPopulation: "12442373",
        totalMales: "6887767",
        totalFemales: "5554606",
        literatePopulation: "10893586",
        literateMales: "6127431",
        literateFemales: "4766155",
        illiteratePopulation: "1548787",
        maleIlliterates: "760336",
        femaleIlliterates: "788451",
        totalWorkingPopulation: "5247823",
        totalWorkingMales: "3654398",
        totalWorkingFemales: "1593425",
        unemployedPopulation: "7194550",
        unemployedMales: "3233369",
        unemployedFemales: "3961181",
        households1: "3142696",
        ruralHouseholds: "15432",
        urbanHouseholds: "3127264",
        householdsWithInternet: "1876542",
      },
    },
    bihar_gaya: {
      label: "Bihar - Gaya (Medium-High Poverty)",
      data: {
        state: "BIHAR",
        district: "Gaya",
        area: "4976.0",
        households: "871254",
        totalPopulation: "4391418",
        totalMales: "2324587",
        totalFemales: "2066831",
        literatePopulation: "2198435",
        literateMales: "1365728",
        literateFemales: "832707",
        illiteratePopulation: "2192983",
        maleIlliterates: "958859",
        femaleIlliterates: "1234124",
        totalWorkingPopulation: "1653892",
        totalWorkingMales: "1289765",
        totalWorkingFemales: "364127",
        unemployedPopulation: "2737526",
        unemployedMales: "1034822",
        unemployedFemales: "1702704",
        households1: "871254",
        ruralHouseholds: "789342",
        urbanHouseholds: "81912",
        householdsWithInternet: "12453",
      },
    },
    kerala_thiruvananthapuram: {
      label: "Kerala - Thiruvananthapuram (Low-Medium Poverty)",
      data: {
        state: "KERALA",
        district: "Thiruvananthapuram",
        area: "2192.0",
        households: "826234",
        totalPopulation: "3301427",
        totalMales: "1582036",
        totalFemales: "1719391",
        literatePopulation: "2975632",
        literateMales: "1465789",
        literateFemales: "1509843",
        illiteratePopulation: "325795",
        maleIlliterates: "116247",
        femaleIlliterates: "209548",
        totalWorkingPopulation: "1287654",
        totalWorkingMales: "743896",
        totalWorkingFemales: "543758",
        unemployedPopulation: "2013773",
        unemployedMales: "838140",
        unemployedFemales: "1175633",
        households1: "826234",
        ruralHouseholds: "456789",
        urbanHouseholds: "369445",
        householdsWithInternet: "234567",
      },
    },
    rajasthan_jaisalmer: {
      label: "Rajasthan - Jaisalmer (Medium Poverty)",
      data: {
        state: "RAJASTHAN",
        district: "Jaisalmer",
        area: "38401.0",
        households: "144523",
        totalPopulation: "669919",
        totalMales: "362738",
        totalFemales: "307181",
        literatePopulation: "387654",
        literateMales: "243821",
        literateFemales: "143833",
        illiteratePopulation: "282265",
        maleIlliterates: "118917",
        femaleIlliterates: "163348",
        totalWorkingPopulation: "298765",
        totalWorkingMales: "234567",
        totalWorkingFemales: "64198",
        unemployedPopulation: "371154",
        unemployedMales: "128171",
        unemployedFemales: "242983",
        households1: "144523",
        ruralHouseholds: "98765",
        urbanHouseholds: "45758",
        householdsWithInternet: "8934",
      },
    },
  };

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(true);
  const [showXAI, setShowXAI] = useState(true);
  const [whatIfResults, setWhatIfResults] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestCaseChange = (e) => {
    const selectedCase = e.target.value;
    setSelectedTestCase(selectedCase);

    if (selectedCase && testCases[selectedCase]) {
      setFormData(testCases[selectedCase].data);
      // Clear previous prediction when switching test cases
      setPrediction(null);
      setWhatIfResults(null);
    }
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
    setSelectedTestCase("");
    setWhatIfResults(null);
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
            {/* Test Cases Section */}
            <div className="form-section">
              <h3>🧪 Test Cases</h3>
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="testCase">Load Sample Data</label>
                  <select
                    id="testCase"
                    name="testCase"
                    value={selectedTestCase}
                    onChange={handleTestCaseChange}
                    className="test-case-select"
                  >
                    {Object.entries(testCases).map(([key, testCase]) => (
                      <option key={key} value={key}>
                        {testCase.label}
                      </option>
                    ))}
                  </select>
                  <small className="form-help">
                    Select a pre-configured test case to auto-fill the form with
                    sample data
                  </small>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="form-section">
              <h3>📍 Location Information</h3>
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
              <h3>👥 Population Demographics</h3>
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
              <h3>📚 Literacy Statistics</h3>
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
              <h3>💼 Employment Statistics</h3>
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
              <h3>🏠 Household Types</h3>
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
                🔄 Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "🔄 Analyzing..." : "🔍 Predict Poverty Level"}
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
              <h3>📈 Prediction Results</h3>
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
              </div>
            </div>
          )}

          {showXAI && prediction && (
            <FeatureImportance formData={formData} prediction={prediction} />
          )}
          {prediction && showWhatIf && (
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
