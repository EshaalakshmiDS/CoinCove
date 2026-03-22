import { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Skeleton,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useNavigate } from "react-router-dom";
import { useCrypto } from "../context/CryptoContext";
import { formatPrice, formatNumber } from "../utils/helpers";

const SkeletonRow = () => (
  <TableRow>
    {Array(6)
      .fill(null)
      .map((_, i) => (
        <TableCell key={i}>
          <Skeleton variant="text" sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
        </TableCell>
      ))}
  </TableRow>
);

const WatchlistPage = () => {
  const {
    coins,
    coinsLoading,
    coinsError,
    watchlist,
    removeFromWatchlist,
    symbol,
  } = useCrypto();
  const navigate = useNavigate();

  const watchlistedCoins = useMemo(
    () => coins.filter((c) => watchlist.includes(c.id)),
    [coins, watchlist]
  );

  // Empty state
  if (!coinsLoading && watchlist.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="65vh"
        gap={2}
        px={2}
      >
        <BookmarkBorderIcon
          sx={{ fontSize: 64, color: "rgba(255,215,0,0.3)" }}
        />
        <Typography variant="h5" fontWeight={600}>
          Your watchlist is empty
        </Typography>
        <Typography color="text.secondary" textAlign="center">
          Browse coins and click &quot;Add to Watchlist&quot; to track them here.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{ mt: 1 }}
        >
          Browse Coins
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1400, mx: "auto" }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          My Watchlist
        </Typography>
        <Typography color="text.secondary" mt={0.5}>
          {watchlist.length} coin{watchlist.length !== 1 ? "s" : ""} tracked
        </Typography>
      </Box>

      {coinsError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Price data may be stale — {coinsError}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{ bgcolor: "background.paper", borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,215,0,0.04)" }}>
              {["#", "Coin", "Price", "24h %", "Market Cap", ""].map(
                (h, i) => (
                  <TableCell
                    key={i}
                    align={i >= 2 ? "right" : "left"}
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {coinsLoading
              ? Array(watchlist.length || 3)
                  .fill(null)
                  .map((_, i) => <SkeletonRow key={i} />)
              : watchlistedCoins.map((coin) => {
                  const priceChange = coin.price_change_percentage_24h;
                  const isPositive = priceChange >= 0;

                  return (
                    <TableRow
                      key={coin.id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(255,215,0,0.04) !important",
                        },
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell
                        onClick={() => navigate(`/coins/${coin.id}`)}
                        sx={{ cursor: "pointer", color: "text.secondary" }}
                      >
                        {coin.market_cap_rank}
                      </TableCell>

                      <TableCell
                        onClick={() => navigate(`/coins/${coin.id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            width={32}
                            height={32}
                            style={{ borderRadius: "50%" }}
                          />
                          <Box>
                            <Typography fontWeight={600} fontSize="0.9rem">
                              {coin.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                            >
                              {coin.symbol.toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={() => navigate(`/coins/${coin.id}`)}
                        sx={{ cursor: "pointer", fontWeight: 600 }}
                      >
                        {formatPrice(coin.current_price, symbol)}
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={() => navigate(`/coins/${coin.id}`)}
                        sx={{ cursor: "pointer" }}
                      >
                        <Chip
                          size="small"
                          icon={
                            isPositive ? (
                              <TrendingUpIcon
                                sx={{ fontSize: "14px !important" }}
                              />
                            ) : (
                              <TrendingDownIcon
                                sx={{ fontSize: "14px !important" }}
                              />
                            )
                          }
                          label={`${isPositive ? "+" : ""}${priceChange?.toFixed(2)}%`}
                          sx={{
                            bgcolor: isPositive
                              ? "rgba(76,175,80,0.12)"
                              : "rgba(244,67,54,0.12)",
                            color: isPositive ? "#4caf50" : "#f44336",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            "& .MuiChip-icon": {
                              color: isPositive ? "#4caf50" : "#f44336",
                            },
                          }}
                        />
                      </TableCell>

                      <TableCell
                        align="right"
                        onClick={() => navigate(`/coins/${coin.id}`)}
                        sx={{
                          cursor: "pointer",
                          color: "text.secondary",
                          fontSize: "0.875rem",
                        }}
                      >
                        {symbol}
                        {formatNumber(coin.market_cap)}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => removeFromWatchlist(coin.id)}
                          sx={{
                            color: "text.secondary",
                            "&:hover": { color: "#f44336" },
                          }}
                          title="Remove from watchlist"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WatchlistPage;
