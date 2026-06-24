import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { InterviewSetupPage } from '@/pages/InterviewSetupPage'
import { InterviewRoomPage } from '@/pages/InterviewRoomPage'
import { InterviewDeviceCheckPage } from '@/pages/InterviewDeviceCheckPage'
import { InterviewResultPage } from '@/pages/InterviewResultPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { PortfolioListPage } from '@/pages/PortfolioListPage'
import { PortfolioDetailPage } from '@/pages/PortfolioDetailPage'
import { PortfolioBuilderPage } from '@/pages/PortfolioBuilderPage'
import { PortfolioUploadPage } from '@/pages/PortfolioUploadPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { GithubCallbackPage } from '@/pages/GithubCallbackPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/interview/new', element: <InterviewSetupPage /> },
      { path: '/interview/result/:id', element: <InterviewResultPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/portfolio', element: <PortfolioListPage /> },
      { path: '/portfolio/:id', element: <PortfolioDetailPage /> },
      { path: '/portfolio/new', element: <PortfolioBuilderPage /> },
      { path: '/portfolio/upload', element: <PortfolioUploadPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/interview/check',
    element: <InterviewDeviceCheckPage />,
  },
  {
    path: '/interview/room',
    element: <InterviewRoomPage />,
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/github/callback', element: <GithubCallbackPage /> },
])
