export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  description: string;
  createdAt: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibilityCriteria: string;
  benefits: string[];
  applicationDeadline: string;
  status: 'active' | 'inactive';
  maxBeneficiaries: number;
  currentBeneficiaries: number;
  createdAt: string;
}

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  studentId: string;
  studentName: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  reason?: string;
}

export interface DiscountRule {
  id: string;
  name: string;
  condition: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

export interface Entitlement {
  id: string;
  studentId: string;
  type: 'PLAN_ACCESS' | 'STORE_ACCESS' | 'WALLET_CREDITS' | 'COURSE_UNLOCK' | 'PREMIUM_FEATURES';
  value: string | number;
  description: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export const sampleCoupons: Coupon[] = [
  {
    id: 'CPN001',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrderValue: 500,
    maxDiscount: 200,
    expiryDate: '2024-12-31',
    isActive: true,
    usageLimit: 1000,
    usedCount: 245,
    description: 'Welcome discount for new users',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'CPN002',
    code: 'STUDENT50',
    type: 'fixed',
    value: 50,
    minOrderValue: 200,
    expiryDate: '2024-06-30',
    isActive: true,
    usageLimit: 500,
    usedCount: 89,
    description: 'Fixed discount for students',
    createdAt: '2024-02-01T10:00:00Z'
  }
];

export const sampleScholarships: Scholarship[] = [
  {
    id: 'SCH001',
    name: 'Merit Scholarship 2024',
    description: 'Scholarship for academically excellent students',
    eligibilityCriteria: 'Minimum 85% in previous academic year',
    benefits: ['Free Premium Plan for 1 year', '₹1000 wallet credit', 'Priority support'],
    applicationDeadline: '2024-08-31',
    status: 'active',
    maxBeneficiaries: 100,
    currentBeneficiaries: 23,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'SCH002',
    name: 'Need-based Scholarship',
    description: 'Financial assistance for economically disadvantaged students',
    eligibilityCriteria: 'Family income below ₹3 lakhs per annum',
    benefits: ['50% discount on all plans', '₹500 wallet credit'],
    applicationDeadline: '2024-09-30',
    status: 'active',
    maxBeneficiaries: 200,
    currentBeneficiaries: 67,
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export const sampleScholarshipApplications: ScholarshipApplication[] = [
  {
    id: 'APP001',
    scholarshipId: 'SCH001',
    studentId: 'STU001',
    studentName: 'Rahul Kumar',
    applicationDate: '2024-02-15',
    status: 'pending',
    documents: ['marksheet.pdf', 'income_certificate.pdf']
  },
  {
    id: 'APP002',
    scholarshipId: 'SCH001',
    studentId: 'STU002',
    studentName: 'Priya Sharma',
    applicationDate: '2024-02-10',
    status: 'approved',
    documents: ['marksheet.pdf', 'income_certificate.pdf'],
    reason: 'Excellent academic performance'
  }
];

export const sampleDiscountRules: DiscountRule[] = [
  {
    id: 'RULE001',
    name: 'Premium Plan Discount',
    condition: 'If plan = Premium then 15% off',
    discountType: 'percentage',
    discountValue: 15,
    isActive: true,
    priority: 1,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'RULE002',
    name: 'Bulk Order Discount',
    condition: 'If order value > ₹2000 then ₹300 off',
    discountType: 'fixed',
    discountValue: 300,
    isActive: true,
    priority: 2,
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export const sampleEntitlements: Entitlement[] = [
  {
    id: 'ENT001',
    studentId: 'STU001',
    type: 'PLAN_ACCESS',
    value: 'Premium',
    description: 'Premium plan access via scholarship',
    grantedBy: 'Merit Scholarship 2024',
    grantedAt: '2024-02-20T10:00:00Z',
    expiresAt: '2025-02-20T10:00:00Z',
    isActive: true
  },
  {
    id: 'ENT002',
    studentId: 'STU001',
    type: 'WALLET_CREDITS',
    value: 1000,
    description: 'Scholarship wallet credit',
    grantedBy: 'Merit Scholarship 2024',
    grantedAt: '2024-02-20T10:00:00Z',
    isActive: true
  }
];