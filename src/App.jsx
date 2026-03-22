import { lazy, Suspense } from "react";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import { CryptoProvider } from "./context/CryptoContext";
import Header from "./components/Header/Header";

// Code-split each page into its own chunk
const HomePage = lazy(() => import("./pages/HomePage"));
const CoinPage = lazy(() => import("./pages/CoinPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress color="primary" />
  </Box>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CryptoProvider>
        <BrowserRouter>
          <Header />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/coins/:id" element={<CoinPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CryptoProvider>
    </ThemeProvider>
  );
};

export default App;
