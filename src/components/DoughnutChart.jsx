import * as React from "react";

import "hammerjs";
import Chart from "react-google-charts";

export function DoughnutChart({ data, title }) {
  return (
    <Chart
      width={"800px"}
      height={"300px"}
      chartType="PieChart"
      style={{ backgroundColor: "rgba(0,0,0,0)", flex: 1 }}
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
        backgroundColor: "transparent",
        title: title,
        legend: { textStyle: { color: "Black" } },
        pieSliceText: "value",
        slices: {
          0: { offset: 0.05 },
          1: { offset: 0.2 },
          2: { offset: 0.1 },
          3: { offset: 0.2 },
        },
      }}
      rootProps={{ "data-testid": "5" }}
    />
  );
}
