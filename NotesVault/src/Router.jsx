// router.js
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "/src/components/ProtectedRoute";
//import AllNotes from "/src/components/Notes/AllNotes.jsx";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AllNotes from "./components/Notes/AllNotes";
import NoteDetails from "./components/Notes/NoteDetails";
import CreateNote from "./components/Notes/CreateNote";
import Navbar from "./components/Navbar";
//import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import AccessDenied from "./components/Auth/AccessDenied";
import Admin from "./components/AuditLogs/Admin";
import UserProfile from "./components/Auth/UserProfile";
import ForgotPassword from "./components/Auth/ForgotPassword";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import { Toaster } from "react-hot-toast";
import NotFound from "./components/NotFound";
import ContactPage from "./components/contactPage/ContactPage";
import AboutPage from "./components/aboutPage/AboutPage";
import ResetPassword from "./components/Auth/ResetPassword";
import Footer from "./components/Footer/Footer";

console.log("Router");
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // layout wraps all child routes
    children: [
      //{ path: "/", element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "contact", element: <ContactPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "reset-password", element: <ResetPassword /> },
      {
        path: "notes/:id",
        element: (
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "notes",
        element: (
          <ProtectedRoute>
            <AllNotes />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-note",
        element: (
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        ),
      },
      {
        path: "access-denied",
        element: <AccessDenied />,
      },
      {
        path: "admin/*",
        element: (
          <ProtectedRoute adminPage={true}>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "oauth2/redirect",
        element: <OAuth2RedirectHandler />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

console.log("Router Ends");

export default router;
