import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// Import pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import PasswordResetPage from "@/pages/auth/PasswordResetPage";
import EmailVerificationPage from "@/pages/auth/EmailVerificationPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import AIIntakePage from "@/pages/intake/AIIntakePage";
import ProposalsPage from "@/pages/business/ProposalsPage";
import ProposalDetailPage from "@/pages/business/ProposalDetailPage";
import ProjectSpacePage from "@/pages/projects/ProjectSpacePage";
import ClientPortalPage from "@/pages/projects/ClientPortalPage";
import AICopilotPage from "@/pages/ai/AICopilotPage";
import RepositoryIntegrationsPage from "@/pages/integrations/RepositoryIntegrationsPage";
import StandupsPage from "@/pages/team/StandupsPage";
import LaunchChecklistPage from "@/pages/launch/LaunchChecklistPage";
import BillingPage from "@/pages/billing/BillingPage";
import TimeTrackingPage from "@/pages/time/TimeTrackingPage";
import HandoverPackPage from "@/pages/handover/HandoverPackPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import HelpPage from "@/pages/help/HelpPage";
import CheckoutPage from "@/pages/payment/CheckoutPage";
import OrderHistoryPage from "@/pages/payment/OrderHistoryPage";
import ContentEditorPage from "@/pages/content/ContentEditorPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import CookiePolicyPage from "@/pages/legal/CookiePolicyPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import ServerErrorPage from "@/pages/error/ServerErrorPage";
import LoadingPage from "@/pages/loading/LoadingPage";

// React Query client with optimal defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="autopilot-theme">
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Intake routes */}
              <Route path="/intake" element={<AIIntakePage />} />
              
              {/* Business process routes */}
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="/proposals/:id" element={<ProposalDetailPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/time-tracking" element={<TimeTrackingPage />} />
              <Route path="/handover" element={<HandoverPackPage />} />
              
              {/* Project routes */}
              <Route path="/projects/:id" element={<ProjectSpacePage />} />
              <Route path="/client-portal/:id" element={<ClientPortalPage />} />
              
              {/* AI routes */}
              <Route path="/ai-copilot" element={<AICopilotPage />} />
              
              {/* Integration routes */}
              <Route path="/integrations" element={<RepositoryIntegrationsPage />} />
              
              {/* Team routes */}
              <Route path="/standups" element={<StandupsPage />} />
              
              {/* Launch routes */}
              <Route path="/launch" element={<LaunchChecklistPage />} />
              
              {/* Settings routes */}
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              
              {/* Help routes */}
              <Route path="/help" element={<HelpPage />} />
              
              {/* Payment routes */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              
              {/* Content routes */}
              <Route path="/content" element={<ContentEditorPage />} />
              
              {/* Legal routes */}
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              
              {/* Loading route */}
              <Route path="/loading" element={<LoadingPage />} />
              
              {/* Error routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
