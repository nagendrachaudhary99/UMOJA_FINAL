'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Button,
  Container,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { 
  CheckCircle, 
  ArrowBack, 
  Lightbulb, 
  TrendingUp, 
  School,
  Psychology,
  Group,
  Star,
  Assessment,
  Close,
  ArrowForward,
  Diversity3
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CustomGrid from '../../components/CustomGrid';

interface Analysis {
  personality_summary: string;
  learning_style: {
    primary: string;
    secondary: string;
    description: string;
  };
  trait_scores: {
    trait: string;
    score: number;
    fullMark: number;
  }[];
  strengths: string[];
  areas_for_growth: string[];
  pod_recommendation: string;
}

const ResultsPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
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
      const response = await fetch('/api/assessment/analyze', { method: 'POST' });
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.details || 'Failed to fetch analysis.');
        } else {
            const errorText = await response.text();
            console.error("Received non-JSON response from server:", errorText);
            throw new Error('The server returned an unexpected response. Please check the server logs for more details.');
        }
      }
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
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
          Analyzing {user?.firstName || 'your'} assessment results...
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
          No analysis data available.
        </Alert>
      </Container>
    );
  }

  const buckets = [
    {
      id: 'bucket1',
      name: 'Relational and Interactional Fit',
      icon: <Psychology />,
      color: colors.primary,
      description: 'Understand how you relate to others and your preferred interaction styles',
      path: '/assessment/results/bucket1'
    },
    {
      id: 'bucket2',
      name: 'Interests, Motivation, and Growth Potential',
      icon: <Lightbulb />,
      color: colors.success,
      description: 'Discover what drives you and how you can reach your full potential',
      path: '/assessment/results/bucket2'
    },
    {
      id: 'bucket3',
      name: 'Foundational Skills and Readiness',
      icon: <School />,
      color: colors.primary,
      description: 'Explore your academic strengths and preparation for collaborative learning',
      path: '/assessment/results/bucket3'
    },
    {
      id: 'bucket4',
      name: 'Contextual and Holistic Insights',
      icon: <Diversity3 />,
      color: colors.accent,
      description: 'Understand the full context of your learning journey and environment',
      path: '/assessment/results/bucket4'
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
            onClick={() => router.push('/assessment/overview')}
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
            Back to Overview
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
                  {user?.firstName || 'Student'}'s Assessment Results
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
                Your personalized learning profile and pod recommendations, {user?.firstName || 'Student'}
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

        {/* Assessment Buckets */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            mb: 3, 
            color: colors.text,
            fontFamily: 'Lexend Deca, sans-serif'
          }}
        >
          Explore Your Assessment Results by Category
        </Typography>

        <CustomGrid container spacing={3} sx={{ mb: 4 }}>
          {buckets.map((bucket) => (
            <CustomGrid item xs={12} md={6} key={bucket.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  boxShadow: 'none', 
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: bucket.color, mr: 2 }}>
                        {bucket.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {bucket.name}
                      </Typography>
                    </Box>
                    <Chip 
                      label="Completed" 
                      color="success" 
                      size="small"
                      icon={<CheckCircle />}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {bucket.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => router.push(bucket.path)}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    View Detailed Results
                  </Button>
                </CardContent>
              </Card>
            </CustomGrid>
          ))}
        </CustomGrid>

        {/* Main Content Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            flex: '1 1 400px',
            minWidth: 400
          }
        }}>
          {/* Personality Summary */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              height: 'fit-content'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.primary, mr: 2 }}>
                <Psychology />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
                {user?.firstName || 'Student'}'s Personality & Collaboration Style
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.text,
                lineHeight: 1.6,
                fontSize: '1rem'
              }}
            >
              {analysis?.personality_summary}
            </Typography>
          </Paper>

          {/* Learning Style */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              height: 'fit-content'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.success, mr: 2 }}>
                <School />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
                {user?.firstName || 'Student'}'s Learning Style
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={`Primary: ${analysis?.learning_style.primary}`} 
                color="primary" 
                sx={{ 
                  mr: 1, 
                  mb: 1,
                  fontWeight: 600,
                  backgroundColor: colors.primary
                }} 
              />
              <Chip 
                label={`Secondary: ${analysis?.learning_style.secondary}`} 
                variant="outlined"
                sx={{ 
                  mb: 1,
                  fontWeight: 600,
                  borderColor: colors.secondary,
                  color: colors.secondary
                }}
              />
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.text,
                lineHeight: 1.6
              }}
            >
              {analysis?.learning_style.description}
            </Typography>
          </Paper>
        </Box>

        {/* Key Traits Chart */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: '12px',
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            mt: 3,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: colors.warning, mr: 2 }}>
              <Assessment />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
              {user?.firstName || 'Student'}'s Key Traits
            </Typography>
          </Box>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={analysis?.trait_scores || []}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis 
                type="category" 
                dataKey="trait" 
                stroke={colors.textSecondary}
                fontSize={12}
                fontWeight={600}
              />
              <YAxis 
                type="number" 
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
                fill={colors.primary} 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* Strengths and Growth Areas */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          '& > *': {
            flex: '1 1 400px',
            minWidth: 400
          }
        }}>
          {/* Strengths */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              height: 'fit-content'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.success, mr: 2 }}>
                <Star />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
                {user?.firstName || 'Student'}'s Strengths
              </Typography>
            </Box>
            <Stack spacing={2}>
              {analysis?.strengths.map((strength, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <CheckCircle sx={{ color: colors.success, mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text }}>
                    {strength}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {/* Areas for Growth */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: '12px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              height: 'fit-content'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.warning, mr: 2 }}>
                <TrendingUp />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
                {user?.firstName || 'Student'}'s Areas for Growth
              </Typography>
            </Box>
            <Stack spacing={2}>
              {analysis?.areas_for_growth.map((area, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '8px',
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  <TrendingUp sx={{ color: colors.warning, mr: 2, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text }}>
                    {area}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Pod Recommendation */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${colors.accent} 0%, #D4A934 100%)`,
            border: `1px solid ${colors.border}`,
            mt: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                <Group />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
                {user?.firstName || 'Student'}'s Pod Recommendation
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.text,
                lineHeight: 1.6,
                fontSize: '1.1rem',
                fontWeight: 500
              }}
            >
              {analysis?.pod_recommendation}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: -20, 
              right: -20, 
              width: 150, 
              height: 150, 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.1)',
              zIndex: 1
            }} 
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ResultsPage; 