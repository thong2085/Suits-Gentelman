// components/RevenueChart.js
import React from "react";
import { Line } from "react-chartjs-2";

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Revenue",
        data: data.map((item) => item.revenue),
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return <Line data={chartData} />;
};

export default RevenueChart;
