import { Button } from "@mui/material";

/**
 * Reusable timeframe selector button used in the price chart.
 */
const SelectButton = ({ children, selected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant={selected ? "contained" : "outlined"}
      size="small"
      sx={{
        color: selected ? "background.default" : "primary.main",
        bgcolor: selected ? "primary.main" : "transparent",
        borderColor: "primary.main",
        px: { xs: 1.5, sm: 2.5 },
        fontWeight: selected ? 700 : 500,
        fontSize: { xs: "0.72rem", sm: "0.82rem" },
        "&:hover": {
          bgcolor: selected ? "primary.main" : "rgba(255,215,0,0.1)",
          borderColor: "primary.main",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default SelectButton;
