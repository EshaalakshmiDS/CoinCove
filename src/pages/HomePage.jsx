import { Box } from "@mui/material";
import Banner from "../components/Banner/Banner";
import CoinsTable from "../components/CoinsTable/CoinsTable";

const HomePage = () => {
  return (
    <Box>
      <Banner />
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 1400, mx: "auto" }}>
        <CoinsTable />
      </Box>
    </Box>
  );
};

export default HomePage;
