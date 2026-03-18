import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import ClubProtectedRoute from './ClubProtectedRoute.jsx';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import OAuth2Callback from '../pages/OAuth2Callback';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import HomePage from '../pages/HomePage';

import ClubsListPage from '../pages/clubs/ClubsListPage';
import ClubDetailPage from '../pages/clubs/ClubDetailPage';
import EventsListPage from '../pages/events/EventsListPage';
import EventDetailPage from '../pages/events/EventDetailPage';
import EventFormPage from '../pages/events/EventForm.jsx';       
import MembershipsPage from '../pages/memberships/MembershipsPage';
import MyRegistrationsPage from '../pages/registrations/MyRegistrationsPage';
import UsersPage from '../pages/users/UsersPage';
import ProfilePage from '../pages/users/ProfilePage';

function ProtectedLayout({ superAdminOnly = false }) {
  return (
    <ProtectedRoute superAdminOnly={superAdminOnly}>
      <Layout />
    </ProtectedRoute>
  );
}

export default function AppRouter() {
  return (
    <Routes>

      <Route path="/"                element={<HomePage />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/callback"        element={<OAuth2Callback />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      
      <Route element={<ProtectedLayout />}>
        <Route path="/clubs"            element={<ClubsListPage />} />
        <Route path="/clubs/:id"        element={<ClubDetailPage />} />
        <Route path="/events"           element={<EventsListPage />} />
        <Route path="/events/:id"       element={<EventDetailPage />} />
        <Route path="/memberships"      element={<MembershipsPage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/profile"          element={<ProfilePage />} />

       
        <Route path="/clubs/:id" element={<ClubProtectedRoute />}>
          <Route path="events/create"      element={<EventFormPage mode="create" />} />
          <Route path="events/:eventId/edit" element={<EventFormPage mode="edit" />} />
        </Route>

        
        <Route path="/clubs/:id" element={<ClubProtectedRoute adminOnly />}>
          <Route path="memberships" element={<MembershipsPage />} />
        </Route>
      </Route>

      
      <Route element={<ProtectedLayout superAdminOnly />}>
        <Route path="/users" element={<UsersPage />} />
      </Route>

  
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}