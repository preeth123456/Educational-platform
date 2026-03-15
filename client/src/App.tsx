import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import LandingPage from "@/pages/landing";
import Dashboard from "@/pages/Dashboard";
import PerformancePage from "@/pages/PerformancePage";
import StudentInfo from "@/pages/StudentInfo";
import SubjectNew from "@/pages/SubjectNew";
import Subject from "@/pages/Subject";
import TeacherDashboard from "@/Teacher/pages/TeacherDashboard";
import CreateAssignment from "@/pages/CreateAssignment";
import TeacherSubmissions from "@/pages/TeacherSubmissions";
import TeacherClasses from "@/pages/TeacherClasses";
import AssignmentsPage from "@/pages/AssignmentsPage";
import NotFound from "@/pages/not-found";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminStudents from "@/pages/AdminStudents";
import AdminTeachers from "@/pages/AdminTeachers";
import AdminTeacherProfile from "@/pages/AdminTeacherProfile";
import NormalAdminTeachers from "@/pages/NormalAdminTeachers";
import NormalAdminDashboard from "@/pages/NormalAdminDashboard";
import NormalAdminVerifyTeachers from "@/pages/NormalAdminVerifyTeachers";
import AdminCourses from "@/pages/AdminCourses";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminFinancialReports from "@/pages/AdminFinancialReports";
import AdminPerformance from "@/pages/AdminPerformance";
import AdminBackup from "@/pages/AdminBackup";
import AdminSettings from "@/pages/AdminSettings";
import AdminCategories from "@/pages/AdminCategories";
import AdminAssignments from "@/pages/AdminAssignments";
import AdminEnrollments from "@/pages/AdminEnrollments";
import AdminSchedulingTasks from "@/pages/AdminSchedulingTasks";
import AdminAnnouncements from "@/pages/AdminAnnouncements";
import AdminCollaborationTools from "@/pages/AdminCollaborationTools";
import SuperAdminManagement from "@/pages/SuperAdminManagement";
import AdminAPIKeys from "@/pages/AdminAPIKeys";
import AdminWebhooks from "@/pages/AdminWebhooks";
import AdminIntegrations from "@/pages/AdminIntegrations";
import AdminConnectors from "@/pages/AdminConnectors";
import AdminRoute from "@/components/AdminRoute";
import NormalAdminCourseDashboard from "@/pages/NormalAdminCourseDashboard";
import NormalAdminCourses from "@/pages/NormalAdminCourses";
import PerformanceDemo from "@/pages/PerformanceDemo";
import ProfileCompletion from "@/pages/ProfileCompletion";
import ProtectedRoute from "@/components/ProtectedRoute";
import FractionChefPage from "@/pages/FractionChef";
import MathMazePage from "@/pages/MathMaze";
import FractionBalloonPage from "@/pages/FractionBalloon";
import PerformanceDetail from "@/pages/PerformanceDetail";
import CreateCourse from "@/Teacher/pages/CreateCourse";
import CourseBuilder from "@/Teacher/pages/CourseBuilder";
import CourseDetails from "@/Teacher/pages/CourseDetailsNew";
import TeacherRegisterPage from "@/Teacher/pages/TeacherRegister";
import TeacherRegistration from "@/pages/TeacherRegistration";
import CreativeTeacherRegister from "@/pages/CreativeTeacherRegister";
import MyCourses from "@/Teacher/pages/MyCourses";
import TeacherLMS from "@/Teacher/pages/TeacherLMS";
import TeacherPerformance from "@/Teacher/pages/TeacherPerformance";
import TeacherAssignments from "@/Teacher/pages/TeacherAssignments";
import TeacherStudents from "@/Teacher/pages/TeacherStudents";
import TeacherInfo from "@/pages/TeacherInfo";
import Settings from "@/pages/Settings";
import Collaboration from "@/pages/Collaboration";
import TeacherProjects from "@/pages/TeacherProjects";
import StudentProjects from "@/pages/StudentProjects";
import StudentChatPage from "@/pages/StudentChatPage";
import BadgesPage from "@/pages/BadgesPage";
import EndorsementsPage from "@/pages/EndorsementsPage";
import VirtualClassroomsPage from "@/pages/VirtualClassroomsPage";
import SSOCallback from "@/pages/SSOCallback";
import UnifiedSupportPage from "@/pages/UnifiedSupportPage";
import TeacherSupportPage from "@/pages/TeacherSupportPage";
import AdminSupport from "@/pages/AdminSupport";
import GrievanceDashboard from "@/components/GrievanceDashboard";
import AdminUsagePage from "@/pages/AdminUsagePage";
import StudentUsagePage from "@/pages/StudentUsagePage";
import AdminBillingConsole from "@/pages/AdminBillingConsole";
import AdminRevenueLedger from "@/pages/AdminRevenueLedger";
import AdminInvoicing from "@/pages/AdminInvoicing";
import AdminRefunds from "@/pages/AdminRefunds";
import AdminPaymentFailures from "@/pages/AdminPaymentFailures";
import StudentBilling from "@/pages/StudentBilling";
import AuditDashboard from "./admin/AuditDashboard";

