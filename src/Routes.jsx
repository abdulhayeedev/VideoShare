import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Video from "./pages/Video";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import { useSelector } from "react-redux";

function RequireAuth({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

const Routes = () => (
  <RouterRoutes>
    <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
    <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
    <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
    <Route path="/video/:id" element={<RequireAuth><Video /></RequireAuth>} />
    <Route path="/upload" element={<RequireAuth><Upload /></RequireAuth>} />
    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
    <Route path="/profile/edit" element={<RequireAuth><EditProfile /></RequireAuth>} />
  </RouterRoutes>
);

export default Routes;
