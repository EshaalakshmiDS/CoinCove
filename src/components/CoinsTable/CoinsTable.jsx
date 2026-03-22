import { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Skeleton,
  Typography,
  InputAdornment,
  Alert,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { useNavigate } from "react-router-dom";
import { useCrypto } from "../../context/CryptoContext";
import { formatPrice, formatNumber } from "../../utils/helpers";

const ROWS_PER_PAGE = 10;

const SkeletonRow = () => (
  <TableRow>
    {Array(5)
      .fill(null)
      .map((_, j) => (
        <TableCell key={j}>
          <Skeleton variant="text" sx={{ bgcolor: "rgba(255,255,255,0.07)" }} />
        </TableCell>
      ))}
  </TableRow>
);

const CoinsTable = () => {
  const { coins, coinsLoading, coinsError, symbol, refetchCoins } = useCrypto();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filteredCoins = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, search]);

  const paginatedCoins = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredCoins.slice(start, start + ROWS_PER_PAGE);
  }, [filteredCoins, page]);

  const totalPages = Math.ceil(filteredCoins.length / ROWS_PER_PAGE);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 0.5, textAlign: "center" }}
      >
        Cryptocurrency Prices by Market Cap
      </Typography>
      <Typography
        sx={{ color: "text.secondary", textAlign: "center", mb: 3, fontSize: "0.9rem" }}
      >
        Top 100 coins · Data via CoinGecko
      </Typography>

      {coinsError && (
        <Alert
          severity="error"
          action={
            <Typography
              component="span"
              sx={{ cursor: "pointer", color: "primary.main", fontSize: "0.85rem" }}
              onClick={refetchCoins}
            >
              Retry
            </Typography>
          }
          sx={{ mb: 2 }}
        >
          {coinsError}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search by name or symbol..."
        value={search}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      />

      <TableContainer
        component={Paper}
        sx={{ bgcolor: "background.paper", borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,215,0,0.04)" }}>
              {["#", "Coin", "Price", "24h %", "Market Cap"].map(
                (header, i) => (
                  <TableCell
                    key={header}
                    align={i <= 1 ? "left" : "right"}
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {coinsLoading
              ? Array(ROWS_PER_PAGE)
                  .fill(null)
                  .map((_, i) => <SkeletonRow key={i} />)
              : paginatedCoins.map((coin) => {
                  const priceChange = coin.price_change_percentage_24h;
                  const isPositive = priceChange >= 0;

                  return (
                    <TableRow
                      key={coin.id}
                      hover
                      onClick={() => navigate(`/coins/${coin.id}`)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "rgba(255,215,0,0.04) !important",
                        },
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell sx={{ color: "text.secondary", width: 50 }}>
                        {coin.market_cap_rank}
                      </TableCell>

                      <TableCell>
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

                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatPrice(coin.current_price, symbol)}
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          size="small"
                          icon={
                            isPositive ? (
                              <TrendingUpIcon sx={{ fontSize: "14px !important" }} />
                            ) : (
                              <TrendingDownIcon sx={{ fontSize: "14px !important" }} />
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
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                      >
                        {symbol}
                        {formatNumber(coin.market_cap)}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>

      {!coinsLoading && filteredCoins.length === 0 && search && (
        <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
          No coins found for &quot;{search}&quot;
        </Typography>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => {
              setPage(val);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default CoinsTable;
