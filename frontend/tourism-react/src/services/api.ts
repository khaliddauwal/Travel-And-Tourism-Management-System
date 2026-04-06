import axios, { AxiosError } from 'axios';
import { VisaRequest, VisaStatusUpdate } from '../types/visa';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/Tourism-Management-System-main/backend/api/v2';

// Define error response types
interface ApiErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
    error?: string;
}

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session-based auth
    timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        // Handle different error types
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please check your connection.');
        }

        if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }

        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
            case 401:
                // Clear auth data and redirect to login
                localStorage.removeItem('authToken');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                throw new Error('Session expired. Please login again.');
            case 403:
                throw new Error('Access denied. You don\'t have permission.');
            case 404:
                throw new Error('Resource not found.');
            case 422:
                // Validation errors
                const validationErrors = errorData?.errors;
                if (validationErrors) {
                    const errorMessages = Object.values(validationErrors).flat();
                    throw new Error(errorMessages.join(', '));
                }
                throw new Error('Validation failed.');
            case 500:
                throw new Error('Server error. Please try again later.');
            default:
                throw new Error(errorData?.message || errorData?.error || 'An unexpected error occurred.');
        }
    }
);

export interface Package {
    id: number;
    name: string;
    type: string;
    location: string;
    price: {
        usd: number;
        ngn: number;
        formatted: string;
    };
    features: string;
    details: string;
    image: string;
    createdAt: string;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    mobileNumber: string;
    role: string;
    status: string;
    registrationDate: string;
    lastLogin?: string;
}

export interface LoginResponse {
    token: string;
    user: User & {
        id: number;
        role_name: string;
        status: string;
        // Backend returns snake_case, so we need to support both
        full_name?: string;
        mobile?: string;
        created_at?: string;
        role?: string;
    };
}

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    mobileNumber: string;
    accountType?: string; // Add account type
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

