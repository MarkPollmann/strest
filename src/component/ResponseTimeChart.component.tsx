import React from "react";
import { Line } from "react-chartjs-2";

interface IProps {
  responses: any[];
}

export function ResponseTimeChart(props: IProps) {
  function generateChartData(canvas: any) {
    let ctx = canvas.getContext("2d");

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(246, 36, 89, 0.7)");
    gradient.addColorStop(1, "rgba(30, 139, 195, 0.7)");

    let data = {
      labels: props.responses.map((_, idx) => idx + 1),
      datasets: [
        {
          label: "Response Time",
          backgroundColor: gradient,
          data: props.responses.map(r => r.time)
        }
      ]
    };

    return data;
  }

  return (
    <Line
      options={{
        responsive: true
      }}
      data={generateChartData}
    />
  );
}
