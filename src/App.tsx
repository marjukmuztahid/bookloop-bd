import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui/GlassToast";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";
import ListingDetail from "./pages/ListingDetail.tsx";
import Checkout from "./pages/Checkout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import SellBook from "./pages/SellBook.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import ListingsQueue from "./pages/admin/ListingsQueue.tsx";
import OrdersQueue from "./pages/admin/OrdersQueue.tsx";
import ActiveDeliveries from "./pages/admin/ActiveDeliveries.tsx";
import UsersPage from "./pages/admin/Users.tsx";
import Analytics from "./pages/admin/Analytics.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
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
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
