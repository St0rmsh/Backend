import { Routes, Route, Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '../features/auth/constants/authRoutes'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { SessionExpiryModal } from '../features/auth/components/SessionExpiryModal'

import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage'
import { VerifyOtpPage } from '../features/auth/pages/VerifyOtpPage'
import { ChangePasswordPage } from '../features/auth/pages/ChangePasswordPage'
import { ProfileSettingsPage } from '../features/auth/pages/ProfileSettingsPage'

function App() {
  return (
    <>
      <SessionExpiryModal />
      <Routes>
        <Route path={AUTH_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={AUTH_ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={AUTH_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={AUTH_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={AUTH_ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
        <Route path={AUTH_ROUTES.CHANGE_PASSWORD} element={<ChangePasswordPage />} />
        <Route path={AUTH_ROUTES.PROFILE_SETTINGS} element={<ProfileSettingsPage />} />
        {/* Redirect root to login for now, or you can build a Home page */}
        <Route path="/" element={<Navigate to={AUTH_ROUTES.LOGIN} replace />} />
      </Routes>
    </>
  )
}

export default App
