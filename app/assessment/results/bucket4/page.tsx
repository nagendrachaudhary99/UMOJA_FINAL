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
  useMediaQuery,
  Divider
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, 
  ArrowBack, 
  Assessment,
  Launch,
  Diversity3,
  Public,
  Favorite
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import CustomGrid from '../../../components/CustomGrid';

interface BucketAnalysis {
  cultural_identity?: string;
  family_insights?: string[];
  teacher_insights?: string[];
  community_involvement?: string;
  learning_environment_preferences?: string;
  social_emotional_needs?: string;
  summary?: string;
}

const Bucket4ResultsPage = () => {
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
          cultural_identity: 'You identify strongly with your cultural heritage and value diverse perspectives. You enjoy learning about different cultures and incorporating elements from various traditions into your learning experience.',
          family_insights: [
            'Supportive home environment that values education',
            'Parents are actively involved in educational journey',
            'Family emphasizes both academic achievement and character development',
            'Home environment provides structure and routine'
          ],
          teacher_insights: [
            'Works well independently and in groups',
            'Shows leadership potential in collaborative settings',
            'Benefits from visual learning aids and hands-on activities',
            'Responds well to positive reinforcement and constructive feedback'
          ],
          community_involvement: 'Moderate participation in community activities, with interest in service-oriented projects that align with personal values.',
          learning_environment_preferences: 'Thrives in structured environments with clear expectations, but also appreciates flexibility for creative exploration. Prefers spaces with minimal distractions and access to technology.',
          social_emotional_needs: 'Benefits from regular check-ins and opportunities to process emotions. Values supportive relationships with peers and mentors.',
          summary: 'Your holistic profile reveals a student who thrives in supportive, structured environments while also valuing creative freedom. You have a strong cultural identity that informs your perspective and learning approach. Both family and teacher insights highlight your ability to work well independently and collaboratively, with particular strengths in visual and hands-on learning. You benefit from environments that provide both structure and opportunities for creative expression.'
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
          Analyzing {user?.firstName || 'your'} contextual and holistic insights...
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
      name: "Cultural Identity Reflection",
      description: "Explore your cultural background and influences",
      url: "https://www.tolerance.org/classroom-resources/tolerance-lessons/what-is-cultural-identity",
      result: null
    },
    {
      name: "Family/Teacher Insights",
      description: "Gather perspectives from important adults in your life",
      url: "https://casel.org/fundamentals-of-sel/how-does-sel-support-educational-equity-and-excellence/family-community-partnerships/",
      result: null
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
              background: `linear-gradient(135deg, ${colors.accent} 0%, #D4A934 100%)`, 
              color: colors.text,
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
                  Bucket 4: Contextual and Holistic Insights
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
                Understanding the full context of your learning journey and environment
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
                background: 'rgba(255,255,255,0.2)',
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
            <Avatar sx={{ bgcolor: colors.accent, mr: 2 }}>
              <Diversity3 />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
              Your Holistic Profile
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
                    Cultural Identity
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2 }}>
                    <Typography variant="body1">
                      {analysis.cultural_identity}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Learning Environment Preferences
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2 }}>
                    <Typography variant="body1">
                      {analysis.learning_environment_preferences}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Family Insights
                    </Typography>
                    <Chip 
                      label="From Parents/Guardians" 
                      size="small"
                      sx={{ 
                        backgroundColor: colors.background,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  <Stack spacing={1}>
                    {analysis.family_insights?.map((insight, index) => (
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
                          {insight}
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Teacher Insights
                    </Typography>
                    <Chip 
                      label="From Educators" 
                      size="small"
                      sx={{ 
                        backgroundColor: colors.background,
                        fontWeight: 500
                      }}
                    />
                  </Box>
                  <Stack spacing={1}>
                    {analysis.teacher_insights?.map((insight, index) => (
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
                        <CheckCircle sx={{ color: colors.primary, mr: 2, fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {insight}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12}>
              <Card sx={{ boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Social-Emotional Needs
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2, mb: 3 }}>
                    <Typography variant="body1">
                      {analysis.social_emotional_needs}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Community Involvement
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2 }}>
                    <Typography variant="body1">
                      {analysis.community_involvement}
                    </Typography>
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
              background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.accent}05 100%)`,
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
            background: `linear-gradient(135deg, ${colors.accent}08 0%, ${colors.surface} 100%)`,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: colors.warning, mr: 2, width: 56, height: 56, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <Public sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, fontFamily: 'Lexend Deca, sans-serif' }}>
                Take These Tests Yourself
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.05rem', maxWidth: '800px' }}>
              Want to learn more about your cultural identity and gather insights from important people in your life? Explore these resources.
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
                      Explore Resource
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

export default Bucket4ResultsPage; 