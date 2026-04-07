export type UserRole = 'tourist' | 'admin';

export interface RolePermissions {
  canViewPackages: boolean;
  canBookPackages: boolean;
  canManageOwnBookings: boolean;
  canRequestVisa: boolean;
  canViewOwnVisaStatus: boolean;
  canManagePackages: boolean;
  canViewAllBookings: boolean;
  canManageCustomers: boolean;
  canViewAnalytics: boolean;
  canManageVisaRequests: boolean;
  canManageUsers: boolean;
  canAccessAdminPanel: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  tourist: {
    canViewPackages: true,
    canBookPackages: true,
    canManageOwnBookings: true,
    canRequestVisa: true,
    canViewOwnVisaStatus: true,
    canManagePackages: false,
    canViewAllBookings: false,
    canManageCustomers: false,
    canViewAnalytics: false,
    canManageVisaRequests: false,
    canManageUsers: false,
    canAccessAdminPanel: false,
    canViewReports: false,
    canManageSettings: false,
  },
  admin: {
    canViewPackages: true,
    canBookPackages: true,
    canManageOwnBookings: true,
    canRequestVisa: true,
    canViewOwnVisaStatus: true,
    canManagePackages: true,
    canViewAllBookings: true,
    canManageCustomers: true,
    canViewAnalytics: true,
    canManageVisaRequests: true,
    canManageUsers: true,
    canAccessAdminPanel: true,
    canViewReports: true,
    canManageSettings: true,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  tourist: 'Tourist',
  admin: 'Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  tourist: '#10b981', // Green
  admin: '#ef4444',   // Red
};

export const ROLE_ICONS: Record<UserRole, string> = {
  tourist: '🧳',
  admin: '👑',
};