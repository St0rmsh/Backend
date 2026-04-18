import { createBrowserRouter, Navigate } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import CompleteProfilePage from "../features/auth/pages/CompleteProfilePage";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import SellerRoute from "../components/SellerRoute";
import BuyerRoute from "../components/BuyerRoute";

// Legal Suite
import LegalLayout from "../features/legal/components/LegalLayout";
import TermsOfService from "../features/legal/pages/TermsOfService";
import PrivacyPolicy from "../features/legal/pages/PrivacyPolicy";
import ReturnPolicy from "../features/legal/pages/ReturnPolicy";
import ShippingPolicy from "../features/legal/pages/ShippingPolicy";

// Seller Pages
import CreateProducts from "../features/products/pages/CreateProducts";
import ViewProducts from "../features/products/pages/ViewProducts";
import OneProduct from "../features/products/components/OneProduct";
import SellerReviews from "../features/products/pages/SellerReviews";

// Public / Buyer Pages
import Products from "../features/products/pages/Products";
import ProductDetails from "../features/products/components/ProductDetails";

// Cart Suite
import CartPage from "../features/cart/pages/CartPage";
import PaymentPage from "../features/cart/pages/PaymentPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/products" replace />
    },
    {
        path: "/products",
        element: <Products />
    },
    {
        path: "/products/:id",
        element: <ProductDetails />
    },
    {
        path: "/cart",
        element: <CartPage />
    },
    {
        path: "/payment",
        element: <PaymentPage />
    },

    // ─── BUYER ROUTES (auth + buyer role) ───────────
    {
        element: <BuyerRoute />,
        children: [
            {
                path: "/home",
                element: (
                    <div className="min-h-screen bg-[#131313] text-white p-10 flex flex-col items-center justify-center relative overflow-hidden">
                        <h1 className="text-6xl font-black italic mb-4 tracking-tighter">SNITCH</h1>
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Home Page (Buyer Only)</p>
                    </div>
                )
            }
        ]
    },

    // ─── SELLER ROUTES (auth + seller role) ─────────
    {
        element: <SellerRoute />,
        children: [
            {
                path: "/seller/create",
                element: <CreateProducts />
            },
            {
                path: "/seller",
                element: <ViewProducts />
            },
            {
                path: "/seller/reviews",
                element: <SellerReviews />
            },
            {
                path: "/seller/:id",
                element: <OneProduct />
            }
        ]
    },

    // ─── AUTH ROUTES (public only, redirect if logged in) ─
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

    // ─── PROFILE COMPLETION ─────────────────────────
    {
        path: "/complete-profile",
        element: <CompleteProfilePage />
    },

    // ─── LEGAL PAGES ────────────────────────────────
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

    // ─── CATCH-ALL ──────────────────────────────────
    {
        path: "*",
        element: <Navigate to="/products" replace />
    }
]);