# CoinCove – Cryptocurrency Insights & Tracking Platform

A responsive, dark-themed web application for tracking real-time cryptocurrency prices, market trends, and portfolio watchlists. Built as a React skills showcase project.

---

## LIVE DEMO:
https://vercel.com/eshaalakshmids-projects/coin-cove
---

## Screenshots
<img width="2500" height="1122" alt="2" src="https://github.com/user-attachments/assets/ef1eeec7-4c7d-4f18-a0c7-6002c3039c3e" />
<img width="2518" height="1090" alt="1" src="https://github.com/user-attachments/assets/d248f2bc-203c-4912-98fd-3f6049b7ca0c" />
<img width="2552" height="1062" alt="4" src="https://github.com/user-attachments/assets/0038e297-47fa-4319-b3c6-b1b04ff47568" />
<img width="2512" height="1122" alt="3" src="https://github.com/user-attachments/assets/c5b9fe6e-aaf1-4d06-814d-e7f70dc47ddf" />


---

## Features

- **Real-time prices** — Top 100 coins by market cap, refreshed on every load and currency change
- **Trending carousel** — Auto-scrolling banner of today's trending coins (pauses on hover)
- **Interactive price charts** — Line chart with 24H / 7D / 30D / 1Y timeframe selector, trend-colored (green/red) fill
- **Search & paginate** — Filter coins by name or symbol; 10 coins per page
- **Currency toggle** — Switch between USD, EUR, and INR globally; every value on every page updates instantly
- **Coin detail page** — Logo, rank, current price, 24h change, market cap, volume, high/low, supply, and expandable description
- **Watchlist** — Add/remove coins with one click; persisted across sessions via `localStorage`; dedicated page with empty state
- **Skeleton loaders** — All data-loading states covered with MUI Skeleton components
- **Rate limit handling** — Graceful error messages with retry on CoinGecko 429 responses
- **Code-split routing** — Each page loaded lazily via `React.lazy` + `Suspense`
- **Fully responsive** — Mobile-first layout using MUI Grid and `useMediaQuery`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| UI Library | Material UI (MUI) v5 |
| Charts | Chart.js 4 + react-chartjs-2 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| State Management | React Context API |
| Data Source | CoinGecko API (free tier, no key required) |

---

## Project Structure

```
src/
├── api/
│   └── endpoints.js          # All CoinGecko API URL builders
├── context/
│   └── CryptoContext.jsx     # Global state — currency, coins, trending, watchlist
├── hooks/
│   └── useFetch.js           # Reusable data-fetching hook (loading / error / refetch)
├── utils/
│   └── helpers.js            # formatPrice, formatNumber utilities
├── components/
│   ├── Header/               # Sticky nav, currency select, watchlist badge
│   ├── Banner/               # Hero section + auto-scrolling trending carousel
│   ├── CoinsTable/           # Searchable, paginated coins table with skeleton loaders
│   └── CoinInfo/             # Price chart + SelectButton timeframe controls
└── pages/
    ├── HomePage.jsx          # Banner + CoinsTable
    ├── CoinPage.jsx          # Coin stats sidebar + price chart
    ├── WatchlistPage.jsx     # Tracked coins table
    └── NotFoundPage.jsx      # 404 fallback
```

---

## Key Design Decisions

### Context API for global state
`CryptoContext` holds the selected currency, coin list, trending coins, and watchlist. When the user switches currency (e.g. USD → INR), a single `setCurrency` call triggers a re-fetch in the context and every consuming component — prices, charts, stats — updates simultaneously with no prop-drilling.

### Custom `useFetch` hook
Wraps Axios with `useState` + `useEffect` + `useCallback`. The `useCallback` memoizes the fetch function so `useEffect` only re-runs when the URL genuinely changes, not on every render. Also handles CoinGecko's 429 rate-limit response with a human-readable error message.

### Code splitting with `React.lazy`
Each page is a separate JS chunk loaded only when navigated to. This reduces initial bundle size and demonstrates awareness of production performance patterns.

### Chart trend coloring
The price chart dynamically colors its line and fill green or red depending on whether the selected timeframe shows a price increase or decrease — not hardcoded, calculated from the first and last data points.

### Watchlist persistence
Watchlist state is initialized from `localStorage` via a lazy initializer in `useState`, and every add/remove is mirrored to `localStorage` inside a `useCallback`. No effect needed — reads and writes stay in sync without extra renders.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/EshaalakshmiDS/CoinCove.git
cd CoinCove

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## API Reference

All data is sourced from the [CoinGecko API v3](https://www.coingecko.com/en/api) (free tier — no API key required).

| Endpoint | Used for |
|---|---|
| `/coins/markets` | Top 100 coins list with prices |
| `/coins/{id}` | Single coin stats and description |
| `/coins/{id}/market_chart` | Historical price data for charts |
| `/search/trending` | Trending coins for carousel |

> **Note:** The free tier has a rate limit of ~10–30 calls/minute. The app handles 429 errors gracefully.

---

## What I'd add next

- [ ] Global market stats bar (total market cap, BTC dominance)
- [ ] Portfolio tracker with cost-basis and P&L calculation
- [ ] Price alerts via browser Notification API
- [ ] Compare mode — overlay two coins on the same chart
