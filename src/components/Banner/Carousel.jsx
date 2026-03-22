import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCrypto } from "../../context/CryptoContext";

const Carousel = () => {
  const { trending, coins, symbol } = useCrypto();
  const navigate = useNavigate();

  // Build carousel items, merging live price from coins list
  const items = useMemo(() => {
    return trending.map(({ item }) => {
      const liveCoin = coins.find((c) => c.id === item.id);
      const priceChange =
        item.data?.price_change_percentage_24h?.usd ??
        liveCoin?.price_change_percentage_24h ??
        null;
      const price = liveCoin?.current_price ?? null;

      return { ...item, price, priceChange };
    });
  }, [trending, coins]);

  // Duplicate for seamless infinite scroll
  const allItems = [...items, ...items];

  if (items.length === 0) return null;

  return (
    <Box sx={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Fade edges */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(to right, #14161a, transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: "linear-gradient(to left, #14161a, transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 2,
          animation: "scrollLeft 35s linear infinite",
          width: "max-content",
          "@keyframes scrollLeft": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          "&:hover": { animationPlayState: "paused" },
        }}
      >
        {allItems.map((coin, index) => {
          const isPositive = coin.priceChange == null || coin.priceChange >= 0;
          return (
            <Box
              key={`${coin.id}-${index}`}
              onClick={() => navigate(`/coins/${coin.id}`)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                minWidth: 110,
                p: 1.5,
                borderRadius: 2,
                border: "1px solid transparent",
                transition: "all 0.2s",
                "&:hover": {
                  border: "1px solid rgba(255,215,0,0.3)",
                  bgcolor: "rgba(255,215,0,0.06)",
                },
              }}
            >
              <img
                src={coin.thumb}
                alt={coin.name}
                width={44}
                height={44}
                style={{ borderRadius: "50%" }}
              />
              <Typography
                sx={{ color: "white", fontWeight: 600, mt: 0.75, fontSize: "0.85rem" }}
              >
                {coin.symbol.toUpperCase()}
              </Typography>
              {coin.price != null && (
                <Typography sx={{ color: "primary.main", fontSize: "0.8rem" }}>
                  {symbol}
                  {coin.price.toLocaleString(undefined, {
                    maximumFractionDigits: coin.price < 1 ? 4 : 2,
                  })}
                </Typography>
              )}
              {coin.priceChange != null && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: isPositive ? "#4caf50" : "#f44336",
                  }}
                >
                  {isPositive ? "+" : ""}
                  {coin.priceChange.toFixed(2)}%
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Carousel;
