import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { DesignFunction } from "../../commons/types";
import { useEvaluateFunctionMutation } from "../../store";
import FunctionsDisplayForGraph from "./FunctionsDisplayForGraph";

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export interface FunctionsGraphProps {
  functions: DesignFunction[];
  scopeByFunction: Record<number, Record<string, number>>;
}

// Define a type for chart dataset
interface ChartDataPoint {
  x: number;
  y: number;
}

interface ChartDataset {
  id?: number; // Add optional id property to identify datasets by function id
  label: string;
  data: ChartDataPoint[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  pointRadius: number;
  tension: number;
  spanGaps: boolean;
}

interface ChartData {
  datasets: ChartDataset[];
}

export interface FunctionWithAdditionalData extends DesignFunction {
  visible: boolean;
  color: string;
}

const FunctionsGraph = ({
  functions,
  scopeByFunction,
}: FunctionsGraphProps) => {
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200 + 55); // Avoid too dark colors
    const g = Math.floor(Math.random() * 200 + 55);
    const b = Math.floor(Math.random() * 200 + 55);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const [functionsWithAdditionalData, setFunctionsWithAdditionalData] =
    useState<FunctionWithAdditionalData[]>([
      ...functions.map((func) => ({
        ...func,
        visible: true,
        color: getRandomColor(),
      })),
    ]);
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [pointCount, setPointCount] = useState(200); // Reduced from 500 to improve performance
  const [chartData, setChartData] = useState<ChartData>({ datasets: [] });
  const [evaluateFunction] = useEvaluateFunctionMutation();

  // Chart options for function plotter
  const functionChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        position: "center",
        title: {
          display: true,
          text: "x",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        type: "linear",
        position: "center",
        title: {
          display: true,
          text: "y",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as { x: number; y: number };
            return `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`;
          },
        },
      },
    },
    animation: {
      duration: 0, // Disable animations for better performance
    },
  };

  // Generate chart data for function plotter
  const generateFunctionChartData = () => {
    // Generate x values
    const step = (xRange.max - xRange.min) / pointCount;
    const xValues = Array.from(
      { length: pointCount + 1 },
      (_, i) => xRange.min + i * step
    );

    // Get visible functions that have parameters in scopeByFunction
    const visibleFunctions = functionsWithAdditionalData.filter(
      (func) => func.visible
    );

    // Create datasets with placeholder data first
    const datasets = visibleFunctions.map((func) => {
      const borderColor = func.color;
      // Use placeholder data initially (all zeros)
      const placeholderData = xValues.map((x) => ({
        x,
        y: 0,
      }));

      return {
        id: func.id, // Store function ID to identify dataset later
        label: `y = ${func.name}`,
        data: placeholderData,
        borderColor: borderColor,
        backgroundColor: borderColor + "33", // Add transparency
        borderWidth: 2,
        pointRadius: 0, // Hide points for smoother lines
        tension: 0.1, // Slight curve for smoother lines
        spanGaps: true, // Connect points across NaN values
      };
    });

    // Set initial chart data with placeholder values
    setChartData({ datasets });

    // If no visible functions, return empty dataset
    if (visibleFunctions.length === 0) {
      return { datasets };
    }

    // Process each function separately but send all x points in a single request per function
    visibleFunctions.forEach(async (func) => {
      try {
        // Skip functions that don't have parameters in scopeByFunction
        if (!scopeByFunction[func.id]) {
          console.log(
            `Skipping function ${func.id} (${func.name}) - no parameters available`
          );
          return;
        }

        // Create array of function evaluations for all x values at once
        const functionEvaluations = xValues.map((x) => ({
          designFunctionId: func.id,
          parameters: {
            ...scopeByFunction[func.id],
            x: x,
          },
        }));

        // Make a single API call with all x points for this function
        const resultData = await evaluateFunction({
          functions: functionEvaluations,
        }).unwrap();

        // Process all results for this function
        const calculatedYValues = resultData.results.map((result) => {
          const resultValue = result?.result;
          return resultValue !== null && isFinite(resultValue)
            ? resultValue
            : Number.NaN; // Use NaN for undefined points
        });

        // Create new data points with calculated y values
        const newDataPoints = xValues.map((x, i) => ({
          x,
          y: calculatedYValues[i],
        }));

        // Update chart data in state to trigger re-render
        setChartData((prevData) => {
          // Find the dataset for this function
          const newDatasets = prevData.datasets.map((dataset) => {
            if (dataset.id === func.id) {
              return {
                ...dataset,
                data: newDataPoints,
              };
            }
            return dataset;
          });

          return { datasets: newDatasets };
        });
      } catch (error) {
        console.error(`Error evaluating function ${func.id}:`, error);
      }
    });

    return { datasets };
  };

  // Generate chart data when component mounts or dependencies change
  useEffect(() => {
    generateFunctionChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functions, scopeByFunction, xRange, pointCount]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="text-2xl font-bold">Gráficos de funciones</h2>
      <h3 className="font-semibold">
        Selecciona las funciones que quieres mostrar en la gráfica
      </h3>
      <div className="w-11/12 my-4">
        <FunctionsDisplayForGraph
          scopeByFunction={scopeByFunction}
          functionsWithAdditionalData={functionsWithAdditionalData}
          setFunctionsWithAdditionalData={setFunctionsWithAdditionalData}
          generateFunctionChartData={generateFunctionChartData}
        />
      </div>
      <div className="w-full flex flex-wrap gap-4 items-center justify-center my-4">
        <div className="flex items-center gap-2">
          <label htmlFor="x-min" className="text-sm">
            X Min:
          </label>
          <input
            id="x-min"
            type="number"
            className="w-20 border border-gray-300 rounded px-2 py-1"
            value={xRange.min}
            onChange={(e) =>
              setXRange((prev) => ({ ...prev, min: Number(e.target.value) }))
            }
          />

          <label htmlFor="x-max" className="text-sm ml-2">
            X Max:
          </label>
          <input
            id="x-max"
            type="number"
            className="w-20 border border-gray-300 rounded px-2 py-1"
            value={xRange.max}
            onChange={(e) =>
              setXRange((prev) => ({ ...prev, max: Number(e.target.value) }))
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="point-count" className="text-sm">
            Puntos:
          </label>
          <input
            id="point-count"
            type="number"
            className="w-20 border border-gray-300 rounded px-2 py-1"
            value={pointCount}
            min={50}
            max={1000}
            step={50}
            onChange={(e) => setPointCount(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden p-2">
        <Line data={chartData} options={functionChartOptions} />
      </div>
    </div>
  );
};

export default FunctionsGraph;
