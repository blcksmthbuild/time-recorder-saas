import { type PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { TopNavigation } from "../top-navigation/TopNavigation";

export const DashboardContainer = ({ children }: PropsWithChildren) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <TopNavigation />
      <Box component="main" sx={{ flex: 1, p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};
