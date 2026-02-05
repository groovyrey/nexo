"use client";

import { Box, LinearProgress } from "@mui/material";
import Image from "next/image";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const PulsingImage = styled(Image)`
  animation: ${pulse} 2s infinite;
`;

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#111111",
      }}
    >
      <PulsingImage src="/nexo.png" width={64} height={64} alt="Nexo Logo" />
      <Box sx={{ width: "200px", marginTop: "20px" }}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
