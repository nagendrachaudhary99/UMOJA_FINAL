'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  Checkbox,
  FormGroup,
  Rating,
  Divider,
} from '@mui/material';
import { ArrowBack, ArrowForward, Save, CheckCircle } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import { 
  AssessmentService, 
  AssessmentBucket, 
  AssessmentSession, 
  AssessmentQuestion 
} from '../../lib/assessmentService';

interface AssessmentFormProps {
  bucket: AssessmentBucket;
  session: AssessmentSession;
  onComplete: () => void;
  onBack: () => void;
}

const AssessmentForm = ({ bucket, session, onComplete, onBack }: AssessmentFormProps) => {
  const { user } = useUser();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [bucket.id]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await AssessmentService.getAssessmentQuestions(bucket.id);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
      setMessage({ type: 'error', text: 'Failed to load assessment questions.' });
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasResponse = currentQuestion && responses[currentQuestion.id];

  const handleResponseChange = (value: any) => {
    if (!currentQuestion) return;
    
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = async () => {
    if (!currentQuestion || !user?.id) return;

    try {
      setSaving(true);
      
      // Save current response
      let responseData: any = {};
      
      if (currentQuestion.question_type === 'likert_scale') {
        responseData.response_numeric = responses[currentQuestion.id];
      } else if (currentQuestion.question_type === 'multiple_choice') {
        responseData.response_value = responses[currentQuestion.id];
      } else if (currentQuestion.question_type === 'open_ended') {
        responseData.response_value = responses[currentQuestion.id];
      } else if (currentQuestion.question_type === 'image_selection') {
        responseData.response_json = responses[currentQuestion.id];
      }

      await AssessmentService.saveAssessmentResponse(
        session.id,
        currentQuestion.id,
        user.id,
        responseData
      );

      // Update session progress
      const answeredCount = Object.keys(responses).length + 1;
      await AssessmentService.updateSessionProgress(session.id, answeredCount);

      if (isLastQuestion) {
        // Complete the assessment
        await AssessmentService.completeAssessmentSession(session.id);
        setMessage({ type: 'success', text: 'Assessment completed successfully!' });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error saving response:', error);
      setMessage({ type: 'error', text: 'Failed to save response. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.question_type) {
      case 'multiple_choice':
        return (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              {currentQuestion.question_text}
            </FormLabel>
            <RadioGroup
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponseChange(e.target.value)}
            >
              {currentQuestion.response_options?.map((option: any, index: number) => (
                <FormControlLabel
                  key={index}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'likert_scale':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {currentQuestion.question_text}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Rate how much you agree with this statement:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Strongly Disagree</Typography>
              <Rating
                value={responses[currentQuestion.id] || 0}
                onChange={(_, value) => handleResponseChange(value || 0)}
                max={5}
                size="large"
              />
              <Typography variant="body2" color="text.secondary">Strongly Agree</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
              <Typography variant="caption" color="text.secondary">1</Typography>
              <Typography variant="caption" color="text.secondary">2</Typography>
              <Typography variant="caption" color="text.secondary">3</Typography>
              <Typography variant="caption" color="text.secondary">4</Typography>
              <Typography variant="caption" color="text.secondary">5</Typography>
            </Box>
          </Box>
        );

      case 'open_ended':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {currentQuestion.question_text}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Please share your thoughts..."
              value={responses[currentQuestion.id] || ''}
              onChange={(e) => handleResponseChange(e.target.value)}
            />
          </Box>
        );

      case 'image_selection':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {currentQuestion.question_text}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the image that most appeals to you:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {currentQuestion.response_options?.map((option: any, index: number) => (
                <Card
                  key={index}
                  sx={{
                    flex: '1 1 200px',
                    minWidth: 200,
                    cursor: 'pointer',
                    border: responses[currentQuestion.id] === option.value ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                    }
                  }}
                  onClick={() => handleResponseChange(option.value)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 120,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {option.imageDescription || 'Image Placeholder'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      default:
        return (
          <Typography variant="h6" color="error">
            Unknown question type: {currentQuestion.question_type}
          </Typography>
        );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Lexend Deca, sans-serif' }}>
          {bucket.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {bucket.description}
        </Typography>
        
        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Section indicator */}
        {currentQuestion?.section && (
          <Chip 
            label={currentQuestion.section} 
            color="primary" 
            variant="outlined" 
            size="small"
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {/* Question Card */}
      <Card sx={{ mb: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: 4 }}>
          {renderQuestion()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          startIcon={<ArrowBack />}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={onBack}
            variant="outlined"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Save & Exit
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!hasResponse || saving}
            variant="contained"
            endIcon={isLastQuestion ? <CheckCircle /> : <ArrowForward />}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 600,
              backgroundColor: isLastQuestion ? '#4caf50' : '#1976d2',
              '&:hover': {
                backgroundColor: isLastQuestion ? '#388e3c' : '#1565c0'
              }
            }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : isLastQuestion ? (
              'Complete Assessment'
            ) : (
              'Next Question'
            )}
          </Button>
        </Box>
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

export default AssessmentForm; 