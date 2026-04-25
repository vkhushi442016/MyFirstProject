import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

import React from 'react'

const DoughnutChart = ({value}) => {
    const data = {
    labels: ["Completion", "Remaining"],
    datasets: [
      {
        label: "Completion",
        data: [value, 100-value],
        backgroundColor: ["#926bf4", "#d3fa60", "#fde047", "#34d399"],
        borderColor: ["#926bf4", "#d3fa60", "#fde047", "#34d399"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
    <Doughnut data={data} />
    </div>
  )
}

export default DoughnutChart
