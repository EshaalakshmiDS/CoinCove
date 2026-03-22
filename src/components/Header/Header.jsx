import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Box,
  Button,
  useMediaQuery,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useLocation } from "react-router-dom";
import { useCrypto } from "../../context/CryptoContext";

const CURRENCIES = [
  { value: "usd", label: "USD ($)" },
  { value: "eur", label: "EUR (€)" },
  { value: "inr", label: "INR (₹)" },
];

const Header = () => {
  const { currency, setCurrency, watchlist } = useCrypto();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navBtn = (path, icon, label) => {
    const active = location.pathname === path;
    return (
      <Button
        startIcon={icon}
        onClick={() => navigate(path)}
        sx={{
          color: active ? "primary.main" : "text.secondary",
          fontWeight: active ? 700 : 400,
          "&:hover": { color: "primary.main" },
          minWidth: isMobile ? "auto" : undefined,
          px: isMobile ? 1 : 2,
        }}
      >
        {!isMobile && label}
      </Button>
    );
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "background.paper",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", userSelect: "none" }}
        >
          <ShowChartIcon sx={{ color: "primary.main", fontSize: 26 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "primary.main", letterSpacing: 1 }}
          >
            CoinCove
          </Typography>
        </Box>

        {/* Right side */}
        <Box display="flex" alignItems="center" gap={1}>
          {navBtn("/", <HomeIcon />, "Home")}

          {navBtn(
            "/watchlist",
            <Badge badgeContent={watchlist.length} color="primary" max={99}>
              <BookmarkIcon />
            </Badge>,
            "Watchlist"
          )}

          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            size="small"
            sx={{
              ml: 1,
              color: "text.primary",
              fontSize: "0.875rem",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.15)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
              "& .MuiSvgIcon-root": { color: "text.secondary" },
            }}
          >
            {CURRENCIES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
