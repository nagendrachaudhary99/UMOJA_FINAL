'use client';

import React, { useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container, 
  Chip, 
  Button, 
  Card, 
  CardContent, 
  Paper, 
  LinearProgress, 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem,
  Divider,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Assessment, 
  Person, 
  Notifications, 
  Group, 
  HelpOutline,
  School,
  TrendingUp,
  CalendarToday,
  CheckCircle,
  Schedule,
  Star,
  ArrowForward,
  Close
} from '@mui/icons-material';
import Link from 'next/link';
import ChildProfileForm from '../components/ChildProfileForm';

const mockPod = {
  name: 'STEM Innovators',
  status: 'Matched',
  members: ['Alex', 'Jordan', 'Taylor'],
  nextStep: 'First pod meeting on Monday, 10am',
  progress: 85,
};

const mockNotifications = [
  { id: 1, message: 'Your pod match is ready! Check your Pod Match card.', date: 'Today', type: 'success' },
  { id: 2, message: 'Assessment completed successfully.', date: 'Yesterday', type: 'info' },
  { id: 3, message: 'New learning resources available.', date: '2 days ago', type: 'warning' },
];

const mockActivity = [
  { id: 1, action: 'Completed assessment', date: 'Today', icon: <CheckCircle color="success" /> },
  { id: 2, action: 'Updated profile', date: 'Yesterday', icon: <Person color="primary" /> },
  { id: 3, action: 'Joined Umoja', date: '2 days ago', icon: <School color="secondary" /> },
];

const ChildDashboard = () => {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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
    umojaYellow: '#f2c84b', // Hero section yellow
  };

  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const handleNotifMenu = (event: React.MouseEvent<HTMLElement>) => setNotifAnchorEl(event.currentTarget);
  const handleNotifClose = () => setNotifAnchorEl(null);
  const handleProfileModalOpen = () => setProfileModalOpen(true);
  const handleProfileModalClose = () => setProfileModalOpen(false);

  // Calculate real progress percentages
  const calculateProfileCompletion = () => {
    // This would typically come from user profile data
    // For now, we'll use a more realistic calculation based on available data
    const hasFirstName = !!user?.firstName;
    const hasLastName = !!user?.lastName;
    const hasEmail = !!user?.emailAddresses?.length;
    const hasProfileImage = !!user?.imageUrl;
    
    const completedFields = [hasFirstName, hasLastName, hasEmail, hasProfileImage].filter(Boolean).length;
    return Math.round((completedFields / 4) * 100);
  };

  const calculateAssessmentCompletion = () => {
    // This would typically come from assessment data
    // For now, we'll use a placeholder that could be updated with real data
    // You can replace this with actual assessment completion logic
    const totalAssessments = 4; // Total number of assessments
    const completedAssessments = 4; // Number of completed assessments - assuming all are completed
    return Math.round((completedAssessments / totalAssessments) * 100);
  };

  const calculatePodMatchProgress = () => {
    // This would typically come from pod matching data
    // For now, we'll use the mock data to determine progress
    if (mockPod.status === 'Matched') {
      return 100;
    } else if (mockPod.status === 'In Progress') {
      return 50; // Assuming 50% progress when in progress
    } else {
      return 0; // Not started
    }
  };

  const profileCompletion = calculateProfileCompletion();
  const assessmentCompletion = calculateAssessmentCompletion();
  const podMatchProgress = calculatePodMatchProgress();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Professional AppBar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: colors.surface, 
          color: colors.text,
          borderBottom: `1px solid ${colors.border}`,
          height: 64
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          height: '100%'
        }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontFamily: 'Lexend Deca, sans-serif',
                color: colors.umojaYellow,
                fontSize: '1.25rem',
                letterSpacing: '-0.5px'
              }}
            >
              Umoja
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: colors.border }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.textSecondary,
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              Child Dashboard
            </Typography>
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton 
              onClick={handleNotifMenu}
              sx={{ 
                color: colors.textSecondary,
                '&:hover': { 
                  backgroundColor: colors.background,
                  color: colors.primary 
                }
              }}
            >
              <Badge badgeContent={mockNotifications.length} color="error">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
            
            <Menu 
              anchorEl={notifAnchorEl} 
              open={Boolean(notifAnchorEl)} 
              onClose={handleNotifClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 320,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`
                }
              }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.text }}>
                  Notifications
                </Typography>
              </Box>
              {mockNotifications.map(n => (
                <MenuItem 
                  key={n.id} 
                  onClick={handleNotifClose}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    borderBottom: `1px solid ${colors.background}`,
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2" sx={{ mb: 0.5, color: colors.text }}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {n.date}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              {mockNotifications.length === 0 && (
                <MenuItem disabled sx={{ py: 2, px: 2 }}>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    No notifications
                  </Typography>
                </MenuItem>
              )}
            </Menu>

            {/* User Profile with Clerk Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: {
                      width: 32,
                      height: 32,
                    }
                  }
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  color: colors.text,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                {user?.firstName || 'User'}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 4 }, 
            borderRadius: '12px', 
            background: `linear-gradient(135deg, ${colors.primary} 0%, #005FB2 100%)`, 
            color: 'white', 
            mb: 4,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                fontFamily: 'Lexend Deca, sans-serif', 
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}
            >
              Welcome back, {user?.firstName || 'Student'}! 👋
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                opacity: 0.95,
                fontSize: '1.1rem'
              }}
            >
              {mockPod.status === 'Matched' 
                ? `You're matched with the ${mockPod.name} pod` 
                : 'Complete your profile and assessment to get matched with your perfect pod!'
              }
            </Typography>
            <Chip 
              label={mockPod.status === 'Matched' ? 'Matched' : 'In Progress'} 
              color={mockPod.status === 'Matched' ? 'success' : 'warning'}
              sx={{ 
                fontWeight: 600,
                backgroundColor: mockPod.status === 'Matched' ? '#04844B' : '#FE9339',
                color: 'white'
              }}
            />
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

        {/* Quick Actions */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': {
            flex: '1 1 280px',
            minWidth: 280,
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' }
          }
        }}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              background: colors.surface,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                borderColor: colors.primary
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Person sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Lexend Deca, sans-serif', color: colors.text }}>
                  Profile
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                  Update personal details 
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ArrowForward />}
                onClick={handleProfileModalOpen}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  borderColor: colors.primary,
                  color: colors.primary,
                  '&:hover': { 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }
                }}
              >
                Manage Profile
              </Button>
            </CardContent>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              background: colors.surface,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                borderColor: colors.success
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Assessment sx={{ fontSize: 48, color: colors.success, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Lexend Deca, sans-serif', color: colors.text }}>
                  Assessments
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                  Complete your learning assessments
                </Typography>
              </Box>
              <Link href="/assessment" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Assessment />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    backgroundColor: colors.success,
                    '&:hover': { backgroundColor: '#036B3F' }
                  }}
                >
                  Start Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              background: colors.surface,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                borderColor: colors.primary
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Group sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Lexend Deca, sans-serif', color: colors.text }}>
                  Pod Match
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                  View your pod and team members
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Group />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  borderColor: colors.primary,
                  color: colors.primary,
                  '&:hover': { 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }
                }}
              >
                View Pod
              </Button>
            </CardContent>
          </Card>

          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: `1px solid ${colors.border}`,
              borderRadius: '12px',
              background: colors.surface,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                borderColor: colors.warning
              }
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <HelpOutline sx={{ fontSize: 48, color: colors.warning, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: 'Lexend Deca, sans-serif', color: colors.text }}>
                  Support
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 3 }}>
                  Get help and contact support
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<HelpOutline />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  borderColor: colors.warning,
                  color: colors.warning,
                  '&:hover': { 
                    backgroundColor: colors.warning,
                    color: 'white'
                  }
                }}
              >
                Get Help
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Progress and Status Section */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': {
            flex: '1 1 400px',
            minWidth: 400
          }
        }}>
          {/* Pod Match Status */}
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
              <Group sx={{ color: colors.primary, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
                Pod Match Status
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, color: colors.text }}>
                {mockPod.status === 'Matched' ? mockPod.name : 'Not matched yet'}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                Members: {mockPod.members.join(', ')}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                Next Step: {mockPod.nextStep}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={mockPod.status} 
                color={mockPod.status === 'Matched' ? 'success' : 'warning'}
                sx={{ fontWeight: 600 }}
              />
              <Button 
                variant="outlined" 
                size="small" 
                sx={{ 
                  textTransform: 'none', 
                  borderRadius: '8px',
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                View Details
              </Button>
            </Box>
          </Paper>

          {/* Progress Overview */}
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
              <TrendingUp sx={{ color: colors.success, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
                Progress Overview
              </Typography>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text }}>
                    Profile Completion
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                    {profileCompletion}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={profileCompletion} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: colors.background,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.primary
                    }
                  }} 
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text }}>
                    Assessment Completion
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.success }}>
                    {assessmentCompletion}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={assessmentCompletion} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: colors.background,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.success
                    }
                  }} 
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.text }}>
                    Pod Match Progress
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: colors.success }}>
                    {podMatchProgress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={podMatchProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: colors.background,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors.success
                    }
                  }} 
                />
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* Notifications & Activity Section */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': {
            flex: '1 1 400px',
            minWidth: 400
          }
        }}>
          {/* Notifications */}
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
              <Notifications sx={{ color: colors.primary, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
                Recent Notifications
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              {mockNotifications.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.textSecondary, textAlign: 'center', py: 2 }}>
                  No new notifications
                </Typography>
              ) : (
                mockNotifications.map(n => (
                  <Box 
                    key={n.id} 
                    sx={{ 
                      p: 2, 
                      borderRadius: '8px',
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 0.5, color: colors.text, fontWeight: 500 }}>
                      {n.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {n.date}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>

          {/* Recent Activity */}
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
              <CalendarToday sx={{ color: colors.success, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
                Recent Activity
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              {mockActivity.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.textSecondary, textAlign: 'center', py: 2 }}>
                  No recent activity
                </Typography>
              ) : (
                mockActivity.map(a => (
                  <Box 
                    key={a.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2, 
                      borderRadius: '8px',
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    {a.icon}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 500 }}>
                        {a.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {a.date}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Paper>
        </Box>
      </Container>

      {/* Profile Modal */}
      <Dialog
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: `1px solid ${colors.border}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ color: colors.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: colors.text }}>
              Manage Your Profile
            </Typography>
          </Box>
          <IconButton
            onClick={handleProfileModalClose}
            sx={{ color: colors.textSecondary }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ChildProfileForm />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleProfileModalClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              borderColor: colors.primary,
              color: colors.primary
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildDashboard; 