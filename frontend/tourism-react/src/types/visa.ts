export interface VisaRequest {
  id: number;
  userId: number;
  applicationNumber?: string;
  destinationCountry: string;
  travelPurpose: 'tourism' | 'business' | 'education' | 'medical' | 'family_visit' | 'other';
  intendedTravelDate: string;
  passportNumber: string;
  documentPath?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  adminComments?: string;
  submittedAt: string;
  updatedAt: string;
  userFullName?: string;
  userEmail?: string;
}

export interface VisaRequestForm {
  destinationCountry: string;
  travelPurpose: string;
  intendedTravelDate: string;
  passportNumber: string;
  document?: File;
}

export interface VisaStatusUpdate {
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  adminComments?: string;
}

export const TRAVEL_PURPOSES = [
  { value: 'tourism',     label: 'Tourism/Leisure' },
  { value: 'business',    label: 'Business' },
  { value: 'education',   label: 'Education/Study' },
  { value: 'medical',     label: 'Medical Treatment' },
  { value: 'family_visit',label: 'Family Visit' },
  { value: 'other',       label: 'Other' }
];

export const VISA_STATUS_COLORS = {
  submitted: '#3b82f6',
  under_review: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444'
};

export const VISA_STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected'
};