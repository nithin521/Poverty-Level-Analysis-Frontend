import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const WhatIfAnalysis = ({ originalData, onAnalysisChange }) => {
  const [adjustableFeatures, setAdjustableFeatures] = useState({
    literatePopulation: originalData.literatePopulation || 0,
    totalWorkingPopulation: originalData.totalWorkingPopulation || 0,
    householdsWithInternet: originalData.householdsWithInternet || 0,
    unemployedPopulation: originalData.unemployedPopulation || 0,
    ruralHouseholds: originalData.ruralHouseholds || 0,
    urbanHouseholds: originalData.urbanHouseholds || 0,
    st: originalData.st || 0,
    sc: originalData.sc || 0,
  });

  const [showComparison, setShowComparison] = useState(true);
  const [simulatedResults, setSimulatedResults] = useState(null);

  // Feature definitions with their impact weights and descriptions
  const featureDefinitions = {
    literatePopulation: {
      label: "Literate Population",
      description: "Number of literate people",
      impact: -0.3, // Negative impact on poverty
      min: 0,
      max: parseInt(originalData.totalPopulation) || 100000,
      step: 100,
    },
    totalWorkingPopulation: {
      label: "Working Population",
      description: "Number of employed people",
      impact: -0.25,
      min: 0,
      max: parseInt(originalData.totalPopulation) || 100000,
      step: 100,
    },
    householdsWithInternet: {
      label: "Households with Internet",
      description: "Digital connectivity access",
      impact: -0.2,
      min: 0,
      max: parseInt(originalData.households) || 10000,
      step: 10,
    },
    unemployedPopulation: {
      label: "Unemployed Population",
      description: "Number of unemployed people",
      impact: 0.3, // Positive impact on poverty
      min: 0,
      max: parseInt(originalData.totalPopulation) || 100000,
      step: 100,
    },
    ruralHouseholds: {
      label: "Rural Households",
      description: "Households in rural areas",
      impact: 0.15,
      min: 0,
      max: parseInt(originalData.households) || 10000,
      step: 10,
    },
    urbanHouseholds: {
      label: "Urban Households",
      description: "Households in urban areas",
      impact: -0.15,
      min: 0,
      max: parseInt(originalData.households) || 10000,
      step: 10,
    },
    st: {
      label: "Scheduled Tribes (ST)",
      description: "ST population count",
      impact: 0.2,
      min: 0,
      max: parseInt(originalData.totalPopulation) || 100000,
      step: 50,
    },
    sc: {
      label: "Scheduled Castes (SC)",
      description: "SC population count",
      impact: 0.18,
      min: 0,
      max: parseInt(originalData.totalPopulation) || 100000,
      step: 50,
    },
  };

  const calculateSimulatedResults = async () => {
    const mergedData = {
      ...originalData,
      ...adjustableFeatures,
    };

    try {
      // Fetch original if not already present
      const originalResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(originalData),
      });
      const originalResult = await originalResponse.json();

      // Fetch adjusted
      const adjustedResponse = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergedData),
      });
      const adjustedResult = await adjustedResponse.json();

      if (originalResponse.ok && adjustedResponse.ok) {
        const mpiChange = (
          parseFloat(adjustedResult.mpiHcr) - parseFloat(originalResult.mpiHcr)
        ).toFixed(3);

        const povertyChanged =
          adjustedResult.povertyLevel !== originalResult.povertyLevel;

        return {
          originalMpi: parseFloat(originalResult.mpiHcr).toFixed(3),
          newMpi: parseFloat(adjustedResult.mpiHcr).toFixed(3),
          mpiChange: mpiChange,
          originalPovertyLevel: originalResult.povertyLevel,
          newPovertyLevel: adjustedResult.povertyLevel,
          povertyChanged: povertyChanged,
          explanation: adjustedResult.explanation,
          confidence: adjustedResult.confidence,
        };
      } else {
        throw new Error("API error");
      }
    } catch (error) {
      console.error("Prediction error:", error);
      return {
        originalMpi: "N/A",
        newMpi: "N/A",
        mpiChange: "N/A",
        originalPovertyLevel: "N/A",
        newPovertyLevel: "N/A",
        povertyChanged: false,
        explanation: [],
        confidence: {},
      };
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      const results = await calculateSimulatedResults();
      setSimulatedResults(results);
      if (onAnalysisChange) {
        onAnalysisChange(results);
      }
    };

    fetchResults();
  }, [adjustableFeatures, originalData]);

  const handleFeatureChange = (feature, value) => {
    setAdjustableFeatures((prev) => ({
      ...prev,
      [feature]: value,
    }));
  };

  const resetToOriginal = () => {
    setAdjustableFeatures({
      literatePopulation: originalData.literatePopulation || 0,
      totalWorkingPopulation: originalData.totalWorkingPopulation || 0,
      householdsWithInternet: originalData.householdsWithInternet || 0,
      unemployedPopulation: originalData.unemployedPopulation || 0,
      ruralHouseholds: originalData.ruralHouseholds || 0,
      urbanHouseholds: originalData.urbanHouseholds || 0,
      st: originalData.st || 0,
      sc: originalData.sc || 0,
    });
  };

  const getChangeIndicator = (change) => {
    if (Math.abs(change) < 0.001) return "→";
    return change > 0 ? "↑" : "↓";
  };

  const getChangeColor = (change) => {
    if (Math.abs(change) < 0.001) return "#6b7280";
    return change > 0 ? "#ef4444" : "#10b981";
  };

  // Prepare chart data
  const chartData = simulatedResults
    ? [
        {
          name: "Original",
          MPI: parseFloat(simulatedResults.originalMpi),
          fill: "#8884d8",
        },
        {
          name: "Simulated",
          MPI: parseFloat(simulatedResults.newMpi),
          fill:
            parseFloat(simulatedResults.newMpi) <
            parseFloat(simulatedResults.originalMpi)
              ? "#10b981"
              : "#ef4444",
        },
      ]
    : [];

  return (
    <div className="what-if-analysis">
      <div className="analysis-header">
        <h3>🔧 What-If Policy Analysis</h3>
        <p>Simulate policy changes and see their impact on poverty levels</p>
      </div>

      <div className="analysis-content">
        <div className="controls-section">
          <div className="section-header">
            <h4>💡 Adjustable Policy Parameters</h4>
            <div className="comparison-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={showComparison}
                  onChange={(e) => setShowComparison(e.target.checked)}
                />
                Show comparison with original
              </label>
            </div>
          </div>

          <div className="feature-controls">
            {Object.entries(featureDefinitions).map(([key, definition]) => (
              <div key={key} className="feature-control">
                <div className="feature-header">
                  <label>{definition.label}</label>
                  <span className="feature-value">
                    {parseInt(adjustableFeatures[key]).toLocaleString()}
                    {showComparison && (
                      <span className="original-value">
                        (Original:{" "}
                        {parseInt(originalData[key] || 0).toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min={definition.min}
                  max={definition.max}
                  step={definition.step}
                  value={adjustableFeatures[key]}
                  onChange={(e) => handleFeatureChange(key, e.target.value)}
                  className="feature-slider"
                />
                <div className="feature-description">
                  {definition.description}
                </div>
              </div>
            ))}
          </div>

          <button onClick={resetToOriginal} className="reset-button">
            🔄 Reset to Original Values
          </button>
        </div>

        {simulatedResults && (
          <div className="results-section">
            <div className="visualization-section">
              <h4>📈 Impact Visualization</h4>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip
                      formatter={(value) => [value.toFixed(3), "MPI HCR"]}
                    />
                    <Bar dataKey="MPI" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="comparison-cards">
                <div className="comparison-card original">
                  <div className="card-header">Original Prediction</div>
                  <div className="mpi-value">
                    {simulatedResults.originalMpi}
                  </div>
                  <div
                    className={`poverty-level ${simulatedResults.originalPovertyLevel.toLowerCase()}`}
                  >
                    {simulatedResults.originalPovertyLevel} Poverty
                  </div>
                </div>

                <div className="change-indicator">
                  <div
                    className="arrow"
                    style={{
                      color: getChangeColor(simulatedResults.mpiChange),
                    }}
                  >
                    {getChangeIndicator(simulatedResults.mpiChange)}
                  </div>
                  <div
                    className="change-value"
                    style={{
                      color: getChangeColor(simulatedResults.mpiChange),
                    }}
                  >
                    {simulatedResults.mpiChange > 0 ? "+" : ""}
                    {simulatedResults.mpiChange}
                  </div>
                </div>

                <div className="comparison-card simulated">
                  <div className="card-header">Simulated Prediction</div>
                  <div className="mpi-value">{simulatedResults.newMpi}</div>
                  <div
                    className={`poverty-level ${simulatedResults.newPovertyLevel.toLowerCase()}`}
                  >
                    {simulatedResults.newPovertyLevel} Poverty
                    {simulatedResults.povertyChanged && (
                      <span className="changed-indicator">📌 Changed!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="impact-summary">
                <h5>📌 Policy Impact Summary</h5>
                <div className="summary-text">
                  {simulatedResults.mpiChange < -0.01 && (
                    <p className="positive-impact">
                      ✅ The simulated policy changes would{" "}
                      <strong>reduce poverty</strong> by{" "}
                      {Math.abs(simulatedResults.mpiChange)} MPI points.
                      {simulatedResults.povertyChanged &&
                        ` This changes the poverty classification from ${simulatedResults.originalPovertyLevel} to ${simulatedResults.newPovertyLevel}.`}
                    </p>
                  )}
                  {simulatedResults.mpiChange > 0.01 && (
                    <p className="negative-impact">
                      ⚠️ The simulated changes would{" "}
                      <strong>increase poverty</strong> by{" "}
                      {simulatedResults.mpiChange} MPI points.
                      {simulatedResults.povertyChanged &&
                        ` This changes the poverty classification from ${simulatedResults.originalPovertyLevel} to ${simulatedResults.newPovertyLevel}.`}
                    </p>
                  )}
                  {Math.abs(simulatedResults.mpiChange) <= 0.01 && (
                    <p className="neutral-impact">
                      → The simulated changes would have{" "}
                      <strong>minimal impact</strong> on poverty levels.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Responsive Design for What-If Analysis */
        @media (max-width: 1024px) {
          .analysis-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .comparison-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .change-indicator {
            order: -1;
            flex-direction: row;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .what-if-analysis {
            padding: 1.5rem;
          }

          .controls-section,
          .results-section {
            padding: 1rem;
          }

          .feature-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .chart-container {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WhatIfAnalysis;
