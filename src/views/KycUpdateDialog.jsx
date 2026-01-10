import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Paper,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  AccountBalanceRounded,
  AccountCircleRounded,
  NumbersRounded,
  CodeRounded,
  AccountBalanceWalletRounded,
  CloseRounded,
  DescriptionRounded,
  CloudUploadRounded,
  CheckCircleRounded,
  DeleteRounded,
  PersonRounded,
  BadgeRounded,
  EmailRounded,
  HomeRounded,
  CreditCardRounded,
  CardMembershipRounded,
  FlightRounded,
  DirectionsCarRounded,
  HowToVoteRounded
} from '@mui/icons-material';

const steps = ['Personal Information', 'Document Upload', 'Bank Details'];

const documentTypes = [
  {
    value: 'aadhaar',
    label: 'Aadhaar Card',
    icon: CardMembershipRounded,
    color: '#1976d2',
    requiresBothSides: true
  },
  {
    value: 'pan',
    label: 'PAN Card',
    icon: CreditCardRounded,
    color: '#2e7d32',
    requiresBothSides: true
  },
  {
    value: 'passport',
    label: 'Passport',
    icon: FlightRounded,
    color: '#d32f2f',
    requiresBothSides: true
  },
  {
    value: 'driving_license',
    label: 'Driving License',
    icon: DirectionsCarRounded,
    color: '#ed6c02',
    requiresBothSides: false
  },
  {
    value: 'voter_id',
    label: 'Voter ID',
    icon: HowToVoteRounded,
    color: '#9c27b0',
    requiresBothSides: false
  }
];

