import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";


const LoginPage = lazy(() => import("../features/auth/LoginPage"));
const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const LoanListPage = lazy(() => import("../features/loans/LoanListPage"));
// const LoanDetailsPage = lazy(() => import("../features/loans/LoanDetailsPage"));
const DocumentsPage = lazy(() => import("../features/documents/DocumentsPage"));
const FaqPage = lazy(() => import("../features/faq/FaqPage"));
const ContactPage = lazy(() => import("../features/contact/ContactPage"));
const Users = lazy(() => import("../features/user/users"));

export const appRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "loans", element: <LoanListPage /> },
      // { path: "loans/:id", element: <LoanDetailsPage /> },
      { path: "documents", element: <DocumentsPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "user", element: <Users /> }

    ]
  }
];
