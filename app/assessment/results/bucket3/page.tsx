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
  LinearProgress
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, 
  ArrowBack, 
  School,
  Assessment,
  Launch,
  Computer,
  Psychology
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CustomGrid from '../../../components/CustomGrid';

interface BucketAnalysis {
  academic_achievement?: {
    reading: number;
    math: number;
    science: number;
    social_studies: number;
  };
  digital_literacy_score?: number;
  problem_solving_approach?: string;
  collaboration_skills_score?: number;
  readiness_for_collaboration?: string;
  summary?: string;
}

const Bucket3ResultsPage = () => {
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

  // Chart colors
  const chartColors = ['#0176D3', '#04844B', '#FE9339', '#EA001E'];

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
          academic_achievement: {
            reading: 85,
            math: 78,
            science: 92,
            social_studies: 88
          },
          digital_literacy_score: 82,
          problem_solving_approach: 'Analytical and Methodical',
          collaboration_skills_score: 75,
          readiness_for_collaboration: 'High - Shows strong ability to work with others and contribute to group projects',
          summary: 'You demonstrate strong academic foundations, particularly in science and reading. Your digital literacy skills are well-developed, allowing you to effectively navigate and utilize technology for learning. You approach problems analytically, breaking them down into manageable steps. While your collaboration skills are good, there may be room for growth in how you contribute to group discussions and projects.'
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
          Analyzing {user?.firstName || 'your'} foundational skills and readiness...
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

  const academicData = [
    { name: 'Reading', value: analysis.academic_achievement?.reading || 0 },
    { name: 'Math', value: analysis.academic_achievement?.math || 0 },
    { name: 'Science', value: analysis.academic_achievement?.science || 0 },
    { name: 'Social Studies', value: analysis.academic_achievement?.social_studies || 0 }
  ];

  const assessmentLinks = [
    {
      name: "Academic Achievement",
      description: "MAP Growth/State Tests",
      url: "https://www.nwea.org/map-growth/",
      result: null
    },
    {
      name: "Digital Literacy Self-Assessment",
      description: "Evaluate your technology skills",
      url: "https://digitalliteracy.gov/",
      result: `${analysis.digital_literacy_score}/100`
    },
    {
      name: "Problem-Solving Approach",
      description: "Understand your approach to challenges",
      url: "https://www.mindtools.com/pages/article/newTMC_00.htm",
      result: analysis.problem_solving_approach
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
              background: `linear-gradient(135deg, ${colors.primary} 0%, #0054A0 100%)`, 
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
                  Bucket 3: Foundational Skills and Readiness
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
                Understanding your academic strengths and preparation for collaborative learning
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
              <School />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
              Your Academic and Skills Profile
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
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Academic Achievement
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={academicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {academicData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Digital Literacy
                  </Typography>
                  <Box sx={{ mt: 4, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Your score
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {analysis.digital_literacy_score}/100
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.digital_literacy_score || 0} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.primary
                        }
                      }} 
                    />
                  </Box>
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      What this means:
                    </Typography>
                    <Typography variant="body2">
                      Your digital literacy score indicates a strong ability to use technology effectively for learning and communication. You can navigate digital tools, evaluate online information, and use technology to enhance your learning experience.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Problem-Solving Approach
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2, mb: 3 }}>
                    <Typography variant="body1" fontWeight={600} color={colors.primary}>
                      {analysis.problem_solving_approach}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    You tend to approach problems methodically, breaking them down into smaller components and analyzing them systematically. This analytical approach helps you understand complex situations and develop effective solutions. You benefit from structured problem-solving frameworks and enjoy finding logical solutions.
                  </Typography>
                </CardContent>
              </Card>
            </CustomGrid>
            <CustomGrid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 'none', border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Collaboration Readiness
                  </Typography>
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Collaboration skills
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {analysis.collaboration_skills_score}/100
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={analysis.collaboration_skills_score || 0} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: colors.background,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: colors.success
                        }
                      }} 
                    />
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: colors.background, borderRadius: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {analysis.readiness_for_collaboration}
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
                <Computer sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 700, color: colors.text, fontFamily: 'Lexend Deca, sans-serif' }}>
                Take These Tests Yourself
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.05rem', maxWidth: '800px' }}>
              Want to learn more about your academic strengths and skills? Take these assessments to gain deeper insights.
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

export default Bucket3ResultsPage; 