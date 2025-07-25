'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search, Person, CheckCircle, Group } from '@mui/icons-material';

interface ChildVerificationFormProps {
  onChildLinked?: (child: any) => void;
  onCancel?: () => void;
}

interface SearchResult {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  school_name?: string;
  grade?: string;
  profile_completed: boolean;
}

const ChildVerificationForm: React.FC<ChildVerificationFormProps> = ({ 
  onChildLinked, 
  onCancel 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedChild, setSelectedChild] = useState<SearchResult | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    schoolName: '',
    grade: '',
    relationshipType: 'parent'
  });

  const steps = ['Enter Child Details', 'Verify Identity', 'Complete Link'];

  const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    error: '#ef4444'
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setMessage(null);
  };

  const searchForChild = async () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      setMessage({ type: 'error', text: 'Please fill in the child\'s first name, last name, and date of birth.' });
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth
      });

      const response = await fetch(`/api/guardian/verify-child?${params}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.children || []);
        if (data.found && data.children && data.children.length > 0) {
          setActiveStep(1);
          setMessage({ 
            type: 'success', 
            text: `Found ${data.children.length} matching child${data.children.length > 1 ? 'ren' : ''}.` 
          });
        } else {
          setMessage({ 
            type: 'info', 
            text: 'No child found with those details. Please check the information and try again.' 
          });
        }
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Failed to search for child.' });
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage({ type: 'error', text: 'An error occurred while searching. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const selectChild = (child: SearchResult) => {
    setSelectedChild(child);
    setActiveStep(2);
    setMessage(null);
  };

  const confirmLinkChild = () => {
    setConfirmDialogOpen(true);
  };

  const linkChild = async () => {
    if (!selectedChild) return;

    setLoading(true);
    setConfirmDialogOpen(false);

    try {
      const response = await fetch('/api/guardian/verify-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: selectedChild.first_name,
          lastName: selectedChild.last_name,
          dateOfBirth: selectedChild.date_of_birth,
          schoolName: selectedChild.school_name,
          grade: selectedChild.grade,
          relationshipType: formData.relationshipType
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        onChildLinked?.(data.child);
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Failed to link child.' });
      }
    } catch (error) {
      console.error('Link error:', error);
      setMessage({ type: 'error', text: 'An error occurred while linking the child.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setActiveStep(0);
    setSearchResults([]);
    setSelectedChild(null);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      schoolName: '',
      grade: '',
      relationshipType: 'parent'
    });
    setMessage(null);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        maxWidth: 600,
        mx: 'auto'
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Group sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: colors.text,
            mb: 1,
            fontFamily: 'Lexend Deca, sans-serif'
          }}
        >
          Link to Your Child
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: colors.textSecondary }}
        >
          Enter your child's details to verify your relationship and link their account
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Step 1: Enter Child Details */}
      {activeStep === 0 && (
        <Card elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
              Child Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />

              <TextField
                fullWidth
                label="School Name (Optional)"
                value={formData.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                helperText="Adding school name helps us find the right child"
              />

              <TextField
                fullWidth
                label="Grade (Optional)"
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                helperText="Adding grade helps us verify the correct child"
              />

              <FormControl fullWidth>
                <InputLabel>Your Relationship to Child</InputLabel>
                <Select
                  value={formData.relationshipType}
                  label="Your Relationship to Child"
                  onChange={(e) => handleInputChange('relationshipType', e.target.value)}
                >
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="guardian">Legal Guardian</MenuItem>
                  <MenuItem value="grandparent">Grandparent</MenuItem>
                  <MenuItem value="aunt-uncle">Aunt/Uncle</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                {onCancel && (
                  <Button 
                    variant="outlined" 
                    onClick={onCancel}
                    sx={{ textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={searchForChild}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                  sx={{ 
                    textTransform: 'none',
                    backgroundColor: colors.primary,
                    '&:hover': { backgroundColor: colors.secondary }
                  }}
                >
                  {loading ? 'Searching...' : 'Search for Child'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Verify Identity */}
      {activeStep === 1 && (
        <Card elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
              Select Your Child
            </Typography>
            
            {searchResults.map((child) => (
              <Paper
                key={child.id}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 2,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: colors.primary,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => selectChild(child)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Person sx={{ color: colors.primary }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                      {child.first_name} {child.last_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Born: {new Date(child.date_of_birth).toLocaleDateString()}
                    </Typography>
                    {child.school_name && (
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        School: {child.school_name}
                      </Typography>
                    )}
                    {child.grade && (
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Grade: {child.grade}
                      </Typography>
                    )}
                  </Box>
                  <Chip 
                    label={child.profile_completed ? "Profile Complete" : "Profile Incomplete"} 
                    color={child.profile_completed ? "success" : "warning"}
                    size="small"
                  />
                </Box>
              </Paper>
            ))}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => setActiveStep(0)}
                sx={{ textTransform: 'none' }}
              >
                Back to Search
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Complete Link */}
      {activeStep === 2 && selectedChild && (
        <Card elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
              Confirm Child Link
            </Typography>
            
            <Paper elevation={0} sx={{ p: 3, backgroundColor: colors.background, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ color: colors.success }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                    {selectedChild.first_name} {selectedChild.last_name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Born: {new Date(selectedChild.date_of_birth).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    Your relationship: {formData.relationshipType}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              By linking to this child, you confirm that you are their {formData.relationshipType} and 
              have permission to manage their account.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setActiveStep(1)}
                sx={{ textTransform: 'none' }}
              >
                Back to Selection
              </Button>
              <Button
                variant="contained"
                onClick={confirmLinkChild}
                disabled={loading}
                sx={{ 
                  textTransform: 'none',
                  backgroundColor: colors.success,
                  '&:hover': { backgroundColor: colors.primary }
                }}
              >
                Link to Child
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirm Child Link</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to link to {selectedChild?.first_name} {selectedChild?.last_name}? 
            This action will give you access to manage their account and view their progress.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={linkChild} 
            variant="contained" 
            disabled={loading}
            sx={{ backgroundColor: colors.success }}
          >
            {loading ? 'Linking...' : 'Confirm Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ChildVerificationForm; 