'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Person,
  LocalHospital,
  Emergency,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useUser } from '@clerk/nextjs';
import { DatabaseService } from '../../lib/database';

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  grade: string;
  school_name: string;
  physician_name: string;
  physician_phone: string;
  health_notes: string;
  consent_given: boolean;
  profile_completed: boolean;
}

interface EmergencyContact {
  id: string;
  full_name: string;
  relationship: string;
  phone_number: string;
  can_pick_up: boolean;
  is_primary: boolean;
}

const ChildProfileDisplay = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    medical: true,
    emergency: true,
  });

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  const loadProfileData = async () => {
    try {
      const profileData = await DatabaseService.getChildProfile(
        user!.id,
        user!.emailAddresses[0]?.emailAddress,
        user!.firstName || undefined,
        user!.lastName || undefined
      );

      if (profileData) {
        setProfile(profileData);
        
        // Load emergency contacts
        const contacts = await DatabaseService.getEmergencyContacts(profileData.id);
        setEmergencyContacts(contacts || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGenderDisplay = (gender: string) => {
    const genderMap: { [key: string]: string } = {
      'male': 'Male',
      'female': 'Female',
      'non-binary': 'Non-binary',
      'prefer-not-to-say': 'Prefer not to say'
    };
    return genderMap[gender] || gender;
  };

  if (loading) {
    return (
      <Card sx={{ mt: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Loading your profile...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card sx={{ mt: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No profile found. Please complete your profile first.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#4caf50',
                fontSize: '2rem',
                mr: 3
              }}
            >
              {profile.first_name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Lexend Deca, sans-serif', color: '#2e2e2e' }}>
                {profile.first_name} {profile.last_name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.emailAddresses[0]?.emailAddress}
              </Typography>
              <Chip 
                label="Profile Complete" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Lexend Deca, sans-serif' }}>
                Personal Information
              </Typography>
            </Box>
            <IconButton onClick={() => toggleSection('personal')}>
              {expandedSections.personal ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSections.personal}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDate(profile.date_of_birth)}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">Gender</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {getGenderDisplay(profile.gender)}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">Grade</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.grade || 'Not specified'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">School</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.school_name || 'Not specified'}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Lexend Deca, sans-serif' }}>
                Medical Information
              </Typography>
            </Box>
            <IconButton onClick={() => toggleSection('medical')}>
              {expandedSections.medical ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSections.medical}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">Physician Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.physician_name || 'Not specified'}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary">Physician Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.physician_phone || 'Not specified'}
                </Typography>
              </Box>
              {profile.health_notes && (
                <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
                  <Typography variant="body2" color="text.secondary">Health Notes</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                    {profile.health_notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card sx={{ mb: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Emergency sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Lexend Deca, sans-serif' }}>
                Emergency Contacts ({emergencyContacts.length})
              </Typography>
            </Box>
            <IconButton onClick={() => toggleSection('emergency')}>
              {expandedSections.emergency ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={expandedSections.emergency}>
            {emergencyContacts.length > 0 ? (
              <Box>
                {emergencyContacts.map((contact, index) => (
                  <Box key={contact.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: '8px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {contact.full_name}
                      </Typography>
                      {contact.is_primary && (
                        <Chip label="Primary" color="primary" size="small" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">Relationship</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {contact.relationship}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {contact.phone_number}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">Can Pick Up</Typography>
                        <Chip 
                          label={contact.can_pick_up ? 'Yes' : 'No'} 
                          color={contact.can_pick_up ? 'success' : 'default'} 
                          size="small" 
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No emergency contacts added yet.
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChildProfileDisplay; 