import ViewBreaches from "@/pages/ViewBreaches";
import TeacherReportBreach from "@/pages/TeacherReportBreach";
import ReportBreach from "@/pages/ReportBreach";
import SessionManagementPage from "@/pages/SessionManagement";
import ContextTestPage from "@/pages/ContextTestPage";

import TeacherCoupons from "@/Teacher/pages/TeacherCoupons";
import TeacherScholarships from "@/Teacher/pages/TeacherScholarships";
import TeacherEntitlements from "@/Teacher/pages/TeacherEntitlements";

import StudentPlans from "@/pages/StudentPlans";
import StudentCheckout from "@/pages/StudentCheckout";
import StudentSubscriptionManagement from "@/pages/StudentSubscriptionManagement";
import StudentStore from "@/pages/StudentStore";
import StudentOrderCheckout from "@/pages/StudentOrderCheckout";
import StudentOrderStatus from "@/pages/StudentOrderStatus";
import StudentMyOrders from "@/pages/StudentMyOrders";
import StudentOrderDetails from "@/pages/StudentOrderDetails";
import CheckoutPage from "@/pages/CheckoutPage";
import OrdersPage from "@/pages/OrdersPage";
import PaymentStatusPage from "@/pages/PaymentStatusPage";
import StudentPaymentStatus from "@/pages/StudentPaymentStatus";
import AdminCheckoutTransactions from "@/pages/AdminCheckoutTransactions";
import StudentWalletPage from "@/pages/StudentWalletPage";

import StudentCoupons from "@/pages/StudentCoupons";
import StudentScholarships from "@/pages/StudentScholarships";
import StudentMyBenefits from "@/pages/StudentMyBenefits";

import AdminCouponManagement from "@/pages/AdminCouponManagement";
import AdminDiscountRules from "@/pages/AdminDiscountRules";
import AdminEntitlementEngine from "@/pages/AdminEntitlementEngine";

import AdminCompliance from "@/pages/AdminCompliance";
import DataRetentionDashboard from "@/admin/DataRetentionDashboard";
import AdminDataManagement from "@/pages/AdminDataManagement";
import SystemHealthDashboard from "@/pages/SystemHealthDashboard";
import AdminVault from "@/pages/AdminVault";
import AccountLockouts from "@/pages/admin/AccountLockouts";
import AdminProductCatalogPricing from "@/pages/AdminProductCatalogPricing";
import AuditViewerPage from "@/pages/AuditViewerPage";

import AdminProducts from "@/pages/admin/AdminProducts";
import AdminTenants from "@/pages/admin/AdminTenants";
import AdminConfigManagement from "@/pages/admin/AdminConfigManagement";
import AdminFeatureFlags from "@/pages/admin/AdminFeatureFlags";
import StudentFeatures from "@/pages/StudentFeatures";

