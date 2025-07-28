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

const FeatureImportance = ({ formData, prediction }) => {
  const [explanationData, setExplanationData] = useState(null);
  const [selectedView, setSelectedView] = useState("global"); // 'global' or 'local'
  const [loading, setLoading] = useState(true);

  // Mock SHAP-style feature importance calculation
  // const calculateFeatureImportance = () => {
  //   // Global feature importance (based on typical poverty prediction models)
  //   const globalImportance = {
  //     literatePopulation: { importance: 0.18, impact: 'negative', description: 'Higher literacy reduces poverty' },
  //     totalWorkingPopulation: { importance: 0.16, impact: 'negative', description: 'More employment reduces poverty' },
  //     householdsWithInternet: { importance: 0.14, impact: 'negative', description: 'Digital access reduces poverty' },
  //     unemployedPopulation: { importance: 0.13, impact: 'positive', description: 'Higher unemployment increases poverty' },
  //     st: { importance: 0.11, impact: 'positive', description: 'ST population correlation with poverty' },
  //     sc: { importance: 0.10, impact: 'positive', description: 'SC population correlation with poverty' },
  //     ruralHouseholds: { importance: 0.08, impact: 'positive', description: 'Rural areas tend to have higher poverty' },
  //     urbanHouseholds: { importance: 0.06, impact: 'negative', description: 'Urban areas tend to have lower poverty' },
  //     illiteratePopulation: { importance: 0.04, impact: 'positive', description: 'Higher illiteracy increases poverty' }
  //   };

  //   // Calculate local SHAP values based on input data
  //   const totalPop = parseInt(formData.totalPopulation) || 1;
  //   const localShapValues = {};

  //   Object.keys(globalImportance).forEach(feature => {
  //     const value = parseInt(formData[feature]) || 0;
  //     const ratio = value / totalPop;
  //     const baseImportance = globalImportance[feature].importance;

  //     // Simulate SHAP value calculation
  //     let shapValue = baseImportance * (ratio - 0.5) * 2; // Normalized around 0.5
  //     if (globalImportance[feature].impact === 'positive') {
  //       shapValue = -shapValue; // Flip for positive impact features
  //     }

  //     localShapValues[feature] = {
  //       ...globalImportance[feature],
  //       shapValue: shapValue,
  //       contribution: shapValue > 0 ? 'increases' : 'decreases',
  //       magnitude: Math.abs(shapValue)
  //     };
  //   });

  //   return { globalImportance, localShapValues };
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   // Simulate API call delay
  //   setTimeout(() => {
  //     const explanation = calculateFeatureImportance();
  //     setExplanationData(explanation);
  //     setLoading(false);
  //   }, 1000);
  // }, [formData]);
  useEffect(() => {
    if (prediction && prediction.explanation) {
      const explanation = prediction.explanation;

      const localShapValues = {};
      explanation.forEach((item) => {
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

      // If you want to preserve global importance too:
      const globalImportance = explanation.reduce((acc, item) => {
        acc[item.feature] = {
          importance: item.importance,
          impact: item.impact,
          description: item.description,
        };
        return acc;
      }, {});

      setExplanationData({ globalImportance, localShapValues });
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

  // Prepare data for global importance chart
  const globalChartData = Object.entries(explanationData.globalImportance)
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
            <h4>📊 Global Feature Importance</h4>
            <p>
              Shows the overall importance of each feature across all
              predictions
            </p>

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
                          entry.impact === "positive" ? "#ef4444" : "#10b981"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="importance-legend">
              <div className="legend-item">
                <div className="legend-color positive"></div>
                <span>Increases Poverty Risk</span>
              </div>
              <div className="legend-item">
                <div className="legend-color negative"></div>
                <span>Decreases Poverty Risk</span>
              </div>
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
            </p>

            <div className="shap-summary">
              <div className="prediction-breakdown">
                <div className="base-prediction">
                  <span className="label">Base Prediction:</span>
                  <span className="value">0.300</span>
                </div>
                <div className="final-prediction">
                  <span className="label">Final Prediction:</span>
                  <span className="value">{prediction?.mpiHcr || "0.000"}</span>
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
                                poverty risk
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
                    poverty prediction by{" "}
                    <strong>{Math.abs(feature.shapValue).toFixed(4)}</strong>{" "}
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
                  towards higher poverty risk
                </div>
              </div>
              <div className="guide-item">
                <span className="guide-icon negative">-</span>
                <div className="guide-text">
                  <strong>Negative SHAP values</strong> push the prediction
                  towards lower poverty risk
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
