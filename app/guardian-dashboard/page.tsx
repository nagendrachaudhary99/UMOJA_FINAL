'use client';

import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container, 
  Chip, 
  Card, 
  CardContent, 
  Avatar, 
  Button, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Fab,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Badge
} from '@mui/material';
import {
  Home,
  Search,
  Favorite,
  Person,
  CalendarToday,
  Class,
  UploadFile,
  Notifications,
  Add,
  School,
  Assignment,
  Schedule,
  Info,
  Message,
  AccountCircle
} from '@mui/icons-material';
import Link from 'next/link';
import ChildVerificationForm from '../components/ChildVerificationForm';

interface ChildProfile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  grade: string;
  school_name: string;
  profile_completed: boolean;
  user: {
    id: string;
    clerk_id: string;
  };
}

interface DashboardData {
  guardian: any;
  children: Array<{
    id: string;
    relationship_type: string;
    is_primary_guardian: boolean;
    child_profile: ChildProfile;
  }>;
  userRole: string;
}

// Mock reminders data
const mockReminders = [
  {
    id: 1,
    type: 'message',
    title: "New message from Emily's teacher",
    description: 'Please check the latest assignment updates.',
    date: new Date(),
    isNew: true
  },
  {
    id: 2,
    type: 'event',
    title: 'School Science Fair on 12th Oct',
    description: 'Annual science fair event',
    date: new Date(2024, 9, 12),
    isNew: false
  },
  {
    id: 3,
    type: 'document',
    title: 'Signature required for field trip waiver',
    description: 'Please review and sign the permission slip',
    date: new Date(),
    isNew: true
  }
];

const GuardianDashboard = () => {
  const { user } = useUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Color scheme matching the image
  const colors = {
    primary: '#6366f1', // Modern purple-blue
    secondary: '#8b5cf6', // Purple
    accent: '#f59e0b', // Orange/yellow
    background: '#f8fafc', // Light gray background
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  useEffect(() => {
    if (user?.id) {
      // Check if user has the correct role in metadata
      const userRole = user?.unsafeMetadata?.userType;
      
      if (userRole !== 'guardian') {
        // User doesn't have guardian role, might need to sync
        console.log('Guardian dashboard: User role mismatch, attempting sync...');
        
        const syncUserRole = async () => {
          try {
            const response = await fetch('/api/auth/sync-user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userType: 'guardian' }),
            });

            if (response.ok) {
              const { redirectUrl } = await response.json();
              if (redirectUrl !== '/guardian-dashboard') {
                // User should be redirected elsewhere
                window.location.href = redirectUrl;
                return;
              }
            }
          } catch (error) {
            console.error('Error syncing user role:', error);
          }
          
          // Continue loading dashboard data
          loadDashboardData();
        };

        syncUserRole();
      } else {
        // User has correct role, proceed normally
        loadDashboardData();
      }
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
      
      // Auto-select first child if available
      if (data.children && data.children.length > 0) {
        setSelectedChild(data.children[0].child_profile);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getProfilePicture = (child: ChildProfile) => {
    // Return a placeholder or actual profile picture
    return `https://api.dicebear.com/7.x/initials/svg?seed=${child.first_name}${child.last_name}&backgroundColor=6366f1&color=ffffff`;
  };

  const handleChildLinked = (child: any) => {
    // Refresh dashboard data after linking a child
    setShowVerificationForm(false);
    loadDashboardData();
  };

  const handleShowVerificationForm = () => {
    setShowVerificationForm(true);
  };

  const handleCancelVerification = () => {
    setShowVerificationForm(false);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: colors.background 
      }}>
        <CircularProgress size={60} sx={{ color: colors.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: colors.surface, 
          color: colors.text,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontFamily: 'Lexend Deca, sans-serif',
                color: colors.primary,
                fontSize: '1.5rem'
              }}
            >
              Umoja
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: colors.border }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.textSecondary,
                fontWeight: 500
              }}
            >
              Guardian Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="Guardian"
              sx={{
                backgroundColor: colors.primary,
                color: 'white',
                fontWeight: 600,
                fontFamily: 'Lexend Deca, sans-serif',
              }}
            />
            <UserButton />
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        {/* Show verification form if active */}
        {showVerificationForm ? (
          <ChildVerificationForm 
            onChildLinked={handleChildLinked}
            onCancel={handleCancelVerification}
          />
        ) : (
          <>
        {/* Welcome Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
            color: 'white', 
            mb: 4,
            border: `1px solid ${colors.border}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              fontFamily: 'Lexend Deca, sans-serif', 
              mb: 1,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Welcome Back!
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              opacity: 0.95,
              fontWeight: 500
            }}
          >
            Who do you want to view?
          </Typography>

          {/* Child Selection */}
          {dashboardData?.children && dashboardData.children.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
              {dashboardData.children.map((relationship) => {
                const child = relationship.child_profile;
                const isSelected = selectedChild?.id === child.id;
                return (
                  <Card
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    sx={{
                      cursor: 'pointer',
                      minWidth: 120,
                      borderRadius: 3,
                      border: isSelected ? `3px solid ${colors.accent}` : '2px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        border: `3px solid ${colors.accent}`,
                        background: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar
                        src={getProfilePicture(child)}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mx: 'auto', 
                          mb: 1,
                          border: '3px solid rgba(255,255,255,0.3)'
                        }}
                      />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 600,
                          fontSize: '1rem'
                        }}
                      >
                        {child.first_name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.75rem'
                        }}
                      >
                        {child.last_name}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
              
              {/* Add Child Button */}
              <Card
                onClick={handleShowVerificationForm}
                sx={{
                  cursor: 'pointer',
                  minWidth: 120,
                  borderRadius: 3,
                  border: '2px dashed rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    border: '2px dashed rgba(255,255,255,0.8)',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <IconButton 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)', 
                      mb: 1,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    <Add sx={{ fontSize: 30 }} />
                  </IconButton>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontWeight: 500
                    }}
                  >
                    Link Child
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                No children profiles found. Add a child to get started.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleShowVerificationForm}
                  sx={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                    '&:hover': { backgroundColor: colors.secondary }
                  }}
                >
                  Link Existing Child
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  sx={{
                    borderColor: colors.accent,
                    color: colors.accent,
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    textTransform: 'none',
                    '&:hover': { 
                      backgroundColor: colors.accent,
                      color: 'white'
                    }
                  }}
                >
                  Create New Profile
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {selectedChild && (
          <>
            {/* Dashboard Action Cards */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(4, 1fr)' 
              }, 
              gap: 3, 
              mb: 4 
            }}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: colors.primary
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Person sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.text }}>
                    Profile Info
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    View and edit profile
                  </Typography>
                </CardContent>
              </Card>

              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: colors.secondary
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Schedule sx={{ fontSize: 48, color: colors.secondary, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.text }}>
                    Schedule
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    View upcoming activities
                  </Typography>
                </CardContent>
              </Card>

              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: colors.success
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Class sx={{ fontSize: 48, color: colors.success, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.text }}>
                    Classes
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    View enrolled classes
                  </Typography>
                </CardContent>
              </Card>

              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: colors.warning
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <UploadFile sx={{ fontSize: 48, color: colors.warning, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: colors.text }}>
                    Upload Docs
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Manage documents
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Reminders & Alerts Section */}
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                background: colors.surface,
                border: `1px solid ${colors.border}`
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: colors.text,
                  mb: 3,
                  fontFamily: 'Lexend Deca, sans-serif'
                }}
              >
                Reminders & Alerts
              </Typography>

              <List sx={{ p: 0 }}>
                {mockReminders.map((reminder, index) => (
                  <React.Fragment key={reminder.id}>
                    <ListItem 
                      sx={{ 
                        px: 0,
                        py: 2,
                        borderRadius: 2,
                        '&:hover': { backgroundColor: colors.background }
                      }}
                    >
                      <ListItemIcon>
                        {reminder.type === 'message' && (
                          <Badge color="error" variant="dot" invisible={!reminder.isNew}>
                            <Message sx={{ color: colors.primary }} />
                          </Badge>
                        )}
                        {reminder.type === 'event' && (
                          <CalendarToday sx={{ color: colors.secondary }} />
                        )}
                        {reminder.type === 'document' && (
                          <Badge color="error" variant="dot" invisible={!reminder.isNew}>
                            <Assignment sx={{ color: colors.warning }} />
                          </Badge>
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600, 
                              color: colors.text,
                              mb: 0.5
                            }}
                          >
                            {reminder.title}
                          </Typography>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ color: colors.textSecondary }}
                          >
                            {reminder.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < mockReminders.length - 1 && (
                      <Divider sx={{ my: 1, borderColor: colors.border }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </>
        )}

        {/* Bottom Navigation - Mobile Only */}
        {isMobile && (
          <Paper 
            elevation={3}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              borderRadius: '20px 20px 0 0',
              background: colors.surface,
              border: `1px solid ${colors.border}`
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 2 }}>
              <IconButton sx={{ color: colors.primary }}>
                <Home />
              </IconButton>
              <IconButton sx={{ color: colors.textSecondary }}>
                <Search />
              </IconButton>
              <IconButton sx={{ color: colors.textSecondary }}>
                <Favorite />
              </IconButton>
              <IconButton sx={{ color: colors.textSecondary }}>
                <AccountCircle />
              </IconButton>
            </Box>
          </Paper>
        )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default GuardianDashboard; 