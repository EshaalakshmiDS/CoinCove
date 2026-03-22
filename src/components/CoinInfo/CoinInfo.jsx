import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { HistoricalChart } from "../../api/endpoints";
import { useCrypto } from "../../context/CryptoContext";
import SelectButton from "./SelectButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

const CHART_DAYS = [
  { label: "24H", value: 1 },
  { label: "7D", value: 7 },
  { label: "30D", value: 30 },
  { label: "1Y", value: 365 },
];

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currency, symbol } = useCrypto();
  const chartRef = useRef(null);

  useEffect(() => {
    if (!coin?.id) return;

    const fetchHistoricData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          HistoricalChart(coin.id, days, currency)
        );
        setHistoricData(data.prices);
      } catch (err) {
        setError(
          err.response?.status === 429
            ? "Rate limit reached — please wait a moment."
            : "Failed to load chart data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricData();
  }, [coin, days, currency]);

  const labels = historicData.map(([timestamp]) => {
    const date = new Date(timestamp);
    if (days === 1)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  });

  // Determine if price trend is positive
  const firstPrice = historicData[0]?.[1];
  const lastPrice = historicData[historicData.length - 1]?.[1];
  const isPositiveTrend = lastPrice >= firstPrice;
  const lineColor = isPositiveTrend ? "#4caf50" : "#f44336";

  const chartData = {
    labels,
    datasets: [
      {
        data: historicData.map(([, price]) => price),
        borderColor: lineColor,
        backgroundColor: isPositiveTrend
          ? "rgba(76,175,80,0.08)"
          : "rgba(244,67,54,0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#1e2128",
        borderColor: "rgba(255,215,0,0.3)",
        borderWidth: 1,
        titleColor: "#8b95a1",
        bodyColor: "#ffffff",
        padding: 10,
        callbacks: {
          label: (ctx) =>
            ` ${symbol}${ctx.parsed.y.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: ctx.parsed.y < 1 ? 6 : 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#8b95a1",
          maxTicksLimit: days === 1 ? 8 : 7,
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#8b95a1",
          callback: (val) =>
            `${symbol}${
              val >= 1000 ? (val / 1000).toFixed(1) + "K" : val.toFixed(2)
            }`,
        },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Timeframe buttons */}
      <Box display="flex" gap={1} justifyContent="flex-end" mb={2} flexWrap="wrap">
        {CHART_DAYS.map(({ label, value }) => (
          <SelectButton
            key={value}
            selected={days === value}
            onClick={() => setDays(value)}
          >
            {label}
          </SelectButton>
        ))}
      </Box>

      {/* Chart area */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={320}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={320}
        >
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </Box>
  );
};

export default CoinInfo;
