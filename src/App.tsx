import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/GlassToast";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import TopProgressBar from "@/components/layout/TopProgressBar";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SellBook = lazy(() => import("./pages/SellBook"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ListingsQueue = lazy(() => import("./pages/admin/ListingsQueue"));
const OrdersQueue = lazy(() => import("./pages/admin/OrdersQueue"));
const ActiveDeliveries = lazy(() => import("./pages/admin/ActiveDeliveries"));
const UsersPage = lazy(() => import("./pages/admin/Users"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E8357A] border-t-transparent" />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <TopProgressBar />
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/listings/:id" element={<ListingDetail />} />

                  {/* User protected */}
                  <Route path="/checkout/:listingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/sell" element={<ProtectedRoute><SellBook /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

                  {/* Admin */}
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                  <Route path="/admin/listings" element={<AdminProtectedRoute><ListingsQueue /></AdminProtectedRoute>} />
                  <Route path="/admin/orders" element={<AdminProtectedRoute><OrdersQueue /></AdminProtectedRoute>} />
                  <Route path="/admin/deliveries" element={<AdminProtectedRoute><ActiveDeliveries /></AdminProtectedRoute>} />
                  <Route path="/admin/users" element={<AdminProtectedRoute><UsersPage /></AdminProtectedRoute>} />
                  <Route path="/admin/analytics" element={<AdminProtectedRoute><Analytics /></AdminProtectedRoute>} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
