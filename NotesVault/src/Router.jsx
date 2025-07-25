// router.js
import { createBrowserRouter } from "react-router-dom";
import Layout from "./Components/Layout";
import ProtectedRoute from "/Components/ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // layout wraps all child routes
    children: [
      { path: "/", element: <LandingPage /> },
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
