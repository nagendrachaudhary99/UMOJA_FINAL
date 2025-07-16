'use client';

import React from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Box, Typography, AppBar, Toolbar, Container, Chip } from '@mui/material';

const GuardianDashboard = () => {
  const { user } = useUser();
  const yellow = '#f2c84b';
  const darkYellow = '#d4a934';
  const black = '#2e2e2e';
  const white = '#ffffff';

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          background: `linear-gradient(135deg, ${yellow} 0%, ${darkYellow} 100%)`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: 'Lexend Deca, sans-serif',
              fontWeight: 700,
              color: white,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            UMOJA - Guardian Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="Guardian"
              sx={{
                backgroundColor: white,
                color: black,
                fontWeight: 600,
                fontFamily: 'Lexend Deca, sans-serif',
              }}
            />
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Lexend Deca, sans-serif',
              fontWeight: 700,
              color: black,
              mb: 2,
            }}
          >
            Welcome, {user?.firstName || 'Guardian'}! 👋
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#666',
              mb: 3,
            }}
          >
            This is a template Guardian Dashboard. Authentication is working if you can see this page!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'Lexend Deca, sans-serif',
              color: '#666',
            }}
          >
            Your user type is: {String(user?.unsafeMetadata?.userType)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default GuardianDashboard; 