export default function KycUpdateDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bookmyevent.ae/api';
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  // Step 1: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    address: ''
  });

  // Step 2: Document Upload
  const [documentInfo, setDocumentInfo] = useState({
    documentType: '',
    frontImage: null,
    frontPreview: null,
    backImage: null,
    backPreview: null
  });

  // Step 3: Bank Details
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    ifsc: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: ''
  });

  const [error, setError] = useState('');
  const [loadingBank, setLoadingBank] = useState(false);
  const [dragActiveFront, setDragActiveFront] = useState(false);
  const [dragActiveBack, setDragActiveBack] = useState(false);

  // Fetch existing KYC details
  useEffect(() => {
    if (open && userId) {
      fetchKycDetails();
    }
  }, [open, userId]);

  const fetchKycDetails = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/kyc/${userId}`);
      if (res.data.success && res.data.data) {
        const kyc = res.data.data;
        if (kyc.personalInfo) setPersonalInfo(kyc.personalInfo);
        if (kyc.bankDetails) {
          setBankDetails({
            accountHolder: kyc.bankDetails.accountHolder || '',
            accountNumber: kyc.bankDetails.accountNumber || '',
            confirmAccountNumber: kyc.bankDetails.accountNumber || '',
            ifsc: kyc.bankDetails.ifsc || '',
            bankName: kyc.bankDetails.bankName || ''
          });
        }
        if (kyc.documentInfo) {
          setDocumentInfo((prev) => ({
            ...prev,
            documentType: kyc.documentInfo.documentType || '',
            // Images are URLs now
            frontPreview: kyc.documentInfo.frontImage ? `https://api.bookmyevent.ae${kyc.documentInfo.frontImage}` : null,
            backPreview: kyc.documentInfo.backImage ? `https://api.bookmyevent.ae${kyc.documentInfo.backImage}` : null
          }));
        }
      }
    } catch (err) {
      console.error('Fetch KYC Error:', err);
      // Don't show error if not found (new user)
      if (err.response?.status !== 404) {
        setError('Failed to load existing KYC details');
      }
    } finally {
      setFetching(false);
    }
  };

  // Fetch bank name from IFSC
  const fetchBankName = async (ifscCode) => {
    if (ifscCode.length === 11) {
      setLoadingBank(true);
      try {
        const response = await fetch(`https://ifsc.razorpay.com/${ifscCode}`);
        if (response.ok) {
          const data = await response.json();
          setBankDetails((prev) => ({ ...prev, bankName: data.BANK }));
        }
      } catch (err) {
        console.error('Error fetching bank details:', err);
      } finally {
        setLoadingBank(false);
      }
    }
  };

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
      setPersonalInfo((prev) => ({ ...prev, [name]: filteredValue }));
    } else {
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  // Handle document info changes
  const handleDocumentChange = (e) => {
    const { name, value } = e.target;
    setDocumentInfo((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Handle bank details changes
  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name === 'accountHolder') {
      const filteredValue = value.replace(/[^A-Za-z\s]/g, '');
      setBankDetails((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === 'accountNumber' || name === 'confirmAccountNumber') {
      const filteredValue = value.replace(/[^0-9]/g, '');
      setBankDetails((prev) => ({ ...prev, [name]: filteredValue }));
    } else if (name === 'ifsc') {
      const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setBankDetails((prev) => ({ ...prev, ifsc: upperValue }));
      if (upperValue.length === 11) {
        fetchBankName(upperValue);
      }
    } else {
      setBankDetails((prev) => ({ ...prev, [name]: value }));
    }

    if (error) setError('');
  };

  // File upload handlers
  const handleFileChange = (e, side) => {
    const file = e.target.files?.[0];
    processFile(file, side);
  };

  const processFile = (file, side) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid file (JPG, PNG, or PDF)');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 5MB');
        return;
      }

      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setDocumentInfo((prev) => ({
            ...prev,
            frontImage: file,
            frontPreview: reader.result
          }));
        } else {
          setDocumentInfo((prev) => ({
            ...prev,
            backImage: file,
            backPreview: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e, side) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      if (side === 'front') setDragActiveFront(true);
      else setDragActiveBack(true);
    } else if (e.type === 'dragleave') {
      if (side === 'front') setDragActiveFront(false);
      else setDragActiveBack(false);
    }
  };

  const handleDrop = (e, side) => {
    e.preventDefault();
    e.stopPropagation();
    if (side === 'front') setDragActiveFront(false);
    else setDragActiveBack(false);

    const file = e.dataTransfer.files?.[0];
    processFile(file, side);
  };

  const handleRemoveFile = (side) => {
    if (side === 'front') {
      setDocumentInfo((prev) => ({
        ...prev,
        frontImage: null,
        frontPreview: null
      }));
    } else {
      setDocumentInfo((prev) => ({
        ...prev,
        backImage: null,
        backPreview: null
      }));
    }
  };

  // Validation and navigation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate personal information
      if (!personalInfo.fullName || !personalInfo.email || !personalInfo.address) {
        setError('Please fill all required fields');
        return;
      }
      if (!validateEmail(personalInfo.email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else if (activeStep === 1) {
      const selectedDoc = documentTypes.find(doc => doc.value === documentInfo.documentType);
      // Validate document upload
      if (!documentInfo.documentType) {
        setError('Please select a document type');
        return;
      }
      if (!documentInfo.frontImage) {
        setError('Please upload the front image of your document');
        return;
      }
      // Check if back image is required for this document type
      if (selectedDoc?.requiresBothSides && !documentInfo.backImage) {
        setError('Please upload both front and back images for this document type');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate bank details
    if (!bankDetails.accountHolder || !bankDetails.accountNumber ||
      !bankDetails.ifsc || !bankDetails.bankName) {
      setError('Please fill all required fields');
      return;
    }
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('personalInfo', JSON.stringify(personalInfo));
      formData.append('bankDetails', JSON.stringify({
        accountHolder: bankDetails.accountHolder,
        accountNumber: bankDetails.accountNumber,
        ifsc: bankDetails.ifsc,
        bankName: bankDetails.bankName
      }));

      // Document Info (excluding previews/images if they are strings/URLs)
      const docInfo = {
        documentType: documentInfo.documentType
      };
      formData.append('documentInfo', JSON.stringify(docInfo));

      // Append files only if they are new File objects
      if (documentInfo.frontImage instanceof File) {
        formData.append('frontImage', documentInfo.frontImage);
      }
      if (documentInfo.backImage instanceof File) {
        formData.append('backImage', documentInfo.backImage);
      }

      const res = await axios.post(`${API_BASE_URL}/profile/kyc`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        // Update localStorage to prevent popup from showing again
        const updatedUser = { ...user, kycCompleted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        onClose();
      } else {
        setError(res.data.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submit KYC Error:', err);
      setError(err.response?.data?.message || 'Something went wrong during submission');
    } finally {
      setSubmitting(false);
    }
  };

  // Render upload zone
  const renderUploadZone = (side) => {
    const isDragActive = side === 'front' ? dragActiveFront : dragActiveBack;
    const image = side === 'front' ? documentInfo.frontImage : documentInfo.backImage;
    const preview = side === 'front' ? documentInfo.frontPreview : documentInfo.backPreview;
    const inputId = `file-upload-${side}`;

    if (!image) {
      return (
        <Paper
          onDragEnter={(e) => handleDrag(e, side)}
          onDragLeave={(e) => handleDrag(e, side)}
          onDragOver={(e) => handleDrag(e, side)}
          onDrop={(e) => handleDrop(e, side)}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'rgba(30, 60, 114, 0.2)',
            bgcolor: isDragActive ? 'rgba(30, 60, 114, 0.04)' : 'rgba(30, 60, 114, 0.02)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'rgba(30, 60, 114, 0.04)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px -4px rgba(30, 60, 114, 0.15)'
            }
          }}
          onClick={() => document.getElementById(inputId).click()}
        >
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => handleFileChange(e, side)}
            style={{ display: 'none' }}
          />

          <Avatar sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            bgcolor: 'rgba(30, 60, 114, 0.1)'
          }}>
            <CloudUploadRounded sx={{ fontSize: 28, color: 'primary.main' }} />
          </Avatar>

          <Typography variant="body1" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
            Upload {side === 'front' ? 'Front' : 'Back'} Side
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            Drag & drop or click to browse
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
            <Chip label="JPG" size="small" sx={{ bgcolor: 'rgba(30, 60, 114, 0.1)', fontSize: '0.7rem' }} />
            <Chip label="PNG" size="small" sx={{ bgcolor: 'rgba(30, 60, 114, 0.1)', fontSize: '0.7rem' }} />
            <Chip label="PDF" size="small" sx={{ bgcolor: 'rgba(30, 60, 114, 0.1)', fontSize: '0.7rem' }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Max 5MB
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '2px solid',
          borderColor: 'success.main',
          bgcolor: 'rgba(46, 125, 50, 0.04)',
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar sx={{
            width: 48,
            height: 48,
            bgcolor: 'success.main'
          }}>
            {image.type === 'application/pdf' ? (
              <DescriptionRounded sx={{ fontSize: 24 }} />
            ) : (
              <CheckCircleRounded sx={{ fontSize: 24 }} />
            )}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {image.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {(image.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>

          <IconButton
            onClick={() => handleRemoveFile(side)}
            size="small"
            sx={{
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' }
            }}
          >
            <DeleteRounded fontSize="small" />
          </IconButton>
        </Box>

        {preview && image.type !== 'application/pdf' && (
          <Box sx={{ borderRadius: '12px', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
            <img
              src={preview}
              alt={`${side} side preview`}
              style={{
                width: '100%',
                maxHeight: '150px',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Paper>
    );
  };

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        // Personal Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Legal Name"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                required
                variant="outlined"
                placeholder="Enter your full name as per documents"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
                variant="outlined"
                placeholder="your.email@example.com"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Complete Address"
                name="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                required
                multiline
                rows={4}
                variant="outlined"
                placeholder="Enter your complete residential address"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <HomeRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        // Document Upload
        const selectedDoc = documentTypes.find(doc => doc.value === documentInfo.documentType);
        const DocIcon = selectedDoc?.icon;

        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.primary' }}>
                Select Identity Document Type <span style={{ color: '#d32f2f' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                select
                name="documentType"
                value={documentInfo.documentType}
                onChange={handleDocumentChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeRounded color="primary" sx={{ opacity: 0.7, fontSize: 28 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    padding: '4px 14px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5
                  }
                }}
                SelectProps={{
                  renderValue: (selected) => {
                    const selectedDoc = documentTypes.find(doc => doc.value === selected);
                    if (!selectedDoc) return 'Select document type';
                    const Icon = selectedDoc.icon;
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                          width: 40,
                          height: 40,
                          bgcolor: `${selectedDoc.color}15`
                        }}>
                          <Icon sx={{ color: selectedDoc.color, fontSize: 22 }} />
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{selectedDoc.label}</Typography>
                      </Box>
                    );
                  }
                }}
              >
                {documentTypes.map((option) => {
                  const Icon = option.icon;
                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: `${option.color}08`
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Avatar sx={{
                          width: 44,
                          height: 44,
                          bgcolor: `${option.color}15`
                        }}>
                          <Icon sx={{ color: option.color, fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{option.label}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {option.requiresBothSides ? 'Front & Back required' : 'Front side only'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {documentInfo.documentType && (
              <>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    bgcolor: `${selectedDoc?.color}08`,
                    border: `2px solid ${selectedDoc?.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    height: '100%',
                    minHeight: '90px'
                  }}>
                    {DocIcon && (
                      <Avatar sx={{
                        bgcolor: `${selectedDoc?.color}20`,
                        width: 52,
                        height: 52
                      }}>
                        <DocIcon sx={{ color: selectedDoc?.color, fontSize: 28 }} />
                      </Avatar>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                        {selectedDoc?.label} Selected
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {selectedDoc?.requiresBothSides
                          ? '📸 Upload both front and back sides'
                          : '📸 Upload front side only'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>


                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Upload Documents" size="small" sx={{ fontWeight: 600, bgcolor: 'rgba(30, 60, 114, 0.08)' }} />
                  </Divider>
                </Grid>

                <Grid item xs={12} md={selectedDoc?.requiresBothSides ? 6 : 12}>
                  <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
                    📄 Front Side <span style={{ color: '#d32f2f' }}>*</span>
                  </Typography>
                  {renderUploadZone('front')}
                </Grid>

                {selectedDoc?.requiresBothSides && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1.5, fontWeight: 700, color: 'text.primary' }}>
                      📄 Back Side <span style={{ color: '#d32f2f' }}>*</span>
                    </Typography>
                    {renderUploadZone('back')}
                  </Grid>
                )}
              </>
            )}
          </Grid>
        );

      case 2:
        // Bank Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="accountHolder"
                value={bankDetails.accountHolder}
                onChange={handleBankDetailsChange}
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={bankDetails.accountNumber}
                onChange={handleBankDetailsChange}
                type="text"
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Account Number"
                name="confirmAccountNumber"
                value={bankDetails.confirmAccountNumber}
                onChange={handleBankDetailsChange}
                type="text"
                required
                error={!!error && error.includes('Account numbers')}
                helperText={error && error.includes('Account numbers') ? error : ''}
                variant="outlined"
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersRounded color={error && error.includes('Account numbers') ? 'error' : 'primary'} sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: error && error.includes('Account numbers') ? 'error.main' : 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc"
                value={bankDetails.ifsc}
                onChange={handleBankDetailsChange}
                required
                variant="outlined"
                inputProps={{ autoComplete: 'new-password', maxLength: 11 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CodeRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={bankDetails.bankName}
                onChange={handleBankDetailsChange}
                required
                variant="outlined"
                disabled={loadingBank}
                placeholder={loadingBank ? 'Fetching bank name...' : ''}
                inputProps={{ autoComplete: 'new-password' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceRounded color="primary" sx={{ opacity: 0.7 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3d6bb3 100%)',
        color: '#fff'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 52, height: 52 }}>
            <AccountBalanceWalletRounded sx={{ color: '#fff', fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.2 }}>
              KYC Verification
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>
              Complete your profile verification in 3 simple steps
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': {
                      color: 'primary.main',
                      fontSize: '2.2rem'
                    },
                    '&.Mui-completed': {
                      color: 'success.main',
                      fontSize: '2.2rem'
                    },
                    fontSize: '2.2rem'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mt: 0.5 }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider sx={{ mx: 4 }} />

      <form onSubmit={handleSubmit} autoComplete="off">
        <DialogContent sx={{ p: 4, pt: 3, maxHeight: '60vh', overflowY: 'auto' }}>
          {fetching ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10, gap: 2 }}>
              <CircularProgress size={48} thickness={4} sx={{ color: 'primary.main' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Loading your KYC details...
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center', fontWeight: 500 }}>
                {activeStep === 0 && 'Please provide your personal information accurately'}
                {activeStep === 1 && 'Upload clear images of your identity document'}
                {activeStep === 2 && 'Enter your bank account details for secure settlements'}
              </Typography>

              {renderStepContent(activeStep)}

              {error && !error.includes('Account numbers') && (
                <Box sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: 'rgba(211, 47, 47, 0.08)',
                  border: '1px solid rgba(211, 47, 47, 0.3)'
                }}>
                  <Typography variant="body2" sx={{ color: 'error.main', textAlign: 'center', fontWeight: 500 }}>
                    ⚠️ {error}
                  </Typography>
                </Box>
              )}

              <Box sx={{
                mt: 3,
                p: 2,
                borderRadius: '12px',
                bgcolor: 'rgba(30, 60, 114, 0.04)',
                border: '1px dashed rgba(30, 60, 114, 0.2)'
              }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
                  🔒 Your data is encrypted and securely stored. We respect your privacy and comply with data protection regulations.
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
          <Button
            onClick={onClose}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: '12px',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancel
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'rgba(30, 60, 114, 0.04)',
                    borderColor: 'primary.dark'
                  }
                }}
              >
                Previous
              </Button>
            )}

            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                sx={{
                  px: 6,
                  py: 1.2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #2e7d32 0%, #43a047 100%)',
                  boxShadow: '0 8px 16px -4px rgba(46, 125, 50, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1b5e20 0%, #2e7d32 100%)',
                    boxShadow: '0 12px 20px -6px rgba(46, 125, 50, 0.5)',
                  }
                }}
              >
                {submitting ? 'Submitting...' : 'Submit KYC'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                sx={{
                  px: 6,
                  py: 1.2,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)',
                  boxShadow: '0 8px 16px -4px rgba(30, 60, 114, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2a5298 0%, #1e3c72 100%)',
                    boxShadow: '0 12px 20px -6px rgba(30, 60, 114, 0.4)',
                  }
                }}
              >
                Next Step
              </Button>
            )}
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
}