import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./RouteGuards";

// Layout & Auth
import AdminLayout from "../components/layout/AdminLayout";
import Login from "../pages/Login";

// Pages
import Dashboard from "../pages/Dashboard";
import FoodItems from "../pages/FoodItems";
import Users from "../pages/Users";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import Categories from "../pages/Categories";
import ProductAttributes from "../pages/ProductAttributes";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Vegetables from "../pages/Vegetables";
import Grocery from "../pages/Grocery";
import PrintOrders from "../pages/PrintOrders";
import PrintServices from "../pages/PrintServices";
import FoodCategories from "../pages/FoodCategories";
import UserManagement from "../pages/UserManagement";
import DeliveryPartners from "../pages/DeliveryPartners";
import DeliveryPartnerDetails from "../pages/DeliveryPartnerDetails";

// Placeholders for remaining sidebar routes
const PagePlaceholder = (title) => () => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
    <p className="mt-2 text-sm text-slate-500">
      Manage {title.toLowerCase()} settings and records here.
    </p>
  </div>
);

const Electronics = PagePlaceholder("Electronics");
const Stationery = PagePlaceholder("Printing & Stationery");
const Banners = PagePlaceholder("Banners");
const Offers = PagePlaceholder("Offers");
const Coupons = PagePlaceholder("Coupons");

const router = createBrowserRouter([
  // 1. Public Routes (accessible only when logged out)
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <Login /> },
    ],
  },

  // 2. Protected Admin Shell (accessible only when authenticated)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          
          // Overview
          { path: "dashboard", element: <Dashboard /> },
          
          // User Management
          { path: "users", element: <UserManagement /> },
          { path: "delivery-partners", element: <DeliveryPartners /> },
          { path: "delivery-partners/:id", element: <DeliveryPartnerDetails /> },
          
          // Catalog & Categories
          { path: "categories", element: <Categories /> },
          { path: "attributes", element: <ProductAttributes /> },

          { path: "food", element: <FoodItems /> },
          { path: "food-categories", element: <FoodCategories /> },
          { path: "vegetables", element: <Vegetables/> },
          { path: "grocery", element: <Grocery /> },
          { path: "electronics", element: <Electronics /> },
          { path: "printing-services", element: <PrintServices /> },
          
          // Promotions
          { path: "banners", element: <Banners /> },
          { path: "offers", element: <Offers /> },
          { path: "coupons", element: <Coupons /> },
          
          // Sales & System
          { path: "orders", element: <Orders /> },
          { path: "analytics", element: <Analytics /> },
          { path: "print-orders", element: <PrintOrders /> },
        ],
      },
    ],
  },

  // 3. Fallback Catch-All
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}