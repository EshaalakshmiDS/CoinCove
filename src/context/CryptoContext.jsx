import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CoinList, TrendingCoins } from "../api/endpoints";

const CryptoContext = createContext();

const CURRENCY_SYMBOLS = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

export const CryptoProvider = ({ children }) => {
  const [currency, setCurrency] = useState("usd");
  const [symbol, setSymbol] = useState("$");
  const [coins, setCoins] = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(false);
  const [coinsError, setCoinsError] = useState(null);
  const [trending, setTrending] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });

  // Keep symbol in sync with currency
  useEffect(() => {
    setSymbol(CURRENCY_SYMBOLS[currency] ?? "$");
  }, [currency]);

  const fetchCoins = useCallback(async () => {
    setCoinsLoading(true);
    setCoinsError(null);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (err) {
      setCoinsError(
        err.response?.status === 429
          ? "Rate limit reached. Please wait a moment."
          : "Failed to load coins."
      );
    } finally {
      setCoinsLoading(false);
    }
  }, [currency]);

  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await axios.get(TrendingCoins());
      setTrending(data.coins?.slice(0, 10) ?? []);
    } catch {
      // Trending is non-critical — fail silently
    }
  }, []);

  // Re-fetch coins whenever currency changes
  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  // Trending fetched once on mount
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const addToWatchlist = useCallback((coinId) => {
    setWatchlist((prev) => {
      const updated = [...prev, coinId];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((coinId) => {
    setWatchlist((prev) => {
      const updated = prev.filter((id) => id !== coinId);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <CryptoContext.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        coins,
        coinsLoading,
        coinsError,
        trending,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        refetchCoins: fetchCoins,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => useContext(CryptoContext);
