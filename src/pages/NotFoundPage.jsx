import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      gap={2}
      px={2}
    >
      <ShowChartIcon sx={{ fontSize: 64, color: "rgba(255,215,0,0.3)" }} />
      <Typography
        variant="h1"
        color="primary.main"
        fontWeight={700}
        sx={{ fontSize: { xs: "5rem", md: "8rem" }, lineHeight: 1 }}
      >
        404
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        Page not found
      </Typography>
      <Typography color="text.secondary" textAlign="center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 1 }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
