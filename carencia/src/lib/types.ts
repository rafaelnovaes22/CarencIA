import {
    User as PrismaUser,
    Buyer as PrismaBuyer,
    Dealership as PrismaDealership,
    Vehicle as PrismaVehicle,
    Match as PrismaMatch,
    Lead as PrismaLead,
    SocialProfileData as PrismaSocialProfileData,
    SocialPost as PrismaSocialPost,
    LifestyleAnalysis as PrismaLifestyleAnalysis,
    UserType,
    LifestyleCategory,
    UrgencyLevel,
    SubscriptionPlan,
    TransmissionType,
    FuelType,
    VehicleStatus,
    LeadStatus,
    PlatformType
} from '@prisma/client';

// Re-export Prisma types
export type {
    UserType,
    LifestyleCategory,
    UrgencyLevel,
    SubscriptionPlan,
    TransmissionType,
    FuelType,
    VehicleStatus,
    LeadStatus,
    PlatformType
};

// Extended types with relations
export type User = PrismaUser & {
    buyer?: Buyer;
    dealership?: Dealership;
    socialProfiles?: SocialProfileData[];
};

export type Buyer = PrismaBuyer & {
    user?: User;
};

export type Dealership = PrismaDealership & {
    user?: User;
    vehicles?: Vehicle[];
};

export type Vehicle = PrismaVehicle & {
    dealership?: Dealership;
    matches?: Match[];
    leads?: Lead[];
};

export type Match = PrismaMatch & {
    buyer?: User;
    vehicle?: Vehicle;
};

export type Lead = PrismaLead & {
    buyer?: User;
    dealership?: User;
    vehicle?: Vehicle;
};

export type SocialProfileData = PrismaSocialProfileData & {
    user?: User;
    posts?: SocialPost[];
    lifestyleAnalysis?: LifestyleAnalysis;
};

export type SocialPost = PrismaSocialPost & {
    profileData?: SocialProfileData;
};

export type LifestyleAnalysis = PrismaLifestyleAnalysis & {
    profileData?: SocialProfileData;
};

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    userType: UserType;
    phone?: string;
}

export interface VehicleForm {
    brand: string;
    model: string;
    year: number;
    price: number;
    kilometers: number;
    color: string;
    transmission: TransmissionType;
    fuelType: FuelType;
    features: string[];
    images: File[];
    description?: string;
}

export interface BuyerProfileForm {
    age?: number;
    budgetMin?: number;
    budgetMax?: number;
    location?: string;
    familySize?: number;
    preferredBrands: string[];
    financingNeeded?: boolean;
    urgencyLevel?: UrgencyLevel;
}

export interface DealershipProfileForm {
    companyName: string;
    cnpj: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    brands: string[];
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Quiz Types
export interface QuizAnswer {
    question: string;
    answer: string;
}

export interface QuizResult {
    answers: QuizAnswer[];
    lifestyleCategory: LifestyleCategory;
    urgencyLevel: UrgencyLevel;
    currentCarStatus: string;
}

// Match Factor Type
export interface MatchFactor {
    factor: string;
    weight: number;
    explanation: string;
}

// Car Preference Type
export interface CarPreference {
    category: string;
    preference: string;
    confidence: number;
}

// Analytics Types
export interface Analytics {
    totalBuyers: number;
    totalDealerships: number;
    totalVehicles: number;
    totalMatches: number;
    totalLeads: number;
    conversionRate: number;
    averageMatchScore: number;
    totalSalesGenerated: number;
    topPerformingBrands: string[];
}

// Auth Types
export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
    avatarUrl?: string;
    emailVerified: boolean;
}

export interface JWTPayload {
    userId: string;
    email: string;
    userType: UserType;
    iat?: number;
    exp?: number;
}

// Social Data Types
export interface SocialDataCollection {
    platforms: PlatformType[];
    consentGiven: boolean;
    dataCollected: boolean;
    lastUpdated?: Date;
}

// Upload Types
export interface UploadedFile {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
}

// Search/Filter Types
export interface VehicleFilters {
    brand?: string;
    model?: string;
    yearMin?: number;
    yearMax?: number;
    priceMin?: number;
    priceMax?: number;
    transmission?: TransmissionType;
    fuelType?: FuelType;
    city?: string;
    status?: VehicleStatus;
}

export interface LeadFilters {
    status?: LeadStatus;
    scoreMin?: number;
    dateFrom?: Date;
    dateTo?: Date;
    dealershipId?: string;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: Date;
}

// Dashboard Stats Types
export interface BuyerStats {
    totalMatches: number;
    viewedVehicles: number;
    interestedVehicles: number;
    averageMatchScore: number;
}

export interface DealershipStats {
    totalVehicles: number;
    activeLeads: number;
    convertedLeads: number;
    conversionRate: number;
    totalSales: number;
} 