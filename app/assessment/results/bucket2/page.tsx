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
  Lightbulb,
  School,
  Assessment,
  Launch,
  TrendingUp
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CustomGrid from '../../../components/CustomGrid';

interface BucketAnalysis {
  learning_style?: {
    primary: string;
    secondary: string;
    description: string;
  };
  interests?: string[];
  character_strengths?: string[];
  growth_mindset_score?: number;
  curiosity_score?: number;
  motivation_score?: number;
  summary?: string;
}

const Bucket2ResultsPage = () => {
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
          learning_style: {
            primary: 'Visual',
            secondary: 'Kinesthetic',
            description: 'You learn best through visual aids like charts, diagrams, and videos. You also benefit from hands-on activities that allow you to physically engage with the material.'
          },
          interests: [
            'Science and Technology',
            'Creative Arts',
            'Problem-Solving Activities',
            'Social Justice'
          ],
          character_strengths: [
            'Curiosity',
            'Creativity',
            'Perseverance',
            'Love of Learning'
          ],
          growth_mindset_score: 85,
          curiosity_score: 92,
          motivation_score: 78,
          summary: 'You demonstrate a strong natural curiosity and love of learning, with particular interests in both scientific and creative domains. Your visual learning style means you benefit from seeing concepts illustrated, while your secondary kinesthetic preference means you enjoy hands-on application of ideas. You show a strong growth mindset, believing that abilities can be developed through dedication and hard work.'
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
          Analyzing {user?.firstName || 'your'} interests and growth potential...
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

  const mindsetData = [
    { name: 'Growth Mindset', score: analysis.growth_mindset_score || 0 },
    { name: 'Curiosity', score: analysis.curiosity_score || 0 },
    { name: 'Motivation', score: analysis.motivation_score || 0 }
  ];

  const assessmentLinks = [
    {
      name: "VARK Learning Styles",
      description: "Discover how you learn best",
      url: "https://vark-learn.com/the-vark-questionnaire/",
      result: `${analysis.learning_style?.primary}-${analysis.learning_style?.secondary}`
    },
    {
      name: "O*NET Interest Profiler",
      description: "Explore your career interests",
      url: "https://www.mynextmove.org/explore/ip",
      result: null
    },
    {
      name: "VIA Character Strengths Survey",
      description: "Identify your personal strengths",
      url: "https://www.viacharacter.org/character-strengths",
      result: analysis.character_strengths?.join(', ')
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
              background: `linear-gradient(135deg, ${colors.success} 0%, #036B3D 100%)`, 
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
                  Bucket 2: Interests, Motivation, and Growth Potential
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
                Understanding what drives you and how you can reach your full potential
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
            <Avatar sx={{ bgcolor: colors.success, mr: 2 }}>
              <Lightbulb />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
              Your Interests and Growth Profile
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
                    Learning Style
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Primary: ${analysis.learning_style?.primary}`} 
                      color="primary" 
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        fontWeight: 600,
                        backgroundColor: colors.primary
                      }} 
                    />
                    <Chip 
                      label={`Secondary: ${analysis.learning_style?.secondary}`} 
                      variant="outlined"
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        borderColor: colors.secondary,
                        color: colors.secondary
                      }}
                    />
                  </Box>
                  <Typography variant="body2">
                    {analysis.learning_style?.description}
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Key Interests
                  </Typography>
                  <Stack spacing={1}>
                    {analysis.interests?.map((interest, index) => (
                      <Chip 
                        key={index}
                        label={interest} 
                        sx={{ 
                          fontWeight: 500,
                          backgroundColor: `${colors.background}`,
                          color: colors.text
                        }} 
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Character Strengths
                  </Typography>
                  <Stack spacing={1}>
                    {analysis.character_strengths?.map((strength, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          p: 1,
                          borderRadius: '8px',
                          backgroundColor: colors.background
                        }}
                      >
                        <CheckCircle sx={{ color: colors.success, mr: 2, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {strength}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Growth Mindset Metrics
                  </Typography>
                  <Box sx={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mindsetData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <XAxis 
                          dataKey="name" 
                          stroke={colors.textSecondary}
                          fontSize={12}
                          fontWeight={500}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          stroke={colors.textSecondary}
                          fontSize={12}
                        />
                        <Tooltip 
                          cursor={{fill: colors.background}}
                          contentStyle={{
                            backgroundColor: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px'
                          }}
                        />
                        <Bar 
                          dataKey="score" 
                          fill={colors.success} 
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
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
              background: `linear-gradient(135deg, ${colors.success}20 0%, ${colors.success}05 100%)`,
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
            background: `linear-gradient(135deg, ${colors.success}08 0%, ${colors.surface} 100%)`,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.warning, mr: 2, width: 56, height: 56, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <TrendingUp sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, fontFamily: 'Lexend Deca, sans-serif' }}>
                Take These Tests Yourself
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.05rem', maxWidth: '800px' }}>
              Want to learn more about your interests and growth potential? Take these assessments to gain deeper insights.
            </Typography>
          </Box>
          
          <CustomGrid container spacing={3}>
            {assessmentLinks.map((assessment, index) => (
              <CustomGrid item xs={12} md={4} key={index}>
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

export default Bucket2ResultsPage; 