import UnifiedAssistant from "@/components/UnifiedAssistant";
import ConfigProvider from "@/components/ConfigProvider";
import DarkModeToggle from "@/components/DarkModeToggle";
import "@/styles/config-theme.css";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";

// Mock component for OAuth callback
const AdminOAuthCallbackComponent = ({ provider }: { provider: string }) => {
  return <div>OAuth Callback for {provider}</div>;
};

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/teacher-register" component={TeacherRegisterPage} />
      <Route path="/teacher-registration" component={TeacherRegistration} />
      <Route path="/creative-teacher-register" component={CreativeTeacherRegister} />
      <Route path="/sso-callback" component={SSOCallback} />

      {/* OAuth callback routes */}
      <Route path="/auth/callback/:provider">
        {(params: { provider: string }) => (
          <AdminOAuthCallbackComponent provider={params.provider} />
        )}
      </Route>

      {/* ✅ Fixed route - only ONE callback */}
      <Route path="/admin/connectors/:provider/callback">
        {(params: { provider: string }) => (
          <AdminOAuthCallbackComponent provider={params.provider} />
        )}
      </Route>

      {/* Protected student routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/fraction-chef">
        <ProtectedRoute>
          <FractionChefPage />
        </ProtectedRoute>
      </Route>

      <Route path="/performance">
        <ProtectedRoute>
          <PerformancePage />
        </ProtectedRoute>
      </Route>

      <Route path="/performance-detail/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <PerformanceDetail />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/math-maze">
        <ProtectedRoute>
          <MathMazePage />
        </ProtectedRoute>
      </Route>

      <Route path="/fraction-balloon">
        <ProtectedRoute>
          <FractionBalloonPage />
        </ProtectedRoute>
      </Route>

      <Route path="/performance-demo">
        <ProtectedRoute>
          <PerformanceDemo />
        </ProtectedRoute>
      </Route>

      <Route path="/student-info">
        <ProtectedRoute>
          <StudentInfo />
        </ProtectedRoute>
      </Route>

      <Route path="/assignments">
        <ProtectedRoute>
          <AssignmentsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>

      <Route path="/collaboration">
        <ProtectedRoute>
          <Collaboration />
        </ProtectedRoute>
      </Route>

      <Route path="/student-chat">
        <ProtectedRoute>
          <StudentChatPage />
        </ProtectedRoute>
      </Route>

      <Route path="/badges">
        <ProtectedRoute>
          <BadgesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/endorsements">
        <ProtectedRoute>
          <EndorsementsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/virtual-classrooms">
        <ProtectedRoute>
          <VirtualClassroomsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/student-features">
        <ProtectedRoute>
          <StudentFeatures />
        </ProtectedRoute>
      </Route>

      <Route path="/support">
        <ProtectedRoute>
          <UnifiedSupportPage />
        </ProtectedRoute>
      </Route>

      <Route path="/my-usage">
        <ProtectedRoute>
          <StudentUsagePage />
        </ProtectedRoute>
      </Route>

      <Route path="/my-invoices">
        <ProtectedRoute>
          <StudentBilling />
        </ProtectedRoute>
      </Route>

      {/* Student Plans and Checkout routes */}
      <Route path="/student/plans">
        <ProtectedRoute>
          <StudentPlans />
        </ProtectedRoute>
      </Route>

      <Route path="/student/checkout/:planId">
        {(params: { planId: string }) => (
          <ProtectedRoute>
            <StudentCheckout />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/student/payment-status">
        <ProtectedRoute>
          <StudentPaymentStatus />
        </ProtectedRoute>
      </Route>

      <Route path="/student/subscription-management">
        <ProtectedRoute>
          <StudentSubscriptionManagement />
        </ProtectedRoute>
      </Route>

      <Route path="/student/payment-history">
        <ProtectedRoute>
          <StudentBilling />
        </ProtectedRoute>
      </Route>

      <Route path="/student/store">
        <ProtectedRoute>
          <StudentStore />
        </ProtectedRoute>
      </Route>

      <Route path="/student/order-checkout/:itemId">
        {(params: { itemId: string }) => (
          <ProtectedRoute>
            <StudentOrderCheckout />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/student/order-status">
        <ProtectedRoute>
          <StudentOrderStatus />
        </ProtectedRoute>
      </Route>

      <Route path="/student/my-orders">
        <ProtectedRoute>
          <StudentMyOrders />
        </ProtectedRoute>
      </Route>

      <Route path="/student/order/:orderId">
        {(params: { orderId: string }) => (
          <ProtectedRoute>
            <StudentOrderDetails />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/student/store/checkout">
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      </Route>

      <Route path="/student/orders">
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      </Route>

      <Route path="/student/store/payment-status">
        <ProtectedRoute>
          <PaymentStatusPage />
        </ProtectedRoute>
      </Route>

      <Route path="/student/wallet">
        <ProtectedRoute>
          <StudentWalletPage />
        </ProtectedRoute>
      </Route>

      {/* Student Benefits */}
      <Route path="/student/coupons">
        <ProtectedRoute>
          <StudentCoupons />
        </ProtectedRoute>
      </Route>

      <Route path="/student/scholarships">
        <ProtectedRoute>
          <StudentScholarships />
        </ProtectedRoute>
      </Route>

      <Route path="/student/my-benefits">
        <ProtectedRoute>
          <StudentMyBenefits />
        </ProtectedRoute>
      </Route>

      {/* Teacher routes */}
      <Route path="/teacher-dashboard">
        <ProtectedRoute>
          <TeacherDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/create-assignment" component={CreateAssignment} />
      <Route path="/teacher-submissions" component={TeacherSubmissions} />
      <Route path="/teacher-classes" component={TeacherClasses} />

      <Route path="/create-course">
        <ProtectedRoute>
          <CreateCourse />
        </ProtectedRoute>
      </Route>

      <Route path="/course-builder">
        <ProtectedRoute>
          <CourseBuilder />
        </ProtectedRoute>
      </Route>

      <Route path="/my-courses">
        <ProtectedRoute>
          <MyCourses />
        </ProtectedRoute>
      </Route>

      <Route path="/course-details">
        <ProtectedRoute>
          <CourseDetails />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-lms">
        <ProtectedRoute>
          <TeacherLMS />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-performance">
        <ProtectedRoute>
          <TeacherPerformance />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-assignments">
        <ProtectedRoute>
          <TeacherAssignments />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-projects">
        <ProtectedRoute>
          <TeacherProjects />
        </ProtectedRoute>
      </Route>

      <Route path="/student-projects">
        <ProtectedRoute>
          <StudentProjects />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-students">
        <ProtectedRoute>
          <TeacherStudents />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-info">
        <ProtectedRoute>
          <TeacherInfo />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-support">
        <ProtectedRoute>
          <TeacherSupportPage />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher-report-breach">
        <ProtectedRoute>
          <TeacherReportBreach />
        </ProtectedRoute>
      </Route>

      {/* Teacher Benefits and Access routes */}
      <Route path="/teacher/coupons">
        <ProtectedRoute>
          <TeacherCoupons />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/scholarships">
        <ProtectedRoute>
          <TeacherScholarships />
        </ProtectedRoute>
      </Route>

      <Route path="/teacher/entitlements">
        <ProtectedRoute>
          <TeacherEntitlements />
        </ProtectedRoute>
      </Route>

      {/* Course routes */}
      <Route path="/courses">
        <ProtectedRoute>
          <Courses />
        </ProtectedRoute>
      </Route>

      <Route path="/course/:id">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <CourseDetail courseId={params.id} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/course/:id/learn">
        {(params: { id: string }) => (
          <ProtectedRoute>
            <SubjectNew courseId={params.id} />
          </ProtectedRoute>
        )}
      </Route>

      {/* Admin routes */}
      <Route path="/admin-login" component={AdminLogin} />

      <Route path="/admin-dashboard">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>

      <Route path="/admin/grievances">
        <AdminRoute>
          <GrievanceDashboard adminId={1} />
        </AdminRoute>
      </Route>

      <Route path="/admin/checkout-transactions">
        <AdminRoute>
          <AdminCheckoutTransactions />
        </AdminRoute>
      </Route>

      <Route path="/admin/students">
        <AdminRoute>
          <AdminStudents />
        </AdminRoute>
      </Route>

      <Route path="/admin/teachers">
        <AdminRoute>
          <AdminTeachers />
        </AdminRoute>
      </Route>

      <Route path="/admin/teacher/:id">
        <AdminRoute>
          <AdminTeacherProfile />
        </AdminRoute>
      </Route>

      <Route path="/admin/courses">
        <AdminRoute>
          <AdminCourses />
        </AdminRoute>
      </Route>

      <Route path="/admin/analytics">
        <AdminRoute>
          <AdminAnalytics />
        </AdminRoute>
      </Route>

      <Route path="/admin/financial-reports">
        <AdminRoute>
          <AdminFinancialReports />
        </AdminRoute>
      </Route>

      <Route path="/admin/performance">
        <AdminRoute>
          <AdminPerformance />
        </AdminRoute>
      </Route>

      <Route path="/admin/backup">
        <AdminRoute>
          <AdminBackup />
        </AdminRoute>
      </Route>

      <Route path="/admin/settings">
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      </Route>

      <Route path="/admin/categories">
        <AdminRoute>
          <AdminCategories />
        </AdminRoute>
      </Route>

      <Route path="/admin/developers/api-keys">
        <AdminRoute>
          <AdminAPIKeys />
        </AdminRoute>
      </Route>

      <Route path="/admin/developers/webhooks">
        <AdminRoute>
          <AdminWebhooks />
        </AdminRoute>
      </Route>

      <Route path="/admin/integrations">
        <AdminRoute>
          <AdminIntegrations />
        </AdminRoute>
      </Route>

      <Route path="/admin/assignments">
        <AdminRoute>
          <AdminAssignments />
        </AdminRoute>
      </Route>

      <Route path="/admin/enrollments">
        <AdminRoute>
          <AdminEnrollments />
        </AdminRoute>
      </Route>

      <Route path="/admin/scheduling-tasks">
        <AdminRoute>
          <AdminSchedulingTasks />
        </AdminRoute>
      </Route>

      <Route path="/admin/announcements">
        <AdminRoute>
          <AdminAnnouncements />
        </AdminRoute>
      </Route>

      <Route path="/admin/collaboration-tools">
        <AdminRoute>
          <AdminCollaborationTools />
        </AdminRoute>
      </Route>

      <Route path="/admin/data-management">
        <AdminRoute>
          <AdminDataManagement />
        </AdminRoute>
      </Route>

      <Route path="/admin/connectors">
        <AdminRoute>
          <AdminConnectors />
        </AdminRoute>
      </Route>

      <Route path="/admin/audit-viewer">
        <AdminRoute>
          <AuditViewerPage />
        </AdminRoute>
      </Route>

      <Route path="/admin/products">
        <AdminRoute>
          <AdminProducts />
        </AdminRoute>
      </Route>

      <Route path="/admin/tenants">
        <AdminRoute>
          <AdminTenants />
        </AdminRoute>
      </Route>

      <Route path="/admin/config-management">
        <AdminRoute>
          <AdminConfigManagement />
        </AdminRoute>
      </Route>
      <Route path="/admin/feature-flags">
        <AdminRoute>
          <AdminFeatureFlags />
        </AdminRoute>
      </Route>

      <Route path="/admin/audit">
        <AdminRoute>
          <AuditDashboard />
        </AdminRoute>
      </Route>

      <Route path="/session-management">
        <AdminRoute>
          <SessionManagementPage />
        </AdminRoute>
      </Route>

      <Route path="/admin/compliance">
        <AdminRoute>
          <AdminCompliance />
        </AdminRoute>
      </Route>

      <Route path="/admin/data-retention">
        <AdminRoute>
          <DataRetentionDashboard />
        </AdminRoute>
      </Route>

      <Route path="/admin/report-breach">
        <AdminRoute>
          <ReportBreach />
        </AdminRoute>
      </Route>

      <Route path="/admin/view-breaches">
        <AdminRoute>
          <ViewBreaches />
        </AdminRoute>
      </Route>

      <Route path="/admin/system-health">
        <AdminRoute>
          <SystemHealthDashboard />
        </AdminRoute>
      </Route>

      <Route path="/admin/vault">
        <AdminRoute>
          <AdminVault />
        </AdminRoute>
      </Route>

      <Route path="/admin/security/account-lockouts">
        <AdminRoute>
          <AccountLockouts />
        </AdminRoute>
      </Route>

      <Route path="/admin/admins">
        <AdminRoute>
          <SuperAdminManagement />
        </AdminRoute>
      </Route>

      <Route path="/admin-support">
        <AdminRoute>
          <AdminSupport />
        </AdminRoute>
      </Route>

      <Route path="/admin/usage">
        <AdminRoute>
          <AdminUsagePage />
        </AdminRoute>
      </Route>

      <Route path="/admin/billing">
        <AdminRoute>
          <AdminBillingConsole />
        </AdminRoute>
      </Route>

      <Route path="/admin/revenue">
        <AdminRoute>
          <AdminRevenueLedger />
        </AdminRoute>
      </Route>

      <Route path="/admin/invoicing">
        <AdminRoute>
          <AdminInvoicing />
        </AdminRoute>
      </Route>

      <Route path="/admin/refunds">
        <AdminRoute>
          <AdminRefunds />
        </AdminRoute>
      </Route>

      <Route path="/admin/payment-failures">
        <AdminRoute>
          <AdminPaymentFailures />
        </AdminRoute>
      </Route>

      <Route path="/admin/product-catalog-pricing">
        <AdminRoute>
          <AdminProductCatalogPricing />
        </AdminRoute>
      </Route>

      <Route path="/admin/coupons">
        <AdminRoute>
          <AdminCouponManagement />
        </AdminRoute>
      </Route>

      <Route path="/admin/discount-rules">
        <AdminRoute>
          <AdminDiscountRules />
        </AdminRoute>
      </Route>

      <Route path="/admin/entitlements">
        <AdminRoute>
          <AdminEntitlementEngine />
        </AdminRoute>
      </Route>

      <Route path="/normal-admin/dashboard">
        <AdminRoute>
          <NormalAdminDashboard />
        </AdminRoute>
      </Route>

      <Route path="/normal-admin/verify-teachers">
        <AdminRoute>
          <NormalAdminVerifyTeachers />
        </AdminRoute>
      </Route>

      <Route path="/normal-admin/teachers">
        <AdminRoute>
          <NormalAdminTeachers />
        </AdminRoute>
      </Route>

      <Route path="/normal-admin/courseDashboard">
        <AdminRoute>
          <NormalAdminCourseDashboard />
        </AdminRoute>
      </Route>

      <Route path="/normal-admin/courses">
        <AdminRoute>
          <NormalAdminCourses />
        </AdminRoute>
      </Route>

      <Route path="/profile-completion">
        <ProtectedRoute>
          <ProfileCompletion />
        </ProtectedRoute>
      </Route>

      <Route path="/subject/:courseCode">
        {(params: { courseCode: string }) => (
          <ProtectedRoute>
            <Subject mockCourseCode={params.courseCode} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/context-test">
        <ProtectedRoute>
          <ContextTestPage />
        </ProtectedRoute>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [path] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <TooltipProvider>
          <Toaster />
          <PrivacyPolicyModal />
          <DarkModeToggle />
          <Router />
          {path !== "/login" && path !== "/" && <UnifiedAssistant />}
        </TooltipProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
