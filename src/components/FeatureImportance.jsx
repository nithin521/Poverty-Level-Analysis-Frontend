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
  PieChart,
  Pie,
  Legend,
} from "recharts";
import globalShapDataRegression from "../data/global_importancer.json";
import globalShapDataClassification from "../data/global_importancec.json";

const FeatureImportance = ({
  formData,
  prediction,
  modelType = "regression",
}) => {
  const [explanationData, setExplanationData] = useState(null);
  const [selectedView, setSelectedView] = useState("local"); // 'global' or 'local'
  const [selectedGlobalType, setSelectedGlobalType] = useState("regression"); // 'regression' or 'classification'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prediction?.explanation) {
      const localShapValues = {};
      prediction.explanation.forEach((item) => {
        localShapValues[item.feature] = {
          importance: item.importance,
          impact: item.impact,
          description: item.description,
          shapValue:
            item.impact === "positive" ? item.importance : -item.importance,
          contribution: item.impact === "positive" ? "increases" : "decreases",
          magnitude: item.importance,
        };
      });

      // Load both global importance datasets
      const globalImportanceRegression = {};
      globalShapDataRegression.forEach((item) => {
        globalImportanceRegression[item.feature] = {
          importance: item.importance,
          impact: item.impact,
          description: item.description,
        };
      });

      const globalImportanceClassification = {};
      globalShapDataClassification.forEach((item) => {
        globalImportanceClassification[item.feature] = {
          importance: item.importance,
          impact: item.impact,
          description: item.description,
        };
      });

      setExplanationData({
        globalImportanceRegression,
        globalImportanceClassification,
        localShapValues,
      });
      setLoading(false);
    }
  }, [prediction]);

  if (loading) {
    return (
      <div className="feature-importance">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Analyzing feature importance...</p>
        </div>
      </div>
    );
  }

  if (!explanationData) return null;

  // Get current global importance data based on selected type
  const currentGlobalImportance =
    selectedGlobalType === "regression"
      ? explanationData.globalImportanceRegression
      : explanationData.globalImportanceClassification;

  // Prepare data for global importance chart
  const globalChartData = Object.entries(currentGlobalImportance)
    .map(([feature, data]) => ({
      feature: feature
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      importance: data.importance,
      impact: data.impact,
      description: data.description,
    }))
    .sort((a, b) => b.importance - a.importance);

  // Prepare data for local SHAP chart
  const localChartData = Object.entries(explanationData.localShapValues)
    .map(([feature, data]) => ({
      feature: feature
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      shapValue: data.shapValue,
      contribution: data.contribution,
      magnitude: data.magnitude,
      impact: data.impact,
    }))
    .sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  // Prepare pie chart data for impact distribution
  const impactDistribution = [
    {
      name: "Positive Factors",
      value: localChartData
        .filter((d) => d.shapValue > 0)
        .reduce((sum, d) => sum + d.magnitude, 0),
      fill: "#ef4444",
    },
    {
      name: "Negative Factors",
      value: localChartData
        .filter((d) => d.shapValue < 0)
        .reduce((sum, d) => sum + d.magnitude, 0),
      fill: "#10b981",
    },
  ];

  return (
    <div className="feature-importance">
      <div className="xai-header">
        <h3>🧠 Feature Importance & Explainability (XAI)</h3>
        <p>Understanding which factors drive poverty predictions</p>
      </div>

      <div className="view-selector">
        <button
          className={`view-btn ${selectedView === "global" ? "active" : ""}`}
          onClick={() => setSelectedView("global")}
        >
          🌍 Global Importance
        </button>
        <button
          className={`view-btn ${selectedView === "local" ? "active" : ""}`}
          onClick={() => setSelectedView("local")}
        >
          🎯 Local SHAP Values
        </button>
      </div>

      {selectedView === "global" && (
        <div className="global-importance">
          <div className="explanation-section">
            <div className="global-header">
              <h4>📊 Global Feature Importance</h4>
              <div className="model-type-selector">
                <button
                  className={`model-btn ${
                    selectedGlobalType === "regression" ? "active" : ""
                  }`}
                  onClick={() => setSelectedGlobalType("regression")}
                >
                  📈 Regression Model
                </button>
                <button
                  className={`model-btn ${
                    selectedGlobalType === "classification" ? "active" : ""
                  }`}
                  onClick={() => setSelectedGlobalType("classification")}
                >
                  🎯 Classification Model
                </button>
              </div>
            </div>

            <p>
              Shows the overall importance of each feature across all
              predictions in the <strong>{selectedGlobalType}</strong> model
            </p>

            <div className="model-description">
              {selectedGlobalType === "regression" ? (
                <div className="model-info regression">
                  <h5>🔢 Regression Model Analysis</h5>
                  <p>
                    This model predicts continuous MPI (Multidimensional Poverty
                    Index) values, showing the degree of poverty as a numerical
                    score between 0 and 1.
                  </p>
                </div>
              ) : (
                <div className="model-info classification">
                  <h5>🎯 Classification Model Analysis</h5>
                  <p>
                    This model predicts discrete poverty categories (e.g.,
                    Poor/Non-Poor), providing binary or categorical
                    classifications of poverty status.
                  </p>
                </div>
              )}
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={globalChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="feature"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${(value * 100).toFixed(1)}%`,
                      "Importance",
                    ]}
                    labelFormatter={(label) => `Feature: ${label}`}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-label">{label}</p>
                            <p className="tooltip-importance">
                              Importance: {(data.importance * 100).toFixed(1)}%
                            </p>

                            <p className="tooltip-description">
                              {data.description}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="importance" radius={[4, 4, 0, 0]}>
                    {globalChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          selectedGlobalType === "regression"
                            ? entry.impact === "positive"
                              ? "#ef4444"
                              : "#10b981"
                            : entry.impact === "positive"
                            ? "#f59e0b"
                            : "#3b82f6"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            
          </div>
        </div>
      )}

      {selectedView === "local" && (
        <div className="local-shap">
          <div className="explanation-section">
            <h4>🎯 Local SHAP Values for Current Input</h4>
            <p>
              Shows how each feature contributes to this specific prediction
              (Based on {modelType} model)
            </p>

            <div className="shap-summary">
              <div className="prediction-breakdown">
                <div className="base-prediction">
                  <span className="label">Base Prediction:</span>
                  <span className="value">
                    {modelType === "regression" ? "0.300" : "0.500"}
                  </span>
                </div>
                <div className="final-prediction">
                  <span className="label">Final Prediction:</span>
                  <span className="value">
                    {modelType === "regression"
                      ? `${prediction?.mpiHcr || "0.000"} MPI`
                      : `${prediction?.classification || "Non-Poor"}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-container">
                <h5>Feature Contributions (SHAP Values)</h5>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={localChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="feature"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="custom-tooltip">
                              <p className="tooltip-label">{label}</p>
                              <p className="tooltip-shap">
                                SHAP Value: {data.shapValue.toFixed(4)}
                              </p>
                              <p className="tooltip-contribution">
                                {data.contribution === "increases"
                                  ? "Increases"
                                  : "Decreases"}{" "}
                                {modelType === "regression"
                                  ? "poverty risk"
                                  : "poverty classification probability"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="shapValue" radius={[4, 4, 0, 0]}>
                      {localChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.shapValue > 0 ? "#ef4444" : "#10b981"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h5>Impact Distribution</h5>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={impactDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                    >
                      {impactDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        value.toFixed(4),
                        "Impact Magnitude",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="feature-explanations">
            <h5>📝 Detailed Feature Analysis</h5>
            <div className="explanations-grid">
              {localChartData.slice(0, 6).map((feature, index) => (
                <div
                  key={index}
                  className={`explanation-card ${feature.contribution}`}
                >
                  <div className="card-header">
                    <h6>{feature.feature}</h6>
                    <span className={`impact-badge ${feature.contribution}`}>
                      {feature.contribution === "increases" ? "↑" : "↓"}
                      {Math.abs(feature.shapValue).toFixed(4)}
                    </span>
                  </div>
                  <p className="card-description">
                    This feature <strong>{feature.contribution}</strong> the
                    {modelType === "regression"
                      ? " poverty prediction"
                      : " poverty classification probability"}{" "}
                    by <strong>{Math.abs(feature.shapValue).toFixed(4)}</strong>{" "}
                    points.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="interpretation-guide">
            <h5>🔍 How to Interpret SHAP Values</h5>
            <div className="guide-content">
              <div className="guide-item">
                <span className="guide-icon positive">+</span>
                <div className="guide-text">
                  <strong>Positive SHAP values</strong> push the prediction
                  towards{" "}
                  {modelType === "regression"
                    ? "higher poverty risk"
                    : "poverty classification"}
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon negative">-</span>
                <div className="guide-text">
                  <strong>Negative SHAP values</strong> push the prediction
                  towards{" "}
                  {modelType === "regression"
                    ? "lower poverty risk"
                    : "non-poverty classification"}
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon magnitude">|x|</span>
                <div className="guide-text">
                  <strong>Magnitude</strong> indicates how much influence each
                  feature has on the final prediction
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureImportance;
