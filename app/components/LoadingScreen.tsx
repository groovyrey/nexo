"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#111111",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {/* Background Decor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(17, 17, 17, 0) 70%)",
          filter: "blur(60px)",
        }} />
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut"
        }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Image src="/nexo.png" width={80} height={80} alt="Nexo Logo" priority />
        </motion.div>

        <Box sx={{ mt: 4, textAlign: "center", width: "240px" }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "white", 
              fontWeight: 800, 
              letterSpacing: "0.2em",
              mb: 2,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              opacity: 0.8
            }}
          >
            Initializing Nexo
          </Typography>
          
          <Box 
            sx={{ 
              height: "2px", 
              width: "100%", 
              bgcolor: "rgba(255,255,255,0.05)", 
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <motion.div
              animate={{ 
                x: ["-100%", "100%"] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{
                height: "100%",
                width: "60%",
                background: "linear-gradient(90deg, transparent, #4f46e5, transparent)",
                position: "absolute"
              }}
            />
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoadingScreen;

