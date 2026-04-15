import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import CompleteProfilePage from "../features/auth/pages/CompleteProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Legal Suite
import LegalLayout from "../features/legal/components/LegalLayout";
import TermsOfService from "../features/legal/pages/TermsOfService";
import PrivacyPolicy from "../features/legal/pages/PrivacyPolicy";
import ReturnPolicy from "../features/legal/pages/ReturnPolicy";
import ShippingPolicy from "../features/legal/pages/ShippingPolicy";
import CreateProducts from "../features/products/pages/CreateProducts";
import ViewProducts from "../features/products/pages/ViewProducts";
import OneProduct from "../features/products/components/OneProduct";

export const router = createBrowserRouter([
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: (
                    <div className="min-h-screen bg-[#131313] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/5 blur-[120px] pointer-events-none"></div>
                        <h1 className="text-6xl font-black italic mb-4 tracking-tighter">SNITCH</h1>
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Home Page (Protected)</p>
                    </div>
                )
            }
        ]
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/register",
                element: <RegisterPage />
            },
            {
                path: "/forgot-password",
                element: <ForgotPasswordPage />
            },
            {
                path: "/reset-password/:token",
                element: <ResetPasswordPage />
            }
        ]
    },
    {
        path: "/complete-profile",
        element: <CompleteProfilePage />


    },
    {
        path: "/seller/create",
        element: <CreateProducts />

    },
    {
        path: "/seller",
        element: <ViewProducts />
    },
    {
        path: "/seller/:id",
        element: <OneProduct />
    },
    {
        path: "/legal",
        element: <LegalLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/legal/terms" replace />
            },
            {
                path: "terms",
                element: <TermsOfService />
            },
            {
                path: "privacy",
                element: <PrivacyPolicy />
            },
            {
                path: "returns",
                element: <ReturnPolicy />
            },
            {
                path: "shipping",
                element: <ShippingPolicy />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);