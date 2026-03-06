import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ data }) => {
  // Fallback data if chartData is undefined
//   const data = chartData || {
//     labels: ["January", "February", "March", "April", "May", "June", "July"],
//     datasets: [
//       {
//         label: "Monthly Sales",
//         data: [65, 59, 80, 81, 56, 55, 40],
//         backgroundColor: "#3b82f6", // Tailwind blue-500
//       },
//     ],
//   };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Average Performance By District</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;