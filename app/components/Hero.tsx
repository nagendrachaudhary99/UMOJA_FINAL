'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Button, SvgIcon } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Hero = () => {
  const yellow = '#f2c84b';
  const black = '#2e2e2e';
  const white = '#ffffff';
  const darkYellow = '#d4a934';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${yellow} 0%, ${darkYellow} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'center',
        py: 6,
        px: 3,
        borderRadius: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          pointerEvents: 'none',
        }
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '8%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          animation: 'float 4s ease-in-out infinite 2s',
        }}
      />

      {/* Logo with enhanced styling */}
      <Box
        sx={{
          width: '200px',
          height: '200px',
          backgroundImage:
            'url(https://assets.api.uizard.io/api/cdn/stream/7436d723-93f7-488f-8318-4df97a706d44.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          borderRadius: '50%',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.1)',
          border: '4px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease',
          animation: 'logoGlow 3s ease-in-out infinite alternate',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3), 0 0 0 12px rgba(255,255,255,0.15)',
          },
          '@keyframes logoGlow': {
            '0%': { 
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.3)',
            },
            '100%': { 
              boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 0 0 8px rgba(255,255,255,0.1), 0 0 50px rgba(255,255,255,0.5)',
            },
          },
        }}
      />

      {/* Enhanced Title Section */}
      <Box sx={{ zIndex: 2 }}>
        <Typography
          variant="h1"
          sx={{
            color: white,
            fontWeight: 900,
            fontSize: { xs: '3.5rem', sm: '4rem', md: '5rem' },
            mt: 4,
            mb: 2,
            fontFamily: 'Lexend Deca, sans-serif',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            letterSpacing: '0.02em',
            background: `linear-gradient(135deg, ${white} 0%, #f8f8f8 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
           
           
          }}
        >
          UMOJA
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: black,
            fontSize: { xs: '1.2rem', sm: '1.4rem' },
            fontWeight: 600,
            fontFamily: 'Lexend Deca, sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.05em',
            opacity: 0.9,
          }}
        >
          Unity • Culture • Legacy
        </Typography>
      </Box>

      {/* Enhanced Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mt: 6,
          flexDirection: { xs: 'column', sm: 'row' },
          zIndex: 2,
        }}
      >
        <Link href="/sign-up" passHref>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: black,
              color: white,
              borderRadius: '20px',
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: 'Lexend Deca, sans-serif',
              textTransform: 'none',
              minWidth: '180px',
              boxShadow: '0 12px 24px rgba(46, 46, 46, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                transition: 'left 0.5s',
              },
              '&:hover': {
                backgroundColor: '#1f1f1f',
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(46, 46, 46, 0.5)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(-2px)',
              },
            }}
          >
            Get Started
          </Button>
        </Link>

        <Button
          variant="outlined"
          sx={{
            color: black,
            borderColor: black,
            borderWidth: '2px',
            borderRadius: '20px',
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 700,
            fontFamily: 'Lexend Deca, sans-serif',
            textTransform: 'none',
            minWidth: '180px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: black,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              transition: 'transform 0.3s ease',
              zIndex: -1,
            },
            '&:hover': {
              color: white,
              borderColor: black,
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
              '&::before': {
                transform: 'scaleX(1)',
              },
            },
            '&:active': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          Learn More
        </Button>
      </Box>

      {/* Enhanced Down Arrow */}
      <SvgIcon
        sx={{
          fontSize: '2.5rem',
          color: white,
          mt: 6,
          opacity: 0.8,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'bounce 2s infinite',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          '&:hover': {
            opacity: 1,
            transform: 'scale(1.1)',
            animation: 'none',
          },
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': { 
              transform: 'translateY(0)',
              opacity: 0.8,
            },
            '40%': { 
              transform: 'translateY(-12px)',
              opacity: 1,
            },
            '60%': { 
              transform: 'translateY(-6px)',
              opacity: 0.9,
            },
          },
        }}
      >
        <path d="M12 16.5l-6-6h12l-6 6z" />
      </SvgIcon>
    </Box>
  );
};

export default Hero; 