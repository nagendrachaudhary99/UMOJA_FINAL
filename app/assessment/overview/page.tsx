'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
} from '@mui/material';
import { CheckCircle, PlayArrow, Assessment, BarChart, ArrowBack } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AssessmentService, AssessmentBucket, AssessmentSession } from '../../../lib/assessmentService';
import AssessmentForm from '../../components/AssessmentForm';

const AssessmentPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [buckets, setBuckets] = useState<AssessmentBucket[]>([]);
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [progress, setProgress] = useState<{ [bucketId: string]: { completed: boolean; progress: number } }>({});
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<AssessmentBucket | null>(null);
  const [currentSession, setCurrentSession] = useState<AssessmentSession | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Helper function to map DOB to age band
  function getAgeBandFromDOB(dob: string): string {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age >= 5 && age <= 8) return 'K-2';
    if (age >= 8 && age <= 11) return '3-5';
    if (age >= 11 && age <= 14) return 'MS';
    if (age >= 14) return 'HS+';
    return 'K-2'; // fallback
  }

  const dob = user?.publicMetadata?.dob as string | undefined;
  const ageBand = dob ? getAgeBandFromDOB(dob) : 'K-2';

  useEffect(() => {
    if (user?.id) {
      loadAssessmentData();
    }
  }, [user?.id]);

  const loadAssessmentData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const assessmentData = await AssessmentService.getAssessmentProgress(user.id, ageBand);
      setBuckets(assessmentData.buckets);
      setSessions(assessmentData.sessions);
      setProgress(assessmentData.progress);
    } catch (error) {
      console.error('Error loading assessment data:', error);
      setMessage({ type: 'error', text: 'Failed to load assessment data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = async (bucket: AssessmentBucket) => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Please sign in to start an assessment.' });
      return;
    }

    try {
      setLoading(true);
      
      // Get questions for this bucket to determine total count
      const questions = await AssessmentService.getAssessmentQuestions(bucket.id);
      
      // Create new session
      const session = await AssessmentService.createAssessmentSession(
        user.id,
        bucket.id,
        questions.length
      );
      
      setSelectedBucket(bucket);
      setCurrentSession(session);
    } catch (error) {
      console.error('Error starting assessment:', error);
      setMessage({ type: 'error', text: 'Failed to start assessment. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentComplete = async () => {
    if (!currentSession) return;
    
    try {
      await AssessmentService.completeAssessmentSession(currentSession.id);
      setMessage({ type: 'success', text: 'Assessment completed successfully!' });
      
      // Reset state and reload data
      setSelectedBucket(null);
      setCurrentSession(null);
      await loadAssessmentData();
    } catch (error) {
      console.error('Error completing assessment:', error);
      setMessage({ type: 'error', text: 'Failed to complete assessment. Please try again.' });
    }
  };

  const handleBackToOverview = () => {
    setSelectedBucket(null);
    setCurrentSession(null);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please sign in to access your assessments.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If a bucket is selected, show the assessment form
  if (selectedBucket && currentSession) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          onClick={handleBackToOverview}
          sx={{ mb: 3, textTransform: 'none' }}
          startIcon={<PlayArrow />}
        >
          Back to Assessment Overview
        </Button>
        
        <AssessmentForm
          bucket={selectedBucket}
          session={currentSession}
          onComplete={handleAssessmentComplete}
          onBack={handleBackToOverview}
        />
      </Box>
    );
  }

  const allAssessmentsCompleted = buckets.length > 0 && buckets.every(bucket => progress[bucket.id]?.completed);

  // Show assessment overview
  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/child-dashboard')}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        Back to Dashboard
      </Button>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Lexend Deca, sans-serif' }}>
        Pod Matching Assessment
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Complete these assessments to help us match you with the perfect pod! 
        Each assessment focuses on different aspects of your personality, interests, and skills.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {buckets.map((bucket) => {
          const bucketProgress = progress[bucket.id];
          const isCompleted = bucketProgress?.completed || false;
          const progressPercent = Math.min(Math.max(bucketProgress?.progress || 0, 0), 100);
          
          return (
            <Card 
              key={bucket.id} 
              sx={{ 
                flex: '1 1 300px', 
                minWidth: 300,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: '16px',
                border: isCompleted ? '2px solid #4caf50' : '1px solid #e0e0e0'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ mr: 1, color: isCompleted ? '#4caf50' : '#666' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    {bucket.name}
                  </Typography>
                  {isCompleted && (
                    <CheckCircle sx={{ color: '#4caf50' }} />
                  )}
                </Box>

                {/* Progress indicator */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {isCompleted ? 'Completed' : 'Not Started'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progressPercent)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercent} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#f5f5f5',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isCompleted ? '#4caf50' : '#2196f3'
                      }
                    }} 
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {isCompleted ? (
                    <Chip 
                      label="Completed" 
                      color="success" 
                      size="small" 
                      icon={<CheckCircle />}
                    />
                  ) : progressPercent > 0 ? (
                    <Chip 
                      label="In Progress" 
                      color="primary" 
                      size="small"
                    />
                  ) : (
                    <Chip 
                      label="Not Started" 
                      color="default" 
                      size="small"
                    />
                  )}
                </Box>

                <Button
                  variant={isCompleted ? "outlined" : "contained"}
                  fullWidth
                  onClick={() => handleStartAssessment(bucket)}
                  disabled={loading}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 600,
                    borderRadius: '8px',
                    ...(isCompleted && {
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      '&:hover': {
                        borderColor: '#388e3c',
                        backgroundColor: 'rgba(76, 175, 80, 0.04)'
                      }
                    })
                  }}
                >
                  {isCompleted ? 'Retake Assessment' : 'Start Assessment'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Assessment Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {allAssessmentsCompleted 
              ? "Congratulations! You've completed all assessments." 
              : "Complete all assessments to get your optimal pod match!"}
        </Typography>
        <Button
            variant="contained"
            size="large"
            startIcon={<BarChart />}
            disabled={!allAssessmentsCompleted || loading}
            onClick={() => router.push('/assessment/results')}
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                px: 4,
                borderRadius: '12px'
            }}
        >
            See Your Personalized Results
        </Button>
      </Box>

      <Snackbar 
        open={!!message} 
        autoHideDuration={6000} 
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setMessage(null)} 
          severity={message?.type} 
          sx={{ width: '100%' }}
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssessmentPage; 