class ApiService {
    // Authentication
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
            email,
            password,
        });
        
        // Store token in localStorage
        if (response.data.data.token) {
            localStorage.setItem('authToken', response.data.data.token);
        }
        
        return response.data.data;
    }

    async register(userData: RegisterData): Promise<LoginResponse> {
        const response = await api.post<ApiResponse<LoginResponse>>('/auth/register', {
            full_name: userData.fullName,
            email: userData.email,
            password: userData.password,
            mobile: userData.mobileNumber,
            account_type: userData.accountType || 'tourist',
        });
        
        // Store token in localStorage only if user is active (not pending)
        if (response.data.data.token) {
            localStorage.setItem('authToken', response.data.data.token);
        }
        
        return response.data.data;
    }

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    }

    async getCurrentUser(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/auth/me');
        return response.data.data;
    }

    // Packages
    async getPackages(params?: {
        page?: number;
        limit?: number;
        search?: string;
        type?: string;
        status?: string;
    }): Promise<any> {
        const response = await api.get<any>('/packages', { params });
        // Backend returns { success, data: { packages: [...], pagination: {...} } }
        const payload = response.data.data ?? response.data;
        return {
            packages: payload.packages ?? payload.data ?? [],
            data:     payload.packages ?? payload.data ?? [],
            pagination: payload.pagination ?? { total: 0, current_page: 1, per_page: 12, total_pages: 1 },
        };
    }

    async getPackage(id: number): Promise<Package> {
        const response = await api.get<ApiResponse<Package>>(`/packages/${id}`);
        return response.data.data;
    }

    async getFeaturedPackages(limit: number = 6): Promise<Package[]> {
        const response = await api.get<ApiResponse<Package[]>>('/packages/featured', {
            params: { limit },
        });
        return response.data.data;
    }

    async getPackageTypes(): Promise<string[]> {
        const response = await api.get<ApiResponse<string[]>>('/packages/types');
        return response.data.data;
    }

    async searchPackages(query: string, limit: number = 10): Promise<Package[]> {
        const response = await api.get<ApiResponse<Package[]>>('/packages/search', {
            params: { q: query, limit },
        });
        return response.data.data;
    }

    // Contact
    async sendContactMessage(data: {
        name: string;
        email: string;
        message: string;
    }): Promise<void> {
        await api.post('/contact', data);
    }

    // Visa Assistance
    async submitVisaRequest(formData: FormData): Promise<VisaRequest> {
        const response = await api.post<ApiResponse<VisaRequest>>('/visa', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }

    async getUserVisaRequests(): Promise<VisaRequest[]> {
        const response = await api.get<ApiResponse<VisaRequest[]>>('/visa/my-requests');
        return response.data.data;
    }

    async getVisaRequest(id: number): Promise<VisaRequest> {
        const response = await api.get<ApiResponse<VisaRequest>>(`/visa/${id}`);
        return response.data.data;
    }

    // Admin visa methods
    async getAllVisaRequests(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<PaginatedResponse<VisaRequest>> {
        const response = await api.get<any>('/visa/admin/all', { params });
        const payload = response.data.data ?? response.data;
        const apps: VisaRequest[] = (payload.applications ?? payload.data ?? []);
        return {
            success: true,
            message: '',
            data: apps,
            pagination: payload.pagination ?? { total: apps.length, page: 1, limit: apps.length, totalPages: 1 },
        };
    }

    async updateVisaStatus(id: number, update: VisaStatusUpdate): Promise<VisaRequest> {
        const response = await api.put<ApiResponse<VisaRequest>>(`/visa/admin/${id}/status`, update);
        return response.data.data;
    }

    // User Management (Admin only)
    async getUsers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
    }): Promise<PaginatedResponse<any>> {
        const response = await api.get<any>('/users', { params });

        // Backend returns { success, data: { users: [...], pagination: {...} } }
        const payload = response.data.data ?? response.data;
        const rawUsers: any[] = payload.users ?? payload.data ?? payload ?? [];

        const transformedData = rawUsers.map((user: any) => ({
            id: user.id,
            fullName: user.full_name || user.fullName,
            email: user.email,
            mobileNumber: user.mobile || user.mobileNumber,
            role: user.role_name === 'administrator' ? 'admin' : user.role_name || user.role,
            status: user.status,
            registrationDate: user.created_at || user.registrationDate,
            lastLogin: user.last_login || user.lastLogin,
        }));

        return {
            success: true,
            message: '',
            data: transformedData,
            pagination: payload.pagination ?? { total: transformedData.length, page: 1, limit: transformedData.length, totalPages: 1 },
        };
    }

    async getUser(id: number): Promise<any> {
        const response = await api.get<ApiResponse<any>>(`/users/${id}`);
        const user = response.data.data;
        
        // Transform backend response to frontend format
        return {
            id: user.id,
            fullName: user.full_name || user.fullName,
            email: user.email,
            mobileNumber: user.mobile || user.mobileNumber,
            role: user.role_name === 'administrator' ? 'admin' : user.role_name || user.role,
            status: user.status,
            registrationDate: user.created_at || user.registrationDate,
            lastLogin: user.last_login || user.lastLogin,
        };
    }

    async createUser(userData: {
        fullName: string;
        email: string;
        password: string;
        mobileNumber: string;
        role: string;
    }): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/users', {
            full_name: userData.fullName,
            email: userData.email,
            password: userData.password,
            mobile: userData.mobileNumber,
            role: userData.role === 'admin' ? 'administrator' : userData.role,
        });
        
        const user = response.data.data;
        
        // Transform backend response to frontend format
        return {
            id: user.id,
            fullName: user.full_name || user.fullName,
            email: user.email,
            mobileNumber: user.mobile || user.mobileNumber,
            role: user.role_name === 'administrator' ? 'admin' : user.role_name || user.role,
            status: user.status,
            registrationDate: user.created_at || user.registrationDate,
        };
    }

    async updateUser(id: number, userData: {
        fullName?: string;
        email?: string;
        mobileNumber?: string;
        role?: string;
        status?: string;
    }): Promise<any> {
        const response = await api.put<ApiResponse<any>>(`/users/${id}`, {
            full_name: userData.fullName,
            email: userData.email,
            mobile: userData.mobileNumber,
            role: userData.role === 'admin' ? 'administrator' : userData.role,
            status: userData.status,
        });
        
        const user = response.data.data;
        
        // Transform backend response to frontend format
        return {
            id: user.id,
            fullName: user.full_name || user.fullName,
            email: user.email,
            mobileNumber: user.mobile || user.mobileNumber,
            role: user.role_name === 'administrator' ? 'admin' : user.role_name || user.role,
            status: user.status,
            registrationDate: user.created_at || user.registrationDate,
        };
    }

    async deleteUser(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    }

    // Booking Management
    async getBookings(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<PaginatedResponse<any>> {
        const response = await api.get<any>('/bookings', { params });

        // Backend returns { success, data: { bookings: [...], pagination: {...} } }
        const payload = response.data.data ?? response.data;
        const rawBookings: any[] = payload.bookings ?? payload.data ?? payload ?? [];

        const transformedData = rawBookings.map((booking: any) => ({
            id: booking.id,
            userId: booking.user_id || booking.userId,
            packageId: booking.package_id || booking.packageId,
            bookingReference: booking.booking_reference || booking.bookingReference,
            userFullName: booking.user_name || booking.user_full_name || booking.userFullName,
            userEmail: booking.user_email || booking.userEmail,
            packageTitle: booking.package_name || booking.package_title || booking.packageTitle,
            packageDestination: booking.destination || booking.packageDestination,
            bookingDate: booking.booking_date || booking.bookingDate || booking.created_at,
            travelDate: booking.travel_date || booking.travelDate,
            participants: booking.participants,
            totalAmount: booking.total_amount || booking.totalAmount,
            status: booking.status,
            paymentStatus: booking.payment_status || booking.paymentStatus,
            specialRequests: booking.special_requests || booking.specialRequests,
            createdAt: booking.created_at || booking.createdAt,
            updatedAt: booking.updated_at || booking.updatedAt,
        }));

        return {
            success: true,
            message: '',
            data: transformedData,
            pagination: payload.pagination ?? { total: transformedData.length, page: 1, limit: transformedData.length, totalPages: 1 },
        };
    }

    async getBooking(id: number): Promise<any> {
        const response = await api.get<ApiResponse<any>>(`/bookings/${id}`);
        const booking = response.data.data;
        
        // Transform backend response to frontend format
        return {
            id: booking.id,
            userId: booking.user_id || booking.userId,
            packageId: booking.package_id || booking.packageId,
            userFullName: booking.user_full_name || booking.userFullName,
            packageTitle: booking.package_title || booking.packageTitle,
            bookingDate: booking.booking_date || booking.bookingDate,
            travelDate: booking.travel_date || booking.travelDate,
            participants: booking.participants,
            totalAmount: booking.total_amount || booking.totalAmount,
            status: booking.status,
            paymentStatus: booking.payment_status || booking.paymentStatus,
            specialRequests: booking.special_requests || booking.specialRequests,
            createdAt: booking.created_at || booking.createdAt,
            updatedAt: booking.updated_at || booking.updatedAt,
        };
    }

    async createBooking(bookingData: {
        packageId: number;
        travelDate: string;
        participants: number;
        emergencyContact?: string;
        specialRequests?: string;
    }): Promise<any> {
        const response = await api.post<ApiResponse<any>>('/bookings', {
            package_id: bookingData.packageId,
            travel_date: bookingData.travelDate,
            participants: bookingData.participants,
            emergency_contact: bookingData.emergencyContact,
            special_requests: bookingData.specialRequests,
        });
        return response.data.data;
    }

    async updateBookingStatus(id: number, status: string, reason?: string): Promise<any> {
        const response = await api.put<ApiResponse<any>>(`/bookings/${id}/status`, {
            status,
            reason,
        });
        return response.data.data;
    }

    async cancelBooking(id: number, reason: string): Promise<any> {
        const response = await api.put<ApiResponse<any>>(`/bookings/${id}/cancel`, {
            reason,
        });
        return response.data.data;
    }

    async getBookingStatistics(): Promise<any> {
        const response = await api.get<ApiResponse<any>>('/bookings/statistics');
        return response.data.data;
    }

    // Package Management (Admin only)
    async createPackage(packageData: FormData): Promise<Package> {
        const response = await api.post<ApiResponse<Package>>('/packages', packageData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }

    async updatePackage(id: number, packageData: FormData): Promise<Package> {
        const response = await api.put<ApiResponse<Package>>(`/packages/${id}`, packageData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    }

    async deletePackage(id: number): Promise<void> {
        await api.delete(`/packages/${id}`);
    }

    async updatePackageStatus(id: number, status: string): Promise<Package> {
        const response = await api.put<ApiResponse<Package>>(`/packages/${id}`, {
            status,
        });
        return response.data.data;
    }
}

export const apiService = new ApiService();