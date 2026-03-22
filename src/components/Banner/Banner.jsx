import { Box, Typography } from "@mui/material";
import Carousel from "./Carousel";

const Banner = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(160deg, #14161a 0%, #1a1d24 40%, #14161a 100%)",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        textAlign: "center",
        borderBottom: "1px solid rgba(255,215,0,0.08)",
        position: "relative",
        overflow: "hidden",
        // Subtle radial glow
        "&::before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,215,0,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{
            color: "white",
            mb: 1,
            fontSize: { xs: "2.4rem", md: "3.8rem" },
            letterSpacing: "-1px",
          }}
        >
          Coin
          <Box component="span" sx={{ color: "primary.main" }}>
            Cove
          </Box>
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mb: 5,
            maxWidth: 480,
            mx: "auto",
            fontSize: { xs: "1rem", md: "1.15rem" },
            lineHeight: 1.6,
          }}
        >
          Real-time cryptocurrency prices, trends and market insights — all in
          one place.
        </Typography>

        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            letterSpacing: 3,
            mb: 2,
            display: "block",
            fontSize: "0.7rem",
          }}
        >
          Trending Today
        </Typography>

        <Carousel />
      </Box>
    </Box>
  );
};

export default Banner;
