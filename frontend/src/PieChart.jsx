// src/components/PieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({averageOfAverages}) => {
  const data = {
    labels: ["Completion", "Remaining"],
    datasets: [
      {
        label: "Completion",
        data: [averageOfAverages, 100-averageOfAverages],
        backgroundColor: ["#926bf4", "#d3fa60", "#fde047", "#34d399"],
        borderColor: ["#926bf4", "#d3fa60", "#fde047", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;