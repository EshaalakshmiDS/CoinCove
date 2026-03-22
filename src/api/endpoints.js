const BASE_URL = "https://api.coingecko.com/api/v3";

export const CoinList = (currency) =>
  `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `${BASE_URL}/coins/${id}`;

export const HistoricalChart = (id, days, currency) =>
  `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = () =>
  `${BASE_URL}/search/trending`;
