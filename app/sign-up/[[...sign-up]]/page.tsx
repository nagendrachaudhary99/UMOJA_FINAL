'use client';

import React, { useState } from 'react';
import { SignUp, useUser } from '@clerk/nextjs';
import { Box, Typography, Button, Card, CardContent, Container } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const SignUpPage = () => {
  const [userType, setUserType] = useState<'guardian' | 'child' | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const yellow = '#f2c84b';
  const darkYellow = '#d4a934';
  const black = '#2e2e2e';
  const white = '#ffffff';

  const handleUserTypeSelection = (type: 'guardian' | 'child') => {
    setUserType(type);
    setShowSignUp(true);
  };

  // Update user metadata after sign up
  React.useEffect(() => {
    if (user && userType) {
      user.update({
        unsafeMetadata: {
          userType: userType
        }
      }).then(() => {
        // Redirect based on user type
        if (userType === 'child') {
          router.push('/child-dashboard');
        } else {
          router.push('/guardian-dashboard');
        }
      });
    }
  }, [user, userType, router]);

  if (showSignUp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
        style={{ 
          background: 'linear-gradient(135deg, #f2c84b 0%, #d4a934 100%)',
          backgroundImage: `
            linear-gradient(135deg, #f2c84b 0%, #d4a934 100%),
            radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-lexend" 
            style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '-0.02em'
            }}
          >
            Begin Your Cultural Journey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-lexend max-w-3xl mx-auto leading-relaxed">
            Join UMOJA to explore your heritage, connect with your roots, and learn through engaging activities.
          </p>
        </div>
        
        <div className="w-full max-w-md">
          <SignUp 
            appearance={{
              elements: {
                rootBox: {
                  boxShadow: 'none',
                  backgroundColor: 'transparent'
                },
                card: {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  backgroundColor: 'white',
                  borderRadius: '0',
                  padding: '2rem'
                },
                formButtonPrimary: {
                  backgroundColor: '#2e2e2e',
                  fontSize: '16px',
                  padding: '12px 24px',
                  textTransform: 'none',
                  fontWeight: '600',
                  borderRadius: '0',
                  '&:hover': {
                    backgroundColor: '#1f1f1f',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                },
                formFieldInput: {
                  backgroundColor: 'white',
                  borderColor: 'rgba(0,0,0,0.1)',
                  fontSize: '16px',
                  padding: '12px 16px',
                  borderRadius: '0',
                  '&:focus': {
                    borderColor: '#2e2e2e',
                    boxShadow: '0 0 0 2px rgba(46,46,46,0.1)'
                  }
                },
                formFieldLabel: {
                  color: '#2e2e2e',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '6px'
                },
                headerTitle: {
                  color: '#2e2e2e',
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '8px'
                },
                headerSubtitle: {
                  color: '#666',
                  fontSize: '16px',
                  marginBottom: '24px'
                },
                dividerLine: {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                },
                dividerText: {
                  color: '#666'
                },
                formResendCodeLink: {
                  color: '#2e2e2e',
                  fontWeight: '500',
                  '&:hover': {
                    color: '#1f1f1f'
                  }
                },
                footerActionLink: {
                  color: '#2e2e2e',
                  fontWeight: '500',
                  '&:hover': {
                    color: '#1f1f1f'
                  }
                },
                socialButtonsBlockButton: {
                  borderColor: 'rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  padding: '12px 16px',
                  borderRadius: '0',
                  '&:hover': {
                    backgroundColor: '#f9f9f9',
                    borderColor: 'rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.2s ease'
                },
                socialButtonsBlockButtonText: {
                  color: '#2e2e2e',
                  fontSize: '16px',
                  fontWeight: '500'
                },
                socialButtonsBlockButtonArrow: {
                  color: '#2e2e2e'
                },
                formFieldSuccessText: {
                  color: '#0f766e',
                  fontSize: '14px'
                },
                formFieldErrorText: {
                  color: '#be123c',
                  fontSize: '14px'
                },
                identityPreviewText: {
                  color: '#2e2e2e',
                  fontSize: '15px'
                },
                identityPreviewEditButton: {
                  color: '#2e2e2e',
                  '&:hover': {
                    color: '#1f1f1f'
                  }
                }
              }
            }}
            signInUrl="/sign-in"
            afterSignUpUrl={`${window.location.origin}/child-dashboard`}
            redirectUrl={`${window.location.origin}/child-dashboard`}
          />
        </div>
        
        <div className="mt-8 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} UMOJA. All rights reserved.</p>
        </div>
        
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;600;700&display=swap');
          .font-lexend {
            font-family: 'Lexend Deca', sans-serif;
          }
        `}</style>
      </div>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${yellow} 0%, ${darkYellow} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
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
      <Container maxWidth="md" sx={{ zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              color: white,
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              mb: 2,
              fontFamily: 'Lexend Deca, sans-serif',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Join UMOJA
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: black,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              fontWeight: 500,
              fontFamily: 'Lexend Deca, sans-serif',
              opacity: 0.9,
            }}
          >
            Choose your role to get started
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {/* Child Card */}
          <Card
            sx={{
              width: { xs: '100%', md: '300px' },
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              backgroundColor: white,
              border: '2px solid transparent',
              willChange: 'transform',
              display: 'flex',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                border: `2px solid ${black}`,
              },
            }}
            onClick={() => handleUserTypeSelection('child')}
          >
            <CardContent sx={{ 
                p: 4, 
                textAlign: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                flexGrow: 1 
            }}>
              <Box
                sx={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: yellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <SchoolIcon sx={{ fontSize: '2.5rem', color: black }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Lexend Deca, sans-serif',
                  fontWeight: 700,
                  color: black,
                  mb: 2,
                }}
              >
                Child
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: black,
                  opacity: 0.8,
                  fontFamily: 'Lexend Deca, sans-serif',
                  mb: 3,
                  flexGrow: 1,
                }}
              >
                Explore your cultural heritage and learn about your roots
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: black,
                  color: white,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: 'Lexend Deca, sans-serif',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1f1f1f',
                  },
                }}
              >
                Sign Up as Child
              </Button>
            </CardContent>
          </Card>

          {/* Guardian Card */}
          <Card
            sx={{
              width: { xs: '100%', md: '300px' },
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              backgroundColor: white,
              border: '2px solid transparent',
              willChange: 'transform',
              display: 'flex',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
                border: `2px solid ${black}`,
              },
            }}
            onClick={() => handleUserTypeSelection('guardian')}
          >
            <CardContent sx={{ 
                p: 4, 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }}>
              <Box
                sx={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: yellow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <SupervisorAccountIcon sx={{ fontSize: '2.5rem', color: black }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Lexend Deca, sans-serif',
                  fontWeight: 700,
                  color: black,
                  mb: 2,
                }}
              >
                Guardian
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: black,
                  opacity: 0.8,
                  fontFamily: 'Lexend Deca, sans-serif',
                  mb: 3,
                  flexGrow: 1,
                }}
              >
                Guide and support children in their cultural education journey
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: black,
                  color: white,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  fontFamily: 'Lexend Deca, sans-serif',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1f1f1f',
                  },
                }}
              >
                Sign Up as Guardian
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography
            variant="body1"
            sx={{
              color: black,
              fontFamily: 'Lexend Deca, sans-serif',
              mb: 2,
            }}
          >
            Already have an account?
          </Typography>
          <Link href="/sign-in" passHref>
            <Button
              variant="outlined"
              sx={{
                color: black,
                borderColor: black,
                borderWidth: '2px',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                fontWeight: 600,
                fontFamily: 'Lexend Deca, sans-serif',
                textTransform: 'none',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: black,
                  color: white,
                },
              }}
            >
              Sign In
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUpPage; 