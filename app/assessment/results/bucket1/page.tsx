'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Container,
  Stack,
  Card,
  CardContent,
  Avatar,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, 
  ArrowBack, 
  Psychology,
  Group,
  Assessment,
  Launch
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CustomGrid from '../../../components/CustomGrid';

interface BucketAnalysis {
  communication_style?: string;
  social_preference?: string;
  conflict_resolution_style?: string;
  temperament?: string;
  myers_briggs?: string;
  interaction_style?: string;
  summary?: string;
}

const Bucket1ResultsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [analysis, setAnalysis] = useState<BucketAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Salesforce-inspired color palette
  const colors = {
    primary: '#0176D3', // Salesforce blue
    secondary: '#706E6B', // Salesforce gray
    success: '#04844B', // Salesforce green
    warning: '#FE9339', // Salesforce orange
    error: '#EA001E', // Salesforce red
    background: '#F3F2F2', // Salesforce background
    surface: '#FFFFFF',
    text: '#1B1B1B',
    textSecondary: '#706E6B',
    border: '#DDDBDA',
    accent: '#F2C84B', // Umoja yellow
  };

  useEffect(() => {
    if (user) {
      fetchAnalysis();
    }
  }, [user]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you would fetch the specific bucket data
      // For now, we'll simulate with mock data
      setTimeout(() => {
        setAnalysis({
          communication_style: 'Expressive and Direct',
          social_preference: 'Balanced mix of group and individual activities',
          conflict_resolution_style: 'Collaborative',
          temperament: 'Sanguine-Choleric',
          myers_briggs: 'ENFJ',
          interaction_style: 'In-Charge',
          summary: 'You have a naturally expressive and direct communication style. You tend to be energized by social interactions while also valuing some alone time for reflection. When conflicts arise, you prefer to address them directly and work collaboratively toward solutions that benefit everyone involved. Your temperament combines enthusiasm and goal-orientation, making you both people-focused and achievement-driven.'
        });
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        flexDirection: 'column', 
        gap: 3,
        backgroundColor: colors.background
      }}>
        <CircularProgress size={60} sx={{ color: colors.primary }} />
        <Typography variant="h6" sx={{ color: colors.textSecondary, fontWeight: 500 }}>
          Analyzing {user?.firstName || 'your'} relational and interactional fit...
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
          This may take a few moments
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            '& .MuiAlert-icon': { color: colors.error }
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!analysis) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            '& .MuiAlert-icon': { color: colors.primary }
          }}
        >
          No analysis data available for this bucket.
        </Alert>
      </Container>
    );
  }

  const assessmentLinks = [
    {
      name: "Four Temperaments",
      description: "Discover your temperament type",
      url: "https://bestpersonalitytests.com/four-temperaments-test/",
      result: analysis.temperament
    },
    {
      name: "Myers Briggs",
      description: "Understand your personality type",
      url: "https://www.yourselfirst.com/personality?utm_source=google&utm_medium=cpc&utm_campaign=Personality_Type&utm_term=myers+briggs+test+free&utm_ad_id=713938297840&utm_adset_id=167256753723&utm_campaign_id=21708060660&utm_adset_name=Personality_Type&utm_campaign_name=Personality_Type&gclid=CjwKCAjwx8nCBhAwEiwA_z__0x6MFx1ZVRznsOE-LgR1ku-drjLwy7nIVWBtpJ9PC5HHfVdPgCvuTxoC2WEQAvD_BwE&gbraid=0AAAAA-F0vowoD8gZwyhh9wDzwD25zRGhF&uuid=5d2628bf-e7d2-482d-9335-8cac9876f785",
      result: analysis.myers_briggs
    },
    {
      name: "Social Preferences/Interaction Style",
      description: "Learn about your social interaction preferences",
      url: "https://www.idrlabs.com/interactional-styles/test.php",
      result: analysis.interaction_style
    },
    {
      name: "Conflict Resolution Style",
      description: "Understand how you approach conflicts",
      url: "https://www.usip.org/public-education-new/conflict-styles-assessment",
      result: analysis.conflict_resolution_style
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: colors.background,
      pb: 6
    }}>
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/assessment/results')}
            sx={{ 
              mb: 3, 
              textTransform: 'none',
              fontWeight: 600,
              color: colors.primary,
              '&:hover': {
                backgroundColor: colors.background
              }
            }}
          >
            Back to Results Overview
          </Button>

          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 4 }, 
              borderRadius: '12px', 
              background: `linear-gradient(135deg, ${colors.primary} 0%, #005FB2 100%)`, 
              color: 'white',
              border: `1px solid ${colors.border}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 32, mr: 2 }} />
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700, 
                    fontFamily: 'Lexend Deca, sans-serif',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  Bucket 1: Relational and Interactional Fit
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.95,
                  fontWeight: 400,
                  fontSize: '1.1rem'
                }}
              >
                Understanding how you relate to others and your preferred interaction styles
              </Typography>
            </Box>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: -20, 
                right: -20, 
                width: 200, 
                height: 200, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.1)',
                zIndex: 1
              }} 
            />
          </Paper>
        </Box>

        {/* Main Content */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: '12px',
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            mb: 4
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: colors.primary, mr: 2 }}>
              <Psychology />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
              Your Relational Profile
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.text,
              lineHeight: 1.6,
              fontSize: '1rem',
              mb: 3
            }}
          >
            {analysis.summary}
          </Typography>

          <CustomGrid container spacing={3} sx={{ mt: 2 }}>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Communication Style
                  </Typography>
                  <Typography variant="body1">
                    {analysis.communication_style}
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Social Preference
                  </Typography>
                  <Typography variant="body1">
                    {analysis.social_preference}
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Conflict Resolution Style
                  </Typography>
                  <Typography variant="body1">
                    {analysis.conflict_resolution_style}
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Temperament
                  </Typography>
                  <Typography variant="body1">
                    {analysis.temperament}
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
          </CustomGrid>
        </Paper>

        {/* Information about assessments */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${colors.background} 0%, #FFFFFF 100%)`,
            border: `1px solid ${colors.border}`,
            mb: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: colors.text }}>
              Assessment Predictions
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '1.1rem', color: colors.text }}>
              These questions are designed to give predictive answers to outcomes on the following assessments.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: colors.textSecondary }}>
              Click each assessment to find out more information
            </Typography>
          </Box>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -30, 
              right: -30, 
              width: 150, 
              height: 150, 
              borderRadius: '50%', 
              background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.primary}05 100%)`,
              zIndex: 1
            }} 
          />
        </Paper>

        {/* Assessment Links */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${colors.primary}08 0%, ${colors.surface} 100%)`,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.warning, mr: 2, width: 56, height: 56, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <Group sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, fontFamily: 'Lexend Deca, sans-serif' }}>
                Take These Tests Yourself
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.05rem', maxWidth: '800px' }}>
              Want to learn more about yourself? Take these assessments to gain deeper insights into your personality and interaction styles.
            </Typography>
          </Box>
          
          <CustomGrid container spacing={3}>
            {assessmentLinks.map((assessment, index) => (
              <CustomGrid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  boxShadow: 'none', 
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {assessment.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {assessment.description}
                        </Typography>
                      </Box>
                      {assessment.result && (
                        <Chip 
                          label={`Your result: ${assessment.result}`} 
                          color="primary" 
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Box>
                    <Button 
                      variant="outlined" 
                      endIcon={<Launch />}
                      component={Link}
                      href={assessment.url}
                      target="_blank"
                      rel="noopener"
                      sx={{ 
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Take Assessment
                    </Button>
                  </CardContent>
                </Card>
              </CustomGrid>
            ))}
          </CustomGrid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Bucket1ResultsPage; 