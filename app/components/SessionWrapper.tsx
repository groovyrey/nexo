"use client";

import { useAuthContext } from "@/lib/context";
import { ReactNode } from "react";
import LoadingScreen from "./LoadingScreen";
import { Box } from "@mui/material"; // Import Box

const SessionWrapper = ({ children }: { children: ReactNode }) => {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <Box sx={{ height: "100vh", width: "100vw" }}> {/* Set full viewport height and width */}
        <LoadingScreen />
      </Box>
    );
  }

  return <>{children}</>;
};

export default SessionWrapper;
