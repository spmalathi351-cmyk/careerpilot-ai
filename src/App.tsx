import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { WelcomePage } from './pages/WelcomePage';

// Auth Pages
import { StudentLoginPage } from './pages/auth/StudentLoginPage';
import { StudentRegisterPage } from './pages/auth/StudentRegisterPage';
import { RecruiterLoginPage } from './pages/auth/RecruiterLoginPage';
import { RecruiterRegisterPage } from './pages/auth/RecruiterRegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfile';
import { StudentProfileEditPage } from './pages/student/StudentProfileEdit';
import { ResumesListPage } from './pages/student/ResumesListPage';
import { ResumeUploadPage } from './pages/student/ResumeUploadPage';
import { ResumeProcessingPage } from './pages/student/ResumeProcessingPage';
import { ResumeDiagnosticPage } from './pages/student/ResumeDiagnosticPage';
import { ResumePreviewPage } from './pages/student/ResumePreviewPage';
import { ResumeRecommendationsPage } from './pages/student/ResumeRecommendationsPage';
import { ResumeAnalysisPage } from './pages/student/ResumeAnalysisPage';
import { AtsSimulatorPage } from './pages/student/AtsSimulatorPage';
import { AtsInspectorPage } from './pages/student/AtsInspectorPage';
import { CareerGuidancePage } from './pages/student/CareerGuidancePage';
import { CareerRoadmapPage } from './pages/student/CareerRoadmapPage';
import { ApplicationsListPage } from './pages/student/ApplicationsListPage';
import { ApplicationDetailPage } from './pages/student/ApplicationDetailPage';
import { InterviewPrepPage } from './pages/student/InterviewPrepPage';
import { MockInterviewPage } from './pages/student/MockInterviewPage';

// Video Interview
import { VideoInterviewPage } from './pages/interviews/VideoInterviewPage';

// Recruiter Pages
import { RecruiterOverviewPage } from './pages/recruiter/RecruiterOverviewPage';
import { RecruiterDashboardPage } from './pages/recruiter/RecruiterDashboardPage';
import { RecruiterProfilePage } from './pages/recruiter/RecruiterProfilePage';
import { RecruiterProfileEditPage } from './pages/recruiter/RecruiterProfileEditPage';
import { CreateJobPage } from './pages/recruiter/CreateJobPage';
import { CandidateSearchPage } from './pages/recruiter/CandidateSearchPage';
import { CandidateTablePage } from './pages/recruiter/CandidateTablePage';
import { CandidateDossierPage } from './pages/recruiter/CandidateDossierPage';

// Notifications & Admin
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* All routes within unified AppLayout */}
              <Route element={<AppLayout />}>
                {/* Landing Welcome Page */}
                <Route path="/" element={<WelcomePage />} />

                {/* Authentication Routes */}
                <Route path="/auth/student/login" element={<StudentLoginPage />} />
                <Route path="/auth/student/register" element={<StudentRegisterPage />} />
                <Route path="/auth/recruiter/login" element={<RecruiterLoginPage />} />
                <Route path="/auth/recruiter/register" element={<RecruiterRegisterPage />} />

                {/* Student Protected Routes */}
                <Route
                  path="/student/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile/edit"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentProfileEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumesListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/upload"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeUploadPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/validate"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeUploadPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/processing/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeProcessingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/:id/diagnostic"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeDiagnosticPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/:id/preview"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumePreviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resumes/:id/recommendations"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeRecommendationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/resume-analysis"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ResumeAnalysisPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/ats-simulator"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <AtsSimulatorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/ats-simulator/inspector/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <AtsInspectorPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/career-guidance"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <CareerGuidancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/career-guidance/roadmap"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <CareerRoadmapPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/applications"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ApplicationsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/applications/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <ApplicationDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/interview-prep"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <InterviewPrepPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/interview-prep/mock/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <MockInterviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* Video Interview */}
                <Route
                  path="/interviews/video/:id"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <VideoInterviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/overview"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterOverviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/profile"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/profile/edit"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterProfileEditPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/create"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <CreateJobPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/candidates/search"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <CandidateSearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/candidates/table"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <CandidateTablePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/candidates/:id"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <CandidateDossierPage />
                    </ProtectedRoute>
                  }
                />

                {/* Notifications & Admin Console */}
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback to Welcome */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
