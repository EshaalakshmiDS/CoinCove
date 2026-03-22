import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { SingleCoin } from "../api/endpoints";
import useFetch from "../hooks/useFetch";
import { useCrypto } from "../context/CryptoContext";
import CoinInfo from "../components/CoinInfo/CoinInfo";
import { formatPrice, formatNumber } from "../utils/helpers";

const StatItem = ({ label, value }) => (
  <Box
    sx={{
      p: 1.5,
      bgcolor: "rgba(255,255,255,0.03)",
      borderRadius: 2,
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <Typography variant="caption" color="text.secondary" display="block">
      {label}
    </Typography>
    <Typography fontWeight={600} fontSize="0.9rem" mt={0.25}>
      {value}
    </Typography>
  </Box>
);

const CoinPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: coin, loading, error } = useFetch(SingleCoin(id));
  const { symbol, currency, watchlist, addToWatchlist, removeFromWatchlist } =
    useCrypto();
  const [showFull, setShowFull] = useState(false);

  const isWatchlisted = watchlist.includes(id);

  if (loading) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1400, mx: "auto" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Skeleton variant="circular" width={100} height={100} />
              <Skeleton variant="text" width={160} height={36} />
              <Skeleton variant="text" width={120} height={52} />
              <Skeleton variant="rounded" width="100%" height={48} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !coin) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 800, mx: "auto" }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => navigate("/")}>
              Go Home
            </Button>
          }
        >
          {error || "Coin not found."}
        </Alert>
      </Box>
    );
  }

  const price = coin.market_data?.current_price?.[currency];
  const marketCap = coin.market_data?.market_cap?.[currency];
  const high24h = coin.market_data?.high_24h?.[currency];
  const low24h = coin.market_data?.low_24h?.[currency];
  const volume = coin.market_data?.total_volume?.[currency];
  const supply = coin.market_data?.circulating_supply;
  const priceChange = coin.market_data?.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  // Strip HTML tags from description
  const rawDesc = coin.description?.en ?? "";
  const cleanDesc = rawDesc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const DESC_LIMIT = 300;

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1400, mx: "auto" }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: "text.secondary", mb: 3, pl: 0 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* ── Left column: coin identity + stats ── */}
        <Grid item xs={12} md={4}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{
              position: { md: "sticky" },
              top: { md: 80 },
            }}
          >
            {/* Logo + name */}
            <img
              src={coin.image?.large}
              alt={coin.name}
              width={96}
              height={96}
              style={{ borderRadius: "50%" }}
            />
            <Box textAlign="center">
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                justifyContent="center"
              >
                <Typography variant="h4" fontWeight={700}>
                  {coin.name}
                </Typography>
                <Chip
                  label={`#${coin.market_cap_rank}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Typography color="text.secondary">
                {coin.symbol?.toUpperCase()}
              </Typography>
            </Box>

            {/* Current price */}
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {formatPrice(price, symbol)}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                justifyContent="center"
                mt={0.5}
              >
                {isPositive ? (
                  <TrendingUpIcon sx={{ color: "#4caf50", fontSize: 18 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: "#f44336", fontSize: 18 }} />
                )}
                <Typography
                  fontWeight={600}
                  sx={{ color: isPositive ? "#4caf50" : "#f44336" }}
                >
                  {isPositive ? "+" : ""}
                  {priceChange?.toFixed(2)}% (24h)
                </Typography>
              </Box>
            </Box>

            {/* Watchlist button */}
            <Button
              variant={isWatchlisted ? "outlined" : "contained"}
              color="primary"
              fullWidth
              startIcon={
                isWatchlisted ? <BookmarkRemoveIcon /> : <BookmarkAddIcon />
              }
              onClick={() =>
                isWatchlisted
                  ? removeFromWatchlist(id)
                  : addToWatchlist(id)
              }
              sx={{ maxWidth: 320, py: 1.2 }}
            >
              {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>

            <Divider sx={{ width: "100%", my: 0.5 }} />

            {/* Stats grid */}
            <Box
              sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
              }}
            >
              <StatItem
                label="Market Cap"
                value={`${symbol}${formatNumber(marketCap)}`}
              />
              <StatItem
                label="24h Volume"
                value={`${symbol}${formatNumber(volume)}`}
              />
              <StatItem label="24h High" value={formatPrice(high24h, symbol)} />
              <StatItem label="24h Low" value={formatPrice(low24h, symbol)} />
              <StatItem
                label="Circulating Supply"
                value={formatNumber(supply)}
              />
              <StatItem
                label="Rank"
                value={`#${coin.market_cap_rank}`}
              />
            </Box>

            <Divider sx={{ width: "100%", my: 0.5 }} />

            {/* Description */}
            {cleanDesc && (
              <Box sx={{ width: "100%" }}>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  About {coin.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.75}
                >
                  {showFull ? cleanDesc : cleanDesc.slice(0, DESC_LIMIT)}
                  {cleanDesc.length > DESC_LIMIT && (
                    <Typography
                      component="span"
                      sx={{
                        color: "primary.main",
                        cursor: "pointer",
                        ml: 0.5,
                        fontWeight: 600,
                        fontSize: "inherit",
                      }}
                      onClick={() => setShowFull((v) => !v)}
                    >
                      {showFull ? " Show less" : "... Read more"}
                    </Typography>
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        {/* ── Right column: chart ── */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              Price Chart
            </Typography>
            <CoinInfo coin={coin} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoinPage;
