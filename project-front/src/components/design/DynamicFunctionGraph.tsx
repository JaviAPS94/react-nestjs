import { useState, useRef, useEffect } from "react";
import {
  X,
  RefreshCw,
  Plus,
  BookOpen,
  Trash2,
  Edit2,
  ChevronDown,
} from "lucide-react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Function to evaluate a mathematical expression safely
const evaluateExpression = (expression: string, x: number): number | null => {
  try {
    // Replace common mathematical functions with Math equivalents
    const preparedExpression = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/pow\(/g, "Math.pow(")
      .replace(/log\(/g, "Math.log(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/\^/g, "**") // Replace ^ with ** for exponentiation
      .replace(/pi/g, "Math.PI")
      .replace(/e/g, "Math.E");

    // Create a function that takes x as a parameter and evaluates the expression
    // eslint-disable-next-line no-new-func
    const func = new Function("x", `return ${preparedExpression}`);
    return func(x);
  } catch (error) {
    return null;
  }
};

interface FunctionData {
  expression: string;
  color: string;
  visible: boolean;
}

interface DataPoint {
  label: string;
  value: number;
  color: string;
}

interface LineDataSeries {
  name: string;
  color: string;
  data: { x: string | number; y: number }[];
  visible: boolean;
}

// Function presets
const functionPresets = {
  "Quadratic Functions": [
    { name: "Standard Quadratic", expression: "x^2" },
    { name: "Quadratic with coefficients", expression: "2*x^2 + 3*x - 4" },
    { name: "Shifted Parabola", expression: "(x-2)^2 + 1" },
  ],
  "Trigonometric Functions": [
    { name: "Sine", expression: "sin(x)" },
    { name: "Cosine", expression: "cos(x)" },
    { name: "Tangent", expression: "tan(x)" },
    { name: "Sin + Cos", expression: "sin(x) + cos(x)" },
    { name: "Sin * Cos", expression: "sin(x) * cos(x)" },
  ],
  "Combined Functions": [
    { name: "Damped Oscillation", expression: "exp(-0.1*x) * sin(x)" },
    { name: "Sine with Quadratic", expression: "sin(x) + 0.1*x^2" },
    {
      name: "Complex Wave",
      expression: "sin(x) + 0.5*sin(2*x) + 0.25*sin(3*x)",
    },
  ],
  "Other Functions": [
    { name: "Absolute Value", expression: "abs(x)" },
    { name: "Square Root", expression: "sqrt(abs(x))" },
    { name: "Logarithm", expression: "log(abs(x)+0.1)" },
    { name: "Rational Function", expression: "1/(1+x^2)" },
  ],
};

// Sample data for bar and pie charts
const sampleBarData: DataPoint[] = [
  { label: "January", value: 65, color: "rgb(255, 99, 132)" },
  { label: "February", value: 59, color: "rgb(54, 162, 235)" },
  { label: "March", value: 80, color: "rgb(75, 192, 192)" },
  { label: "April", value: 81, color: "rgb(255, 205, 86)" },
  { label: "May", value: 56, color: "rgb(153, 102, 255)" },
  { label: "June", value: 55, color: "rgb(255, 159, 64)" },
];

const samplePieData: DataPoint[] = [
  { label: "Red", value: 12, color: "rgb(255, 99, 132)" },
  { label: "Blue", value: 19, color: "rgb(54, 162, 235)" },
  { label: "Green", value: 3, color: "rgb(75, 192, 192)" },
  { label: "Yellow", value: 5, color: "rgb(255, 205, 86)" },
  { label: "Purple", value: 2, color: "rgb(153, 102, 255)" },
  { label: "Orange", value: 3, color: "rgb(255, 159, 64)" },
];

// Sample data for line charts
const sampleMultipleLineData: LineDataSeries[] = [
  {
    name: "Product A",
    color: "rgb(255, 99, 132)",
    data: [
      { x: "January", y: 65 },
      { x: "February", y: 59 },
      { x: "March", y: 80 },
      { x: "April", y: 81 },
      { x: "May", y: 56 },
      { x: "June", y: 55 },
    ],
    visible: true,
  },
  {
    name: "Product B",
    color: "rgb(54, 162, 235)",
    data: [
      { x: "January", y: 28 },
      { x: "February", y: 48 },
      { x: "March", y: 40 },
      { x: "April", y: 19 },
      { x: "May", y: 86 },
      { x: "June", y: 27 },
    ],
    visible: true,
  },
  {
    name: "Product C",
    color: "rgb(75, 192, 192)",
    data: [
      { x: "January", y: 35 },
      { x: "February", y: 20 },
      { x: "March", y: 60 },
      { x: "April", y: 70 },
      { x: "May", y: 40 },
      { x: "June", y: 45 },
    ],
    visible: true,
  },
];

const sampleDotsLineData: LineDataSeries[] = [
  {
    name: "Temperature",
    color: "rgb(255, 99, 132)",
    data: [
      { x: "Monday", y: 18 },
      { x: "Tuesday", y: 20 },
      { x: "Wednesday", y: 22 },
      { x: "Thursday", y: 19 },
      { x: "Friday", y: 23 },
      { x: "Saturday", y: 25 },
      { x: "Sunday", y: 21 },
    ],
    visible: true,
  },
];

const sampleInteractiveLineData: LineDataSeries[] = [
  {
    name: "Stock Price",
    color: "rgb(75, 192, 192)",
    data: [
      { x: "Jan", y: 150 },
      { x: "Feb", y: 155 },
      { x: "Mar", y: 160 },
      { x: "Apr", y: 165 },
      { x: "May", y: 170 },
      { x: "Jun", y: 175 },
      { x: "Jul", y: 180 },
      { x: "Aug", y: 185 },
      { x: "Sep", y: 190 },
      { x: "Oct", y: 195 },
      { x: "Nov", y: 200 },
      { x: "Dec", y: 205 },
    ],
    visible: true,
  },
];

const sampleStepLineData: LineDataSeries[] = [
  {
    name: "Process Status",
    color: "rgb(153, 102, 255)",
    data: [
      { x: "Step 1", y: 0 },
      { x: "Step 2", y: 1 },
      { x: "Step 3", y: 2 },
      { x: "Step 4", y: 1 },
      { x: "Step 5", y: 3 },
      { x: "Step 6", y: 2 },
      { x: "Step 7", y: 4 },
    ],
    visible: true,
  },
];

// Generate a random color
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 200 + 55); // Avoid too dark colors
  const g = Math.floor(Math.random() * 200 + 55);
  const b = Math.floor(Math.random() * 200 + 55);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function MultiChartVisualizerPureTailwind() {
  // State for function plotter
  const [functions, setFunctions] = useState<FunctionData[]>([
    { expression: "x^2", color: "rgb(255, 99, 132)", visible: true },
    {
      expression: "sin(x) + cos(x)",
      color: "rgb(54, 162, 235)",
      visible: true,
    },
  ]);
  const [newFunction, setNewFunction] = useState("");
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [pointCount, setPointCount] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // State for bar chart
  const [barData, setBarData] = useState<DataPoint[]>(sampleBarData);
  const [newBarLabel, setNewBarLabel] = useState("");
  const [newBarValue, setNewBarValue] = useState<number | "">("");
  const [editingBarIndex, setEditingBarIndex] = useState<number | null>(null);

  // State for pie chart
  const [pieData, setPieData] = useState<DataPoint[]>(samplePieData);
  const [newPieLabel, setNewPieLabel] = useState("");
  const [newPieValue, setNewPieValue] = useState<number | "">("");
  const [editingPieIndex, setEditingPieIndex] = useState<number | null>(null);

  // State for line charts
  const [multipleLineData, setMultipleLineData] = useState<LineDataSeries[]>(
    sampleMultipleLineData
  );
  const [dotsLineData, setDotsLineData] =
    useState<LineDataSeries[]>(sampleDotsLineData);
  const [interactiveLineData, setInteractiveLineData] = useState<
    LineDataSeries[]
  >(sampleInteractiveLineData);
  const [stepLineData, setStepLineData] =
    useState<LineDataSeries[]>(sampleStepLineData);

  // State for line chart editing
  const [editingLineType, setEditingLineType] = useState<string | null>(null);
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [editingLineSeriesIndex, setEditingLineSeriesIndex] = useState<
    number | null
  >(null);
  const [newLineName, setNewLineName] = useState("");
  const [newLineX, setNewLineX] = useState("");
  const [newLineY, setNewLineY] = useState<number | "">("");

  // Dialog state
  const [isBarDialogOpen, setIsBarDialogOpen] = useState(false);
  const [isPieDialogOpen, setIsPieDialogOpen] = useState(false);
  const [isLineDialogOpen, setIsLineDialogOpen] = useState(false);
  const [isLineSeriesDialogOpen, setIsLineSeriesDialogOpen] = useState(false);
  const [isFunctionGuideOpen, setIsFunctionGuideOpen] = useState(false);

  // Dropdown state
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [isLineSeriesDropdownOpen, setIsLineSeriesDropdownOpen] =
    useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("functions");
  const [activeLineTab, setActiveLineTab] = useState("multiple");

  // Refs for dropdowns
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const lineSeriesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        presetDropdownRef.current &&
        !presetDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPresetDropdownOpen(false);
      }
      if (
        lineSeriesDropdownRef.current &&
        !lineSeriesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLineSeriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate chart data for function plotter
  const generateFunctionChartData = () => {
    // Generate x values
    const step = (xRange.max - xRange.min) / pointCount;
    const xValues = Array.from(
      { length: pointCount + 1 },
      (_, i) => xRange.min + i * step
    );

    // Generate datasets for each function
    const datasets = functions
      .filter((func) => func.visible)
      .map((func) => {
        const yValues = xValues.map((x) => {
          const y = evaluateExpression(func.expression, x);
          return y !== null && isFinite(y) ? y : Number.NaN; // Use NaN for undefined points
        });

        return {
          label: `y = ${func.expression}`,
          data: yValues.map((y, i) => ({ x: xValues[i], y })),
          borderColor: func.color,
          backgroundColor: func.color + "33", // Add transparency
          borderWidth: 2,
          pointRadius: 0, // Hide points for smoother lines
          tension: 0.1, // Slight curve for smoother lines
          spanGaps: true, // Connect points across NaN values
        };
      });

    return { datasets };
  };

  // Generate chart data for bar chart
  const generateBarChartData = () => {
    return {
      labels: barData.map((item) => item.label),
      datasets: [
        {
          label: "Value",
          data: barData.map((item) => item.value),
          backgroundColor: barData.map((item) => item.color),
          borderColor: barData.map((item) => item.color),
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate chart data for pie chart
  const generatePieChartData = () => {
    return {
      labels: pieData.map((item) => item.label),
      datasets: [
        {
          data: pieData.map((item) => item.value),
          backgroundColor: pieData.map((item) => item.color),
          borderColor: "white",
          borderWidth: 2,
        },
      ],
    };
  };

  // Generate chart data for multiple line chart
  const generateMultipleLineChartData = () => {
    const labels = Array.from(
      new Set(
        multipleLineData.flatMap((series) =>
          series.data.map((point) => point.x)
        )
      )
    ).sort();

    return {
      labels,
      datasets: multipleLineData
        .filter((series) => series.visible)
        .map((series) => ({
          label: series.name,
          data: labels.map((label) => {
            const point = series.data.find((p) => p.x === label);
            return point ? point.y : null;
          }),
          borderColor: series.color,
          backgroundColor: series.color + "33",
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.1,
          spanGaps: true,
        })),
    };
  };

  // Generate chart data for dots line chart
  const generateDotsLineChartData = () => {
    const labels = Array.from(
      new Set(
        dotsLineData.flatMap((series) => series.data.map((point) => point.x))
      )
    ).sort();

    return {
      labels,
      datasets: dotsLineData
        .filter((series) => series.visible)
        .map((series) => ({
          label: series.name,
          data: labels.map((label) => {
            const point = series.data.find((p) => p.x === label);
            return point ? point.y : null;
          }),
          borderColor: series.color,
          backgroundColor: series.color,
          borderWidth: 2,
          pointRadius: 8,
          pointHoverRadius: 12,
          tension: 0.1,
          spanGaps: true,
        })),
    };
  };

  // Generate chart data for interactive line chart
  const generateInteractiveLineChartData = () => {
    const labels = Array.from(
      new Set(
        interactiveLineData.flatMap((series) =>
          series.data.map((point) => point.x)
        )
      )
    ).sort();

    return {
      labels,
      datasets: interactiveLineData
        .filter((series) => series.visible)
        .map((series) => ({
          label: series.name,
          data: labels.map((label) => {
            const point = series.data.find((p) => p.x === label);
            return point ? point.y : null;
          }),
          borderColor: series.color,
          backgroundColor: series.color + "33",
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "white",
          pointBorderColor: series.color,
          pointBorderWidth: 2,
          tension: 0.4,
          fill: true,
          spanGaps: true,
        })),
    };
  };

  // Generate chart data for step line chart
  const generateStepLineChartData = () => {
    const labels = Array.from(
      new Set(
        stepLineData.flatMap((series) => series.data.map((point) => point.x))
      )
    ).sort();

    return {
      labels,
      datasets: stepLineData
        .filter((series) => series.visible)
        .map((series) => ({
          label: series.name,
          data: labels.map((label) => {
            const point = series.data.find((p) => p.x === label);
            return point ? point.y : null;
          }),
          borderColor: series.color,
          backgroundColor: series.color + "33",
          borderWidth: 2,
          pointRadius: 5,
          tension: 0,
          spanGaps: false,
          stepped: true,
        })),
    };
  };

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

  // Chart options for bar chart
  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Value: ${context.parsed.y}`;
          },
        },
      },
    },
  };

  // Chart options for pie chart
  const pieChartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.chart.data.datasets[0];
            const total = (dataset.data as number[]).reduce(
              (acc, data) => acc + data,
              0
            );
            const value = dataset.data[context.dataIndex] as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Chart options for multiple line chart
  const multipleLineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  // Chart options for dots line chart
  const dotsLineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Chart options for interactive line chart
  const interactiveLineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  // Chart options for step line chart
  const stepLineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  // Function Plotter Methods
  const addFunction = () => {
    if (!newFunction.trim()) return;

    setFunctions([
      ...functions,
      { expression: newFunction, color: getRandomColor(), visible: true },
    ]);
    setNewFunction("");
  };

  const addPresetFunction = () => {
    if (!selectedCategory || !selectedPreset) return;

    const preset = functionPresets[
      selectedCategory as keyof typeof functionPresets
    ].find((p) => p.name === selectedPreset);

    if (preset) {
      setFunctions([
        ...functions,
        {
          expression: preset.expression,
          color: getRandomColor(),
          visible: true,
        },
      ]);
      setSelectedPreset(null);
    }
  };

  const removeFunction = (index: number) => {
    const newFunctions = [...functions];
    newFunctions.splice(index, 1);
    setFunctions(newFunctions);
  };

  const toggleFunction = (index: number) => {
    const newFunctions = [...functions];
    newFunctions[index].visible = !newFunctions[index].visible;
    setFunctions(newFunctions);
  };

  const resetView = () => {
    setXRange({ min: -10, max: 10 });
  };

  const updateXRange = (min: number, max: number) => {
    setXRange({ min, max });
  };

  // Bar Chart Methods
  const addBarDataPoint = () => {
    if (!newBarLabel.trim() || newBarValue === "") return;

    if (editingBarIndex !== null) {
      // Update existing data point
      const newData = [...barData];
      newData[editingBarIndex] = {
        label: newBarLabel,
        value: Number(newBarValue),
        color: newData[editingBarIndex].color,
      };
      setBarData(newData);
      setEditingBarIndex(null);
    } else {
      // Add new data point
      setBarData([
        ...barData,
        {
          label: newBarLabel,
          value: Number(newBarValue),
          color: getRandomColor(),
        },
      ]);
    }

    setNewBarLabel("");
    setNewBarValue("");
    setIsBarDialogOpen(false);
  };

  const editBarDataPoint = (index: number) => {
    setNewBarLabel(barData[index].label);
    setNewBarValue(barData[index].value);
    setEditingBarIndex(index);
    setIsBarDialogOpen(true);
  };

  const removeBarDataPoint = (index: number) => {
    const newData = [...barData];
    newData.splice(index, 1);
    setBarData(newData);
  };

  // Pie Chart Methods
  const addPieDataPoint = () => {
    if (!newPieLabel.trim() || newPieValue === "") return;

    if (editingPieIndex !== null) {
      // Update existing data point
      const newData = [...pieData];
      newData[editingPieIndex] = {
        label: newPieLabel,
        value: Number(newPieValue),
        color: newData[editingPieIndex].color,
      };
      setPieData(newData);
      setEditingPieIndex(null);
    } else {
      // Add new data point
      setPieData([
        ...pieData,
        {
          label: newPieLabel,
          value: Number(newPieValue),
          color: getRandomColor(),
        },
      ]);
    }

    setNewPieLabel("");
    setNewPieValue("");
    setIsPieDialogOpen(false);
  };

  const editPieDataPoint = (index: number) => {
    setNewPieLabel(pieData[index].label);
    setNewPieValue(pieData[index].value);
    setEditingPieIndex(index);
    setIsPieDialogOpen(true);
  };

  const removePieDataPoint = (index: number) => {
    const newData = [...pieData];
    newData.splice(index, 1);
    setPieData(newData);
  };

  // Line Chart Methods
  const getLineDataByType = (type: string): LineDataSeries[] => {
    switch (type) {
      case "multiple":
        return multipleLineData;
      case "dots":
        return dotsLineData;
      case "interactive":
        return interactiveLineData;
      case "step":
        return stepLineData;
      default:
        return [];
    }
  };

  const setLineDataByType = (type: string, data: LineDataSeries[]) => {
    switch (type) {
      case "multiple":
        setMultipleLineData(data);
        break;
      case "dots":
        setDotsLineData(data);
        break;
      case "interactive":
        setInteractiveLineData(data);
        break;
      case "step":
        setStepLineData(data);
        break;
    }
  };

  const addLineSeries = () => {
    if (!newLineName.trim()) return;

    const type = editingLineType || activeLineTab;
    const currentData = getLineDataByType(type);

    if (editingLineSeriesIndex !== null) {
      // Update existing series
      const newData = [...currentData];
      newData[editingLineSeriesIndex] = {
        ...newData[editingLineSeriesIndex],
        name: newLineName,
      };
      setLineDataByType(type, newData);
      setEditingLineSeriesIndex(null);
    } else {
      // Add new series
      setLineDataByType(type, [
        ...currentData,
        {
          name: newLineName,
          color: getRandomColor(),
          data: [],
          visible: true,
        },
      ]);
    }

    setNewLineName("");
    setIsLineSeriesDialogOpen(false);
  };

  const editLineSeries = (type: string, index: number) => {
    const currentData = getLineDataByType(type);
    setNewLineName(currentData[index].name);
    setEditingLineType(type);
    setEditingLineSeriesIndex(index);
    setIsLineSeriesDialogOpen(true);
  };

  const removeLineSeries = (type: string, index: number) => {
    const currentData = getLineDataByType(type);
    const newData = [...currentData];
    newData.splice(index, 1);
    setLineDataByType(type, newData);
  };

  const toggleLineSeries = (type: string, index: number) => {
    const currentData = getLineDataByType(type);
    const newData = [...currentData];
    newData[index].visible = !newData[index].visible;
    setLineDataByType(type, newData);
  };

  const addLineDataPoint = () => {
    if (!newLineX.trim() || newLineY === "") return;

    const type = editingLineType || activeLineTab;
    const seriesIndex =
      editingLineSeriesIndex !== null ? editingLineSeriesIndex : 0;
    const currentData = getLineDataByType(type);

    if (editingLineIndex !== null) {
      // Update existing data point
      const newData = [...currentData];
      const newSeriesData = [...newData[seriesIndex].data];
      newSeriesData[editingLineIndex] = {
        x: newLineX,
        y: Number(newLineY),
      };
      newData[seriesIndex].data = newSeriesData;
      setLineDataByType(type, newData);
      setEditingLineIndex(null);
    } else {
      // Add new data point
      const newData = [...currentData];
      newData[seriesIndex].data.push({
        x: newLineX,
        y: Number(newLineY),
      });
      setLineDataByType(type, newData);
    }

    setNewLineX("");
    setNewLineY("");
    setIsLineDialogOpen(false);
  };

  const editLineDataPoint = (
    type: string,
    seriesIndex: number,
    pointIndex: number
  ) => {
    const currentData = getLineDataByType(type);
    const point = currentData[seriesIndex].data[pointIndex];
    setNewLineX(point.x.toString());
    setNewLineY(point.y);
    setEditingLineType(type);
    setEditingLineSeriesIndex(seriesIndex);
    setEditingLineIndex(pointIndex);
    setIsLineDialogOpen(true);
  };

  const removeLineDataPoint = (
    type: string,
    seriesIndex: number,
    pointIndex: number
  ) => {
    const currentData = getLineDataByType(type);
    const newData = [...currentData];
    newData[seriesIndex].data.splice(pointIndex, 1);
    setLineDataByType(type, newData);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Multi-Chart Visualizer</h2>
          <p className="text-gray-500 mt-1">
            Create and visualize mathematical functions, bar charts, pie charts,
            and line charts in one place.
          </p>
        </div>
        <div className="p-4">
          {/* Tabs */}
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "functions"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("functions")}
              >
                Function Plotter
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "bar"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("bar")}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "pie"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("pie")}
              >
                Pie Chart
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "line"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("line")}
              >
                Line Charts
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "about"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
            </div>
          </div>

          {/* Function Plotter Tab */}
          {activeTab === "functions" && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="function-input"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Add Custom Function
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="function-input"
                      type="text"
                      value={newFunction}
                      onChange={(e) => setNewFunction(e.target.value)}
                      placeholder="e.g., 2*x^2 + 3*x - 4 or sin(x) + cos(x)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addFunction();
                      }}
                    />
                    <button
                      onClick={addFunction}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Preset Function
                  </label>
                  <div className="flex gap-2">
                    {/* Category Dropdown */}
                    <div
                      ref={categoryDropdownRef}
                      className="relative w-[180px]"
                    >
                      <button
                        type="button"
                        className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                      >
                        <span>{selectedCategory || "Category"}</span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                      {isCategoryDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {Object.keys(functionPresets).map((category) => (
                            <div
                              key={category}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedCategory(category);
                                setIsCategoryDropdownOpen(false);
                              }}
                            >
                              {category}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preset Dropdown */}
                    <div ref={presetDropdownRef} className="relative w-[180px]">
                      <button
                        type="button"
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md ${
                          !selectedCategory
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        }`}
                        onClick={() =>
                          selectedCategory &&
                          setIsPresetDropdownOpen(!isPresetDropdownOpen)
                        }
                        disabled={!selectedCategory}
                      >
                        <span>{selectedPreset || "Function"}</span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </button>
                      {isPresetDropdownOpen && selectedCategory && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {functionPresets[
                            selectedCategory as keyof typeof functionPresets
                          ].map((preset) => (
                            <div
                              key={preset.name}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedPreset(preset.name);
                                setIsPresetDropdownOpen(false);
                              }}
                            >
                              {preset.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={addPresetFunction}
                      disabled={!selectedPreset}
                      className={`p-2 rounded-md ${
                        !selectedPreset
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Active Functions</h3>
                <button
                  onClick={() => setIsFunctionGuideOpen(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <BookOpen size={16} />
                  Function Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {functions.map((func, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 p-2 border rounded-md ${
                      func.visible
                        ? "border-gray-300"
                        : "border-gray-200 bg-gray-100"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: func.color }}
                    />
                    <span
                      className={func.visible ? "font-medium" : "text-gray-500"}
                    >
                      y = {func.expression}
                    </span>
                    <button
                      onClick={() => toggleFunction(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {func.visible ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => removeFunction(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  X Range:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={xRange.min}
                    onChange={(e) =>
                      updateXRange(Number(e.target.value), xRange.max)
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={xRange.max}
                    onChange={(e) =>
                      updateXRange(xRange.min, Number(e.target.value))
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={resetView}
                  className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>

              <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden p-2">
                <Line
                  data={generateFunctionChartData()}
                  options={functionChartOptions}
                />
              </div>
            </div>
          )}

          {/* Bar Chart Tab */}
          {activeTab === "bar" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Bar Chart Data</h3>
                <button
                  onClick={() => {
                    setNewBarLabel("");
                    setNewBarValue("");
                    setEditingBarIndex(null);
                    setIsBarDialogOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Data Point
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Color</th>
                      <th className="border p-2 text-left">Label</th>
                      <th className="border p-2 text-left">Value</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barData.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </td>
                        <td className="border p-2">{item.label}</td>
                        <td className="border p-2">{item.value}</td>
                        <td className="border p-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editBarDataPoint(index)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => removeBarDataPoint(index)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden p-2">
                <Bar data={generateBarChartData()} options={barChartOptions} />
              </div>
            </div>
          )}

          {/* Pie Chart Tab */}
          {activeTab === "pie" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Pie Chart Data</h3>
                <button
                  onClick={() => {
                    setNewPieLabel("");
                    setNewPieValue("");
                    setEditingPieIndex(null);
                    setIsPieDialogOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Data Point
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Color</th>
                      <th className="border p-2 text-left">Label</th>
                      <th className="border p-2 text-left">Value</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pieData.map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </td>
                        <td className="border p-2">{item.label}</td>
                        <td className="border p-2">{item.value}</td>
                        <td className="border p-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editPieDataPoint(index)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => removePieDataPoint(index)}
                              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden p-2">
                <Pie data={generatePieChartData()} options={pieChartOptions} />
              </div>
            </div>
          )}

          {/* Line Charts Tab */}
          {activeTab === "line" && (
            <div className="space-y-4">
              {/* Line Chart Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeLineTab === "multiple"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveLineTab("multiple")}
                >
                  Multiple Lines
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeLineTab === "dots"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveLineTab("dots")}
                >
                  With Dots
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeLineTab === "interactive"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveLineTab("interactive")}
                >
                  Interactive
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeLineTab === "step"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveLineTab("step")}
                >
                  Step Line
                </button>
              </div>

              {/* Multiple Line Chart Tab */}
              {activeLineTab === "multiple" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Multiple Line Chart</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewLineName("");
                          setEditingLineType("multiple");
                          setEditingLineSeriesIndex(null);
                          setIsLineSeriesDialogOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Data Series
                      </button>

                      <button
                        onClick={() => {
                          setNewLineX("");
                          setNewLineY("");
                          setEditingLineType("multiple");
                          setEditingLineIndex(null);
                          setEditingLineSeriesIndex(
                            multipleLineData.length > 0 ? 0 : null
                          );
                          setIsLineDialogOpen(true);
                        }}
                        disabled={multipleLineData.length === 0}
                        className={`px-4 py-2 rounded-md ${
                          multipleLineData.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        Add Data Point
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-y-auto max-h-[300px] border rounded-md p-2">
                      <h4 className="font-medium mb-2">Data Series</h4>
                      {multipleLineData.map((series, seriesIndex) => (
                        <div key={seriesIndex} className="mb-4 border-b pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: series.color }}
                              />
                              <span
                                className={
                                  series.visible
                                    ? "font-medium"
                                    : "text-gray-500"
                                }
                              >
                                {series.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    series.visible
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() =>
                                    toggleLineSeries("multiple", seriesIndex)
                                  }
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      series.visible
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                                <span className="ml-2 text-sm">
                                  {series.visible ? "Visible" : "Hidden"}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  editLineSeries("multiple", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  removeLineSeries("multiple", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr>
                                  <th className="border p-1 text-left">X</th>
                                  <th className="border p-1 text-left">Y</th>
                                  <th className="border p-1 text-left">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {series.data.map((point, pointIndex) => (
                                  <tr key={pointIndex}>
                                    <td className="border p-1">{point.x}</td>
                                    <td className="border p-1">{point.y}</td>
                                    <td className="border p-1">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() =>
                                            editLineDataPoint(
                                              "multiple",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            removeLineDataPoint(
                                              "multiple",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-[300px] border border-gray-300 rounded-md overflow-hidden p-2">
                      <Line
                        data={generateMultipleLineChartData()}
                        options={multipleLineChartOptions}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Other line chart tabs would follow the same pattern */}
              {/* Dots Line Chart Tab */}
              {activeLineTab === "dots" && (
                <div className="space-y-4">
                  {/* Similar structure to multiple line chart tab */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Line Chart with Dots
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewLineName("");
                          setEditingLineType("dots");
                          setEditingLineSeriesIndex(null);
                          setIsLineSeriesDialogOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Data Series
                      </button>

                      <button
                        onClick={() => {
                          setNewLineX("");
                          setNewLineY("");
                          setEditingLineType("dots");
                          setEditingLineIndex(null);
                          setEditingLineSeriesIndex(
                            dotsLineData.length > 0 ? 0 : null
                          );
                          setIsLineDialogOpen(true);
                        }}
                        disabled={dotsLineData.length === 0}
                        className={`px-4 py-2 rounded-md ${
                          dotsLineData.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        Add Data Point
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-y-auto max-h-[300px] border rounded-md p-2">
                      <h4 className="font-medium mb-2">Data Series</h4>
                      {dotsLineData.map((series, seriesIndex) => (
                        <div key={seriesIndex} className="mb-4 border-b pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: series.color }}
                              />
                              <span
                                className={
                                  series.visible
                                    ? "font-medium"
                                    : "text-gray-500"
                                }
                              >
                                {series.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    series.visible
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() =>
                                    toggleLineSeries("dots", seriesIndex)
                                  }
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      series.visible
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                                <span className="ml-2 text-sm">
                                  {series.visible ? "Visible" : "Hidden"}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  editLineSeries("dots", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  removeLineSeries("dots", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr>
                                  <th className="border p-1 text-left">X</th>
                                  <th className="border p-1 text-left">Y</th>
                                  <th className="border p-1 text-left">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {series.data.map((point, pointIndex) => (
                                  <tr key={pointIndex}>
                                    <td className="border p-1">{point.x}</td>
                                    <td className="border p-1">{point.y}</td>
                                    <td className="border p-1">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() =>
                                            editLineDataPoint(
                                              "dots",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            removeLineDataPoint(
                                              "dots",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-[300px] border border-gray-300 rounded-md overflow-hidden p-2">
                      <Line
                        data={generateDotsLineChartData()}
                        options={dotsLineChartOptions}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Line Chart Tab */}
              {activeLineTab === "interactive" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Interactive Line Chart
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewLineName("");
                          setEditingLineType("interactive");
                          setEditingLineSeriesIndex(null);
                          setIsLineSeriesDialogOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Data Series
                      </button>

                      <button
                        onClick={() => {
                          setNewLineX("");
                          setNewLineY("");
                          setEditingLineType("interactive");
                          setEditingLineIndex(null);
                          setEditingLineSeriesIndex(
                            interactiveLineData.length > 0 ? 0 : null
                          );
                          setIsLineDialogOpen(true);
                        }}
                        disabled={interactiveLineData.length === 0}
                        className={`px-4 py-2 rounded-md ${
                          interactiveLineData.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        Add Data Point
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-y-auto max-h-[300px] border rounded-md p-2">
                      <h4 className="font-medium mb-2">Data Series</h4>
                      {interactiveLineData.map((series, seriesIndex) => (
                        <div key={seriesIndex} className="mb-4 border-b pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: series.color }}
                              />
                              <span
                                className={
                                  series.visible
                                    ? "font-medium"
                                    : "text-gray-500"
                                }
                              >
                                {series.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    series.visible
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() =>
                                    toggleLineSeries("interactive", seriesIndex)
                                  }
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      series.visible
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                                <span className="ml-2 text-sm">
                                  {series.visible ? "Visible" : "Hidden"}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  editLineSeries("interactive", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  removeLineSeries("interactive", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr>
                                  <th className="border p-1 text-left">X</th>
                                  <th className="border p-1 text-left">Y</th>
                                  <th className="border p-1 text-left">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {series.data.map((point, pointIndex) => (
                                  <tr key={pointIndex}>
                                    <td className="border p-1">{point.x}</td>
                                    <td className="border p-1">{point.y}</td>
                                    <td className="border p-1">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() =>
                                            editLineDataPoint(
                                              "interactive",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            removeLineDataPoint(
                                              "interactive",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-[300px] border border-gray-300 rounded-md overflow-hidden p-2">
                      <Line
                        data={generateInteractiveLineChartData()}
                        options={interactiveLineChartOptions}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step Line Chart Tab */}
              {activeLineTab === "step" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Step Line Chart</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setNewLineName("");
                          setEditingLineType("step");
                          setEditingLineSeriesIndex(null);
                          setIsLineSeriesDialogOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Add Data Series
                      </button>

                      <button
                        onClick={() => {
                          setNewLineX("");
                          setNewLineY("");
                          setEditingLineType("step");
                          setEditingLineIndex(null);
                          setEditingLineSeriesIndex(
                            stepLineData.length > 0 ? 0 : null
                          );
                          setIsLineDialogOpen(true);
                        }}
                        disabled={stepLineData.length === 0}
                        className={`px-4 py-2 rounded-md ${
                          stepLineData.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        Add Data Point
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-y-auto max-h-[300px] border rounded-md p-2">
                      <h4 className="font-medium mb-2">Data Series</h4>
                      {stepLineData.map((series, seriesIndex) => (
                        <div key={seriesIndex} className="mb-4 border-b pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: series.color }}
                              />
                              <span
                                className={
                                  series.visible
                                    ? "font-medium"
                                    : "text-gray-500"
                                }
                              >
                                {series.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    series.visible
                                      ? "bg-blue-600"
                                      : "bg-gray-200"
                                  }`}
                                  onClick={() =>
                                    toggleLineSeries("step", seriesIndex)
                                  }
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      series.visible
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                                <span className="ml-2 text-sm">
                                  {series.visible ? "Visible" : "Hidden"}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  editLineSeries("step", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  removeLineSeries("step", seriesIndex)
                                }
                                className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr>
                                  <th className="border p-1 text-left">X</th>
                                  <th className="border p-1 text-left">Y</th>
                                  <th className="border p-1 text-left">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {series.data.map((point, pointIndex) => (
                                  <tr key={pointIndex}>
                                    <td className="border p-1">{point.x}</td>
                                    <td className="border p-1">{point.y}</td>
                                    <td className="border p-1">
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() =>
                                            editLineDataPoint(
                                              "step",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            removeLineDataPoint(
                                              "step",
                                              seriesIndex,
                                              pointIndex
                                            )
                                          }
                                          className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-[300px] border border-gray-300 rounded-md overflow-hidden p-2">
                      <Line
                        data={generateStepLineChartData()}
                        options={stepLineChartOptions}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-4 prose max-w-none">
              <h3>About Multi-Chart Visualizer</h3>
              <p>
                This application provides a comprehensive set of visualization
                tools for mathematical functions and data. It includes:
              </p>
              <ul>
                <li>
                  <strong>Function Plotter:</strong> Visualize mathematical
                  functions including quadratics, trigonometric functions, and
                  complex combinations.
                </li>
                <li>
                  <strong>Bar Chart:</strong> Create bar charts for comparing
                  categorical data.
                </li>
                <li>
                  <strong>Pie Chart:</strong> Visualize proportions and
                  percentages with interactive pie charts.
                </li>
                <li>
                  <strong>Line Charts:</strong> Four different types of line
                  charts for various visualization needs:
                  <ul>
                    <li>
                      Multiple Lines - Compare multiple data series on the same
                      chart
                    </li>
                    <li>With Dots - Emphasize individual data points</li>
                    <li>Interactive - Enhanced tooltips and hover effects</li>
                    <li>
                      Step Line - Connect points with horizontal and vertical
                      segments
                    </li>
                  </ul>
                </li>
              </ul>
              <h4>Usage Tips</h4>
              <ul>
                <li>
                  Use the tabs at the top to switch between different chart
                  types.
                </li>
                <li>Each chart type has its own data management interface.</li>
                <li>
                  You can add, edit, and remove data points for all chart types.
                </li>
                <li>
                  For line charts, you can create multiple data series and
                  toggle their visibility.
                </li>
                <li>
                  The function plotter supports a wide range of mathematical
                  expressions - check the Function Guide for examples.
                </li>
              </ul>
              <p>
                This application uses Chart.js for rendering charts and provides
                a consistent interface across all chart types.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {/* Bar Chart Modal */}
      {isBarDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsBarDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {editingBarIndex !== null
                  ? "Edit Data Point"
                  : "Add Data Point"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the label and value for your data point.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="bar-label"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Label
                  </label>
                  <input
                    id="bar-label"
                    value={newBarLabel}
                    onChange={(e) => setNewBarLabel(e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="bar-value"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Value
                  </label>
                  <input
                    id="bar-value"
                    type="number"
                    value={newBarValue}
                    onChange={(e) =>
                      setNewBarValue(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={addBarDataPoint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingBarIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pie Chart Modal */}
      {isPieDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsPieDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {editingPieIndex !== null
                  ? "Edit Data Point"
                  : "Add Data Point"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the label and value for your data point.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="pie-label"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Label
                  </label>
                  <input
                    id="pie-label"
                    value={newPieLabel}
                    onChange={(e) => setNewPieLabel(e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="pie-value"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Value
                  </label>
                  <input
                    id="pie-value"
                    type="number"
                    value={newPieValue}
                    onChange={(e) =>
                      setNewPieValue(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={addPieDataPoint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingPieIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Line Series Modal */}
      {isLineSeriesDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsLineSeriesDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {editingLineSeriesIndex !== null
                  ? "Edit Data Series"
                  : "Add Data Series"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a name for your data series.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="line-name"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="line-name"
                    value={newLineName}
                    onChange={(e) => setNewLineName(e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={addLineSeries}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingLineSeriesIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Line Data Point Modal */}
      {isLineDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsLineDialogOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">
                {editingLineIndex !== null
                  ? "Edit Data Point"
                  : "Add Data Point"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter the x and y values for your data point.
              </p>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {editingLineSeriesIndex !== null && editingLineType && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm font-medium text-gray-700">
                      Series
                    </label>
                    <div className="col-span-3">
                      <div ref={lineSeriesDropdownRef} className="relative">
                        <button
                          type="button"
                          className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() =>
                            setIsLineSeriesDropdownOpen(
                              !isLineSeriesDropdownOpen
                            )
                          }
                        >
                          <span>
                            {getLineDataByType(editingLineType)[
                              editingLineSeriesIndex
                            ]?.name || "Select series"}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                        {isLineSeriesDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {getLineDataByType(editingLineType).map(
                              (series, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => {
                                    setEditingLineSeriesIndex(index);
                                    setIsLineSeriesDropdownOpen(false);
                                  }}
                                >
                                  {series.name}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="line-x"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    X Value
                  </label>
                  <input
                    id="line-x"
                    value={newLineX}
                    onChange={(e) => setNewLineX(e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label
                    htmlFor="line-y"
                    className="text-right text-sm font-medium text-gray-700"
                  >
                    Y Value
                  </label>
                  <input
                    id="line-y"
                    type="number"
                    value={newLineY}
                    onChange={(e) =>
                      setNewLineY(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="col-span-3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={addLineDataPoint}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingLineIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Function Guide Modal */}
      {isFunctionGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsFunctionGuideOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Function Guide</h3>
              <p className="mt-1 text-sm text-gray-500">
                Examples of functions you can create and combine
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-bold mb-2">Basic Operations</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded">x + 5</code> -
                      Addition
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">x - 3</code> -
                      Subtraction
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">2 * x</code> -
                      Multiplication
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">x / 2</code> -
                      Division
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">x^2</code> or{" "}
                      <code className="bg-gray-100 px-1 rounded">x**2</code> -
                      Exponentiation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Quadratic Functions</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded">
                        a*x^2 + b*x + c
                      </code>{" "}
                      - Standard form
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">
                        2*x^2 + 3*x - 4
                      </code>{" "}
                      - Example
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">
                        (x-h)^2 + k
                      </code>{" "}
                      - Vertex form
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Trigonometric Functions</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded">sin(x)</code>,{" "}
                      <code className="bg-gray-100 px-1 rounded">cos(x)</code>,{" "}
                      <code className="bg-gray-100 px-1 rounded">tan(x)</code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">
                        sin(x) + cos(x)
                      </code>{" "}
                      - Addition
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">
                        sin(x) * cos(x)
                      </code>{" "}
                      - Multiplication
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Other Functions</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-1 rounded">sqrt(x)</code>{" "}
                      - Square root
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">abs(x)</code> -
                      Absolute value
                    </li>
                    <li>
                      <code className="bg-gray-100 px-1 rounded">log(x)</code> -
                      Natural logarithm
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsFunctionGuideOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
