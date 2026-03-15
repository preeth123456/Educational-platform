import { Entitlement, sampleEntitlements } from './promoMockData';

export type FeatureKey = 
  | 'PLANS_VIEW'
  | 'CHECKOUT_ACCESS'
  | 'WALLET_ACCESS'
  | 'STORE_ACCESS'
  | 'ORDER_HISTORY'
  | 'PREMIUM_COURSES'
  | 'ADVANCED_ANALYTICS'
  | 'PRIORITY_SUPPORT';

const STORAGE_KEY = 'eduyata_entitlements';

export const entitlementService = {
  getStudentEntitlements(studentId: string): Entitlement[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    const entitlements = stored ? JSON.parse(stored) : sampleEntitlements;
    return entitlements.filter((e: Entitlement) => e.studentId === studentId && e.isActive);
  },

  getAllEntitlements(): Entitlement[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : sampleEntitlements;
  },

  grantEntitlement(entitlement: Omit<Entitlement, 'id' | 'grantedAt'>): void {
    const entitlements = this.getAllEntitlements();
    const newEntitlement: Entitlement = {
      ...entitlement,
      id: `ENT${Date.now()}`,
      grantedAt: new Date().toISOString()
    };
    entitlements.push(newEntitlement);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entitlements));
  },

  revokeEntitlement(entitlementId: string): void {
    const entitlements = this.getAllEntitlements();
    const updated = entitlements.map((e: Entitlement) => 
      e.id === entitlementId ? { ...e, isActive: false } : e
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  hasAccess(studentId: string, featureKey: FeatureKey): boolean {
    const entitlements = this.getStudentEntitlements(studentId);
    
    // Check for specific feature access
    const hasFeatureAccess = entitlements.some(e => {
      if (e.expiresAt && new Date(e.expiresAt) < new Date()) {
        return false; // Expired
      }
      
      switch (featureKey) {
        case 'PREMIUM_COURSES':
          return e.type === 'PLAN_ACCESS' && (e.value === 'Premium' || e.value === 'Pro');
        case 'ADVANCED_ANALYTICS':
          return e.type === 'PREMIUM_FEATURES' || (e.type === 'PLAN_ACCESS' && e.value === 'Premium');
        case 'PRIORITY_SUPPORT':
          return e.type === 'PREMIUM_FEATURES' || (e.type === 'PLAN_ACCESS' && (e.value === 'Premium' || e.value === 'Pro'));
        default:
          return e.type === 'PLAN_ACCESS' || e.type === featureKey.replace('_ACCESS', '_ACCESS') as any;
      }
    });

    return hasFeatureAccess;
  },

  getAccessSummary(studentId: string): {
    hasActivePlan: boolean;
    planType?: string;
    walletCredits: number;
    premiumAccess: boolean;
    expiryDate?: string;
  } {
    const entitlements = this.getStudentEntitlements(studentId);
    
    const planEntitlement = entitlements.find(e => e.type === 'PLAN_ACCESS');
    const walletEntitlements = entitlements.filter(e => e.type === 'WALLET_CREDITS');
    const totalCredits = walletEntitlements.reduce((sum, e) => sum + Number(e.value), 0);
    
    return {
      hasActivePlan: !!planEntitlement,
      planType: planEntitlement?.value as string,
      walletCredits: totalCredits,
      premiumAccess: this.hasAccess(studentId, 'PREMIUM_COURSES'),
      expiryDate: planEntitlement?.expiresAt
    };
  }
};