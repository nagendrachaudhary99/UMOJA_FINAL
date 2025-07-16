'use client';

import React, { useState, useEffect } from 'react';
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
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import { DatabaseService, ChildProfile, EmergencyContact } from '../../lib/database';
import ChildProfileDisplay from './ChildProfileDisplay';

const ChildProfileForm = () => {
  const { user } = useUser();
  const [emergencyContacts, setEmergencyContacts] = useState([
    { fullName: '', relationship: '', phone: '', canPickUp: 'No' },
  ]);

  // Add state for form fields
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    grade: '',
    schoolName: '',
    physicianName: '',
    physicianPhone: '',
    healthNotes: '',
    consent: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Load existing profile data on component mount
  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    if (!user?.id) return;
    
    try {
      const profile = await DatabaseService.getChildProfile(
        user.id, 
        user.emailAddresses[0]?.emailAddress,
        user.firstName || undefined,
        user.lastName || undefined
      );
      if (profile) {
        setFormData({
          dateOfBirth: profile.date_of_birth || '',
          gender: profile.gender || '',
          grade: profile.grade || '',
          schoolName: profile.school_name || '',
          physicianName: profile.physician_name || '',
          physicianPhone: profile.physician_phone || '',
          healthNotes: profile.health_notes || '',
          consent: profile.consent_given || false
        });

        // Load emergency contacts
        const contacts = await DatabaseService.getEmergencyContacts(profile.id);
        if (contacts && contacts.length > 0) {
          setEmergencyContacts(contacts.map(contact => ({
            fullName: contact.full_name,
            relationship: contact.relationship,
            phone: contact.phone_number,
            canPickUp: contact.can_pick_up ? 'Yes' : 'No'
          })));
        }
        
        // If profile exists, show the display
        setShowProfile(true);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleAddContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { fullName: '', relationship: '', phone: '', canPickUp: 'No' },
    ]);
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = emergencyContacts.filter((_, i) => i !== index);
    setEmergencyContacts(newContacts);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (index: number, field: string, value: string) => {
    const newContacts = [...emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setEmergencyContacts(newContacts);
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Please sign in to save your profile.' });
      return;
    }

    if (!formData.consent) {
      setMessage({ type: 'error', text: 'Please provide consent to continue.' });
      return;
    }

    setLoading(true);
    try {
      // Save child profile
      const profileData: ChildProfile = {
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        grade: formData.grade,
        school_name: formData.schoolName,
        physician_name: formData.physicianName,
        physician_phone: formData.physicianPhone,
        health_notes: formData.healthNotes,
        consent_given: formData.consent,
        profile_completed: true
      };

      const savedProfile = await DatabaseService.saveChildProfile(
        profileData, 
        user.id,
        user.emailAddresses[0]?.emailAddress,
        user.firstName || undefined,
        user.lastName || undefined
      );

      // Save emergency contacts
      const contactsData: EmergencyContact[] = emergencyContacts
        .filter(contact => contact.fullName && contact.phone) // Only save contacts with required fields
        .map((contact, index) => ({
          full_name: contact.fullName,
          relationship: contact.relationship,
          phone_number: contact.phone,
          can_pick_up: contact.canPickUp === 'Yes',
          is_primary: index === 0 // First contact is primary
        }));

      if (contactsData.length > 0) {
        await DatabaseService.saveEmergencyContacts(contactsData, savedProfile.id!);
      }

      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setShowProfile(true); // Show the profile display after successful save
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card sx={{ mt: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Please sign in to access your profile.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Show profile display if profile exists or was just saved
  if (showProfile) {
    return <ChildProfileDisplay />;
  }

  return (
    <>
      <Card sx={{ mt: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, fontFamily: 'Lexend Deca, sans-serif', color: '#2e2e2e' }}>
            {user.firstName ? `Hi, ${user.firstName}!` : 'Complete Your Profile'}
          </Typography>
          {user.firstName && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Let's complete your profile with all the important details.
            </Typography>
          )}

          {/* User Info Display */}
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Profile will be saved for:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName} ({user.emailAddresses[0]?.emailAddress})
            </Typography>
          </Box>

          {/* Personal Details */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3, fontFamily: 'Lexend Deca, sans-serif' }}>Personal Details</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField 
                fullWidth 
                label="Date of Birth" 
                type="date" 
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select 
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="non-binary">Non-binary</MenuItem>
                  <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField 
                fullWidth 
                label="Grade"
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField 
                fullWidth 
                label="School Name"
                value={formData.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Emergency Contact Info */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Lexend Deca, sans-serif' }}>Emergency Contact Info</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide emergency contacts in case we are unable to reach the parent/guardian.
          </Typography>

          {emergencyContacts.map((contact, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>Emergency Contact {index + 1}</Typography>
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveContact(index)} color="error">
                    <RemoveCircleOutline />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField 
                    fullWidth 
                    label="Full Name" 
                    placeholder="First and Last Name"
                    value={contact.fullName}
                    onChange={(e) => handleEmergencyContactChange(index, 'fullName', e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormControl fullWidth>
                    <InputLabel>Relationship to Child</InputLabel>
                    <Select 
                      label="Relationship to Child"
                      value={contact.relationship}
                      onChange={(e) => handleEmergencyContactChange(index, 'relationship', e.target.value)}
                    >
                      <MenuItem value="parent">Parent</MenuItem>
                      <MenuItem value="guardian">Guardian</MenuItem>
                      <MenuItem value="grandparent">Grandparent</MenuItem>
                      <MenuItem value="aunt-uncle">Aunt/Uncle</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <TextField 
                    fullWidth 
                    label="Phone Number" 
                    placeholder="123-456-7890"
                    value={contact.phone}
                    onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <FormControl component="fieldset">
                    <Typography component="legend" variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Can this person pick up the child?
                    </Typography>
                    <RadioGroup 
                      row
                      value={contact.canPickUp}
                      onChange={(e) => handleEmergencyContactChange(index, 'canPickUp', e.target.value)}
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutline />}
            onClick={handleAddContact}
            sx={{ mt: 1, mb: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Add Another Emergency Contact
          </Button>
          
          <Divider sx={{ my: 4 }} />

          {/* Medical Information */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Lexend Deca, sans-serif' }}>Medical Information</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField 
                fullWidth 
                label="Physician Name" 
                placeholder="Dr. Maria Lopez"
                value={formData.physicianName}
                onChange={(e) => handleInputChange('physicianName', e.target.value)}
              />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <TextField 
                fullWidth 
                label="Physician Phone Number" 
                placeholder="123-456-7890"
                value={formData.physicianPhone}
                onChange={(e) => handleInputChange('physicianPhone', e.target.value)}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Allergy & Health Notes"
                placeholder="List any allergies, medications, or important health conditions."
                value={formData.healthNotes}
                onChange={(e) => handleInputChange('healthNotes', e.target.value)}
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 4 }} />

          {/* Consent */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, fontFamily: 'Lexend Deca, sans-serif' }}>Consent</Typography>
           <FormControlLabel
              control={<Radio 
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
              />}
              label="I have permission from my parent/guardian to complete this profile."
            />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}>
              Back
            </Button>
            <Button 
              variant="contained" 
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </Box>
        </CardContent>
      </Card>

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
    </>
  );
};

export default ChildProfileForm; 