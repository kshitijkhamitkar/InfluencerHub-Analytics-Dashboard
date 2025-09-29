import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Demographics = ({ demographics }) => {
  // Handle missing data safely
  if (!demographics) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666",
        }}
      >
        <h3>No demographics data available</h3>
        <p>Demographics information is not available for this influencer.</p>
      </div>
    );
  }

  // -------------------------
  // Gender Distribution Chart
  // -------------------------
  const genderData = {
    labels: ["Female", "Male", "Other"],
    datasets: [
      {
        data: [
          demographics.gender?.female || 0,
          demographics.gender?.male || 0,
          demographics.gender?.other || 0,
        ],
        backgroundColor: ["#ff6b9d", "#4facfe", "#f093fb"],
        borderWidth: 0,
      },
    ],
  };

  // ---------------------
  // Age Groups Chart Data
  // ---------------------
  const ageGroupsData = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
    datasets: [
      {
        label: "Percentage",
        data: [
          demographics.ageGroups?.["18-24"] || 0,
          demographics.ageGroups?.["25-34"] || 0,
          demographics.ageGroups?.["35-44"] || 0,
          demographics.ageGroups?.["45-54"] || 0,
          demographics.ageGroups?.["55+"] || 0,
        ],
        backgroundColor: "rgba(102, 126, 234, 0.6)",
        borderColor: "rgba(102, 126, 234, 1)",
        borderWidth: 1,
      },
    ],
  };

  // -----------------------
  // Geography Distribution
  // -----------------------
  const sortedGeography = demographics.geography
    ? [...demographics.geography].sort(
        (a, b) => b.percentage - a.percentage
      )
    : [];

  const geographyData = {
    labels: sortedGeography.slice(0, 8).map((item) => item.country),
    datasets: [
      {
        data: sortedGeography.slice(0, 8).map((item) => item.percentage),
        backgroundColor: [
          "#667eea",
          "#764ba2",
          "#f093fb",
          "#f5576c",
          "#4facfe",
          "#00f2fe",
          "#a8edea",
          "#fed6e3",
        ],
        borderWidth: 0,
      },
    ],
  };

  // ----------------------
  // Chart Options
  // ----------------------
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  // ----------------------
  // Utility: Get Country Flag
  // ----------------------
  const getCountryFlag = (country) => {
    const flags = {
      "United States": "🇺🇸",
      Canada: "🇨🇦",
      "United Kingdom": "🇬🇧",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      France: "🇫🇷",
      India: "🇮🇳",
      Brazil: "🇧🇷",
      Japan: "🇯🇵",
      "South Korea": "🇰🇷",
    };
    return flags[country] || "🌍";
  };

  // ----------------------
  // Render Component
  // ----------------------
  return (
    <div>
      {/* Title */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ color: "#333" }}>👥 Audience Demographics</h2>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-item">
          <div className="stat-number">
            {demographics.gender?.female || 0}%
          </div>
          <div className="stat-label">Female Audience</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {demographics.gender?.male || 0}%
          </div>
          <div className="stat-label">Male Audience</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {Math.max(
              demographics.ageGroups?.["18-24"] || 0,
              demographics.ageGroups?.["25-34"] || 0,
              demographics.ageGroups?.["35-44"] || 0,
              demographics.ageGroups?.["45-54"] || 0,
              demographics.ageGroups?.["55+"] || 0
            )}
            %
          </div>
          <div className="stat-label">Dominant Age Group</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {sortedGeography[0]?.percentage || 0}%
          </div>
          <div className="stat-label">Top Country</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {/* Gender Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">👫 Gender Distribution</h3>
          <Doughnut data={genderData} options={doughnutOptions} />
        </div>

        {/* Age Groups */}
        <div className="chart-container">
          <h3 className="chart-title">🎂 Age Groups Distribution</h3>
          <Bar data={ageGroupsData} options={chartOptions} />
        </div>

        {/* Geographic Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">🌍 Geographic Distribution</h3>
          <Doughnut data={geographyData} options={doughnutOptions} />
        </div>
      </div>

      {/* Detailed Demographics */}
      <div className="demographics-section">
        {/* Gender Breakdown */}
        <div className="demographic-card">
          <h3 className="demographic-title">👫 Gender Breakdown</h3>
          {["female", "male", "other"].map((key) => (
            <div key={key} className="demographic-item">
              <span>
                {key === "female" ? "👩 Female" : key === "male" ? "👨 Male" : "⚧️ Other"}
              </span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{ marginRight: "0.5rem", fontSize: "0.9rem" }}
                >
                  {demographics.gender?.[key] || 0}%
                </span>
                <div className="demographic-bar">
                  <div
                    className="demographic-fill"
                    style={{
                      width: `${demographics.gender?.[key] || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Age Groups Breakdown */}
        <div className="demographic-card">
          <h3 className="demographic-title">🎂 Age Distribution</h3>
          {Object.entries(demographics.ageGroups || {}).map(
            ([ageGroup, percentage]) => (
              <div key={ageGroup} className="demographic-item">
                <span>{ageGroup} years</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{ marginRight: "0.5rem", fontSize: "0.9rem" }}
                  >
                    {percentage}%
                  </span>
                  <div className="demographic-bar">
                    <div
                      className="demographic-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Geographic Distribution */}
        <div className="demographic-card">
          <h3 className="demographic-title">🌍 Top Countries</h3>
          {sortedGeography.slice(0, 8).map((country, index) => (
            <div key={country.country + index} className="demographic-item">
              <span>
                {getCountryFlag(country.country)} {country.country}
              </span>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{ marginRight: "0.5rem", fontSize: "0.9rem" }}
                >
                  {country.percentage}%
                </span>
                <div className="demographic-bar">
                  <div
                    className="demographic-fill"
                    style={{
                      width: `${
                        (country.percentage /
                          (sortedGeography[0]?.percentage || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div
        className="card"
        style={{
          marginTop: "2rem",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "1rem",
          borderRadius: "12px",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>
          🔍 Demographics Insights
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>👥 Primary Audience</h4>
            <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>
              {demographics.gender?.female > demographics.gender?.male
                ? "Female"
                : "Male"}
              -dominated audience (
              {Math.max(
                demographics.gender?.female || 0,
                demographics.gender?.male || 0
              )}
              %)
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>🎯 Target Demo</h4>
            <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>
              Strong presence in {sortedGeography[0]?.country || "multiple countries"} (
              {sortedGeography[0]?.percentage || 0}% of audience)
            </p>
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>📊 Audience Reach</h4>
            <p style={{ fontSize: "0.9rem", opacity: "0.9" }}>
              Global reach across {sortedGeography.length} countries with diverse age distribution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
