// Management System Types
export interface User {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: 'tourist' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Package {
  id: number;
  title: string;
  description: string;
  destination: string;
  duration: number; // days
  price: number;
  maxCapacity: number;
  currentBookings: number;
  status: 'active' | 'inactive' | 'draft';
  images: string[];
  features: string[];
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  packageId: number;
  userFullName: string;
  packageTitle: string;
  bookingDate: string;
  travelDate: string;
  participants: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  currency: string;
  method: 'card' | 'bank_transfer' | 'paystack';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  packageId: number;
  bookingId: number;
  userFullName: string;
  packageTitle: string;
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'booking' | 'visa' | 'payment' | 'system' | 'promotion';
  status: 'unread' | 'read';
  actionUrl?: string;
  createdAt: string;
}

export interface SystemStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  activePackages: number;
  pendingVisaRequests: number;
  monthlyGrowth: {
    users: number;
    bookings: number;
    revenue: number;
  };
}

// Table component props
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowSelection?: {
    selectedRowKeys: (string | number)[];
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  };
}

// Form component props
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

export